package hr.tvz.dreamteam.eventhub.infrastructure.web.tickets;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.Ticket;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.TicketStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.security.SecurityUtils;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.User;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserRepository;
import hr.tvz.dreamteam.eventhub.infrastructure.web.tickets.model.EventTicketsDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TicketServiceImpl implements TicketService {

    private TicketRepository ticketRepository;
    private UserRepository userRepository;

    @Override
    public List<EventTicketsDTO> findAllUserTicketsForEvent(UUID eventId) {
        return ticketRepository.findAllUserTicketsForEvent(getCurrentUser().getId(), eventId);
    }

    @Override
    public Optional<Ticket> activateTicket(UUID ticketActivateId) {
        var ticketToActivate = ticketRepository.findTicketByActivateId(ticketActivateId);

        if (ticketToActivate.isPresent()
                && ticketToActivate.get().getStatus() != TicketStatus.USED
                && ticketToActivate.get().getStatus() != TicketStatus.FREE) {
            var ticket = ticketToActivate.get();
            ticket.setStatus(TicketStatus.USED);

            return Optional.of(ticketRepository.save(ticket));
        }


        return Optional.empty();
    }

    private User getCurrentUser() {
        var currentlyLoggedUser = SecurityUtils.getCurrentUserUsername();
        return userRepository.findOneByUsername(currentlyLoggedUser.get()).get();
    }
}
