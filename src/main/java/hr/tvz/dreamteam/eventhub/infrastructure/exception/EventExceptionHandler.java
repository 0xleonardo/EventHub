package hr.tvz.dreamteam.eventhub.infrastructure.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class EventExceptionHandler {
    @ExceptionHandler(EventException.class)
    ResponseEntity<EventErrorResponse> handle(EventException eventException) {
        return createResponseEntity(EventErrorResponse.from(eventException));
    }

    private ResponseEntity<EventErrorResponse> createResponseEntity(EventErrorResponse echoErrorResponse) {
        return ResponseEntity.status(echoErrorResponse.statusCode())
                .contentType(MediaType.APPLICATION_JSON)
                .body(echoErrorResponse);
    }

}
