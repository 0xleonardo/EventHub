package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import hr.tvz.dreamteam.eventhub.infrastructure.security.SecurityUtils;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.ErrorMessage;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.RegisterCommand;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.UserUpdateRequest;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<UserDTO> findByUsername(String username) {
        return userRepository.findOneByUsername(username).map(this::mapUserToDTO);
    }

    @Override
    public Optional<UserDTO> registerUser(RegisterCommand registerDetails) {
        return Optional.of(mapUserToDTO(userRepository.save(mapRegisterCommandToUser(registerDetails))));
    }

    @Override
    public ResponseEntity<Object> updateUser(UserUpdateRequest updateRequest) {
        var userToUpdate = getCurrentUser();

        if (!updateRequest.email().isBlank()) {
            userToUpdate.setEmail(updateRequest.email());
        }

        if (!updateRequest.oldPassword().isBlank() && !updateRequest.newPassword().isBlank()) {
            if (!passwordEncoder.matches(updateRequest.oldPassword(), userToUpdate.getPassword())) {
                return ResponseEntity.badRequest().body("You provided wrong old password");
            }

            userToUpdate.setPassword(passwordEncoder.encode(updateRequest.newPassword()));
        }

        if (userToUpdate.getAuthority().getAuthorityType().equals(AuthorityType.ROLE_USER)) {
            if (!updateRequest.firstName().isBlank()) {
                userToUpdate.setFirstName(updateRequest.firstName());
            }

            if (!updateRequest.lastName().isBlank()) {
                userToUpdate.setLastName(updateRequest.lastName());
            }
        }

        if (userToUpdate.getAuthority().getAuthorityType().equals(AuthorityType.ROLE_ORGANIZER)) {
            if (!updateRequest.about().isBlank()) {
                userToUpdate.setAbout(updateRequest.about());
            }
        }

        if (userToUpdate.getAuthority().getAuthorityType().equals(AuthorityType.ROLE_ORGANIZER)) {
            if (!updateRequest.imageUrl().isBlank()) {
                userToUpdate.setImageUrl(updateRequest.imageUrl());
            }
        }

        try {
            userRepository.save(userToUpdate);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON).body(new ErrorMessage("Error while saving"));
        }
    }

    @Override
    public Page<UserDTO> getAllUsers(String searchQuery, AuthorityType authority, int page, int size) {
        return userRepository.findAllWithFilter(searchQuery, authority, PageRequest.of(page, size)).map(this::mapUserToDTO);
    }

    private UserDTO mapUserToDTO(final User user) {
        return new AppUserDTO(user.getId(), user.getUsername(), user.getEmail(),
                user.getAuthority().getAuthorityType(), user.getCreatedAt(),
                user.getFirstName(), user.getLastName());
    }

    private User mapRegisterCommandToUser(RegisterCommand registerDetails) {
        var newUser = new User();
        var userAuthority = new Authority();
        userAuthority.setAuthorityType(AuthorityType.ROLE_USER);

        newUser.setUsername(registerDetails.username());
        newUser.setPassword(passwordEncoder.encode(registerDetails.password()));
        newUser.setFirstName(registerDetails.firstName());
        newUser.setLastName(registerDetails.lastName());
        newUser.setEmail(registerDetails.email());
        newUser.setAuthority(userAuthority);

        return newUser;
    }

    private User getCurrentUser() {
        var currentlyLoggedUser = SecurityUtils.getCurrentUserUsername();
        return userRepository.findOneByUsername(currentlyLoggedUser.get()).get();
    }
}
