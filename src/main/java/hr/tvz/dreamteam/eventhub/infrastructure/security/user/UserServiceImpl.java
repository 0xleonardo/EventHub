package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import hr.tvz.dreamteam.eventhub.domain.Event;
import hr.tvz.dreamteam.eventhub.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.exception.EventException;
import hr.tvz.dreamteam.eventhub.infrastructure.security.SecurityUtils;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.ErrorMessage;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.RegisterCommand;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.UserUpdateRequest;
import hr.tvz.dreamteam.eventhub.web.event.EventRepository;
import hr.tvz.dreamteam.eventhub.web.tickets.TicketRepository;
import hr.tvz.dreamteam.eventhub.web.transactions.model.EventDTO;
import hr.tvz.dreamteam.eventhub.web.transactions.model.OrganizerUserDTO;
import hr.tvz.dreamteam.eventhub.web.transactions.model.TicketDTO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

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
    public Optional<PublicOrganizerDTO> getOrganizerProfile(String username) {
        return userRepository.findOneByUsernameAndAuthority_AuthorityType(username, AuthorityType.ROLE_ORGANIZER).map(this::mapToPublicOrganizerDTO);
    }

    @Override
    public Page<UserDTO> getAllUsers(String searchQuery, AuthorityType authority, int page, int size) {
        return userRepository.findAllWithFilter(searchQuery, authority, PageRequest.of(page, size)).map(this::mapUserToDTO);
    }

    @Override
    public ResponseEntity<Object> promoteToOrganizer(UserToOrganizerDTO request) {
        var userToPromote = userRepository.findOneById(request.id());

        if (userToPromote.isEmpty() || userToPromote.get().getAuthority().getAuthorityType() != AuthorityType.ROLE_USER) {
            throw EventException.badAction("User isn't found or it already is an organizer");
        }

        var authority = new Authority();
        authority.setAuthorityType(AuthorityType.ROLE_ORGANIZER);
        userToPromote.get().setAuthority(authority);

        userToPromote.get().setFirstName("");
        userToPromote.get().setLastName("");
        userToPromote.get().setAbout("Hi, this is my about section");
        userToPromote.get().setImageUrl("https://iili.io/HtcIWwG.jpg");

        userRepository.save(userToPromote.get());
        return ResponseEntity.ok().build();
    }

    private PublicOrganizerDTO mapToPublicOrganizerDTO(User user) {
        var events = eventRepository.findTop3ByUser_IdAndStatusOrderByDatetimeFrom(user.getId(), EventStatus.ACTIVE).stream().map(this::mapToEventDTO).toList();
        return new PublicOrganizerDTO(user.getId(), user.getUsername(), user.getEmail(), user.getImageUrl(), user.getAbout(), events);
    }

    private EventDTO mapToEventDTO(Event event) {
        return new EventDTO(event.getId(), event.getName(), event.getDescription(), event.getImage(),
                event.getDatetimeFrom(), event.getDatetimeTo(), mapToOrganizerDTO(event.getUser()),
                event.getEventType().getName(), mapToTicketDTO(event.getId()), event.getLocation(), event.getStatus());
    }

    private OrganizerUserDTO mapToOrganizerDTO(User user) {
        return new OrganizerUserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getAbout());
    }

    private List<TicketDTO> mapToTicketDTO(UUID eventId) {
        return ticketRepository.getAllGroupedByForEventId(eventId);
    }

    private UserDTO mapUserToDTO(final User user) {
        System.out.println(user);
        if (user.getAuthority().getAuthorityType().equals(AuthorityType.ROLE_ORGANIZER)) {
            return new OrganizerDTO(user.getId(), user.getUsername(), user.getEmail(),
                    user.getAuthority().getAuthorityType(), user.getCreatedAt(),
                    user.getAbout(), user.getImageUrl());
        } else {
            return new AppUserDTO(user.getId(), user.getUsername(), user.getEmail(),
                    user.getAuthority().getAuthorityType(), user.getCreatedAt(),
                    user.getFirstName(), user.getLastName());
        }
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
