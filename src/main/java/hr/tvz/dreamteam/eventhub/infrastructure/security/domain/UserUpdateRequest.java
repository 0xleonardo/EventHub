package hr.tvz.dreamteam.eventhub.infrastructure.security.domain;

public record UserUpdateRequest(String firstName, String lastName, String about, String imageUrl, String email,
                                String oldPassword, String newPassword, String confirmPassword) {


}
