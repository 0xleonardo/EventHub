package hr.tvz.dreamteam.eventhub.infrastructure.security.validation.username;

import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class NoDuplicateUsernameValidator implements ConstraintValidator<NoDuplicateUsername, String> {

    private UserRepository userRepository;

    @Override
    public void initialize(NoDuplicateUsername constraintAnnotation) {
    }

    @Override
    public boolean isValid(String username, ConstraintValidatorContext context) {
        return userRepository.findOneByUsername(username).isEmpty();
    }
}
