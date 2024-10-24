package hr.tvz.dreamteam.eventhub.infrastructure.security.validation.email;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = NoDuplicateEmailValidator.class)
@Documented
public @interface NoDuplicateEmail {
    String message() default "Email already in use";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
