package hr.tvz.dreamteam.eventhub.infrastructure.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class EventException extends RuntimeException {
    private final HttpStatus errorStatus;

    EventException(HttpStatus errorStatus, String message) {
        super(message);
        this.errorStatus = errorStatus;
    }

    public static EventException notFound(String message) {
        return new EventException(HttpStatus.NOT_FOUND, message);
    }

    public static EventException notOwner() {
        return new EventException(HttpStatus.CONFLICT, "You are not owner of this resource");
    }

    public static EventException eventActive(String message) {
        return new EventException(HttpStatus.CONFLICT, message);
    }

    public static EventException badAction(String message) {
        return new EventException(HttpStatus.CONFLICT, message);
    }
}
