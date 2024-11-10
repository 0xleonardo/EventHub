package hr.tvz.dreamteam.eventhub.web.tickets;

import hr.tvz.dreamteam.eventhub.web.tickets.model.EventTicketsDTO;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api")
@AllArgsConstructor
public class TicketController {

    private TicketService ticketService;

    @GetMapping("/user/tickets")
    public List<EventTicketsDTO> getUserTickets(@RequestParam(name = "eventId") UUID eventId) {
        return ticketService.findAllUserTicketsForEvent(eventId);
    }

    @GetMapping("/activate-ticket/{ticketActivateId}")
    public String activateTicket(@PathVariable @NotNull UUID ticketActivateId) {
        return ticketService.activateTicket(ticketActivateId).map(res -> "ACTIVATED").orElse("FAILED TO ACTIVATE");
    }

}
