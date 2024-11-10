package hr.tvz.dreamteam.eventhub.web.transactions;

import hr.tvz.dreamteam.eventhub.domain.*;
import hr.tvz.dreamteam.eventhub.infrastructure.exception.EventException;
import hr.tvz.dreamteam.eventhub.infrastructure.security.SecurityUtils;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.User;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserRepository;
import hr.tvz.dreamteam.eventhub.web.event.EventRepository;
import hr.tvz.dreamteam.eventhub.web.tickets.TicketRepository;
import hr.tvz.dreamteam.eventhub.web.transactions.model.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private TicketRepository ticketRepository;
    private EventRepository eventRepository;
    private UserRepository userRepository;
    private TransactionRepository transactionRepository;

    @Override
    @Transactional
    public Transaction assignTickets(TransactionRequest transactionRequest) {
        UUID eventId = transactionRequest.eventId();
        String category = transactionRequest.category();
        Integer numberOfTickets = transactionRequest.numberOfTickets();
        double totalPaid = transactionRequest.totalPaid();

        Event event = eventRepository.findById(eventId).orElseThrow(() -> new IllegalArgumentException("Event not found"));
        PageRequest pageRequest = PageRequest.of(0, numberOfTickets);
        List<Ticket> tickets = ticketRepository.findTicketsByEventAndCategory(event, category, TicketStatus.FREE, pageRequest);

        if (tickets.size() < numberOfTickets) {
            throw EventException.notFound("Not enough tickets");
        }

        Transaction transaction = new Transaction();
        transaction.setUser(getCurrentUser());
        transaction.setEvent(event);
        transaction.setPaymentStatus(PaymentStatus.PROCESSED);
        transaction.setTimestamp(new Timestamp(System.currentTimeMillis()));
        transaction.setAmountPaid(totalPaid);

        for (Ticket ticket : tickets) {
            ticket.setTransaction(transaction);
            transaction.getTickets().add(ticket);
            ticket.setStatus(TicketStatus.SOLD);
            ticket.setActivateId(UUID.randomUUID());

            ticketRepository.save(ticket);
        }

        return transactionRepository.save(transaction);
    }

    @Override
    public Page<TransactionDTO> findAllTransactions(String searchQuery, PaymentStatus paymentStatus, int page, int size) {
        return transactionRepository.findAllTransactions(searchQuery, paymentStatus, PageRequest.of(page, size)).map(this::mapToTransactionDTO);
    }

    private TransactionDTO mapToTransactionDTO(Transaction transaction) {
        return new TransactionDTO(transaction.getId(), transaction.getPaymentStatus(), transaction.getAmountPaid(), transaction.getTimestamp(),
                transaction.getTickets().stream().map(this::mapToTicketDTO).toList(), mapToEventDTO(transaction.getEvent()));
    }

    private EventDTO mapToEventDTO(Event event) {
        return new EventDTO(event.getId(), event.getName(), event.getDescription(), event.getImage(),
                event.getDatetimeFrom(), event.getDatetimeTo(), mapToOrganizerDTO(event.getUser()),
                event.getEventType().getName(), mapToTicketDTO(event.getId()), event.getLocation(), event.getStatus());
    }

    private OrganizerUserDTO mapToOrganizerDTO(User user) {
        return new OrganizerUserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getAbout());
    }

    private List<TicketDTO> mapToTicketDTO(UUID eventId) {
        return ticketRepository.getAllGroupedByForEventId(eventId);
    }

    private TransactionTicketDTO mapToTicketDTO(Ticket ticket) {
        return new TransactionTicketDTO(ticket.getId(), ticket.getCategory(), ticket.getPrice(), ticket.getActivateId(), ticket.getStatus());
    }

    private User getCurrentUser() {
        var currentlyLoggedUser = SecurityUtils.getCurrentUserUsername();
        return userRepository.findOneByUsername(currentlyLoggedUser.get()).get();
    }

}
