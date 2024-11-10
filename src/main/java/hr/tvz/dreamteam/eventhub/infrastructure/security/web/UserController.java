package hr.tvz.dreamteam.eventhub.infrastructure.security.web;

import hr.tvz.dreamteam.eventhub.infrastructure.security.SecurityUtils;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.UserUpdateRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/user/current")
    public ResponseEntity<UserDTO> getCurrentUser() {
        return SecurityUtils.getCurrentUserUsername()
                .map(username -> userService.findByUsername(username)
                        .map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build())
                )
                .orElseGet(() -> ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).build());
    }

    @PostMapping("/user/update")
    public ResponseEntity<Object> updateCurrentUser(@RequestBody UserUpdateRequest updateRequest) {
        return userService.updateUser(updateRequest);
    }

    @PostMapping("/user")
    public ResponseEntity<PublicOrganizerDTO> getOrganizerProfile(@RequestBody PublicOrganizerProfileRequest request) {
        return userService.getOrganizerProfile(request.username())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @Secured({"ROLE_ADMIN"})
    @GetMapping("/users")
    public Page<UserDTO> getAllUsers(@RequestParam(name = "page", defaultValue = "0") int page,
                                     @RequestParam(name = "size", defaultValue = "6") int size,
                                     @RequestParam(required = false) String searchQuery,
                                     @RequestParam(required = false, name = "authority") AuthorityType authority) {
        return userService.getAllUsers(searchQuery, authority, page, size);
    }

    @Secured({"ROLE_ADMIN"})
    @PostMapping("/user-to-organizer")
    public ResponseEntity<Object> makeOrganizer(@RequestBody @Valid UserToOrganizerDTO request) {
        return userService.promoteToOrganizer(request);
    }

}
