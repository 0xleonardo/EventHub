package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.RegisterCommand;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

public interface UserService {
    Optional<UserDTO> findByUsername(String username);

    Optional<UserDTO> registerUser(RegisterCommand registerDetails);

    ResponseEntity<Object> updateUser(UserUpdateRequest updateRequest);

    Optional<PublicOrganizerDTO> getOrganizerProfile(String username);

    Page<UserDTO> getAllUsers(String searchQuery, AuthorityType authority, int page, int size);

    ResponseEntity<Object> promoteToOrganizer(UserToOrganizerDTO request);

}
