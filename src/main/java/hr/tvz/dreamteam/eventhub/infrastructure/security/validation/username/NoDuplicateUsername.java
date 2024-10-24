package hr.tvz.dreamteam.eventhub.infrastructure.security.validation.username;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = NoDuplicateUsernameValidator.class)
@Documented
public @interface NoDuplicateUsername {
    String message() default "User with that username already exists";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
