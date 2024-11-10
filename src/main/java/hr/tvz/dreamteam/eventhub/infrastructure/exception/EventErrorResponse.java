package hr.tvz.dreamteam.eventhub.infrastructure.exception;

public record EventErrorResponse(Integer statusCode, String message) {
    public static EventErrorResponse from(EventException eventException) {
        return new EventErrorResponse(eventException.getErrorStatus().value(), eventException.getMessage());
    }
}
