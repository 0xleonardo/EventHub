package hr.tvz.dreamteam.eventhub.infrastructure.security.validation.email;

import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class NoDuplicateEmailValidator implements ConstraintValidator<NoDuplicateEmail, String> {

    private UserRepository userRepository;

    @Override
    public void initialize(NoDuplicateEmail constraintAnnotation) {
    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return userRepository.findOneByEmail(email).isEmpty();
    }
}
