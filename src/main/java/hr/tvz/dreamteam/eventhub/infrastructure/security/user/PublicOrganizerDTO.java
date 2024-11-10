package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import hr.tvz.dreamteam.eventhub.web.transactions.model.EventDTO;

import java.util.List;
import java.util.UUID;

public record PublicOrganizerDTO(UUID id, String username, String email, String imageUrl, String about,
                                 List<EventDTO> events) {
}
