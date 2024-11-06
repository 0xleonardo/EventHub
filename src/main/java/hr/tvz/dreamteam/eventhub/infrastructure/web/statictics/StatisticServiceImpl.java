package hr.tvz.dreamteam.eventhub.infrastructure.web.statictics;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.Event;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventException;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.security.SecurityUtils;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.AuthorityType;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.User;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserRepository;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.EventRepository;
import hr.tvz.dreamteam.eventhub.infrastructure.web.statictics.model.AdminDashboardStatisticsDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.web.statictics.model.EventStatisticsDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.web.tickets.TicketRepository;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.TransactionRepository;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.OrganizerUserDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.TicketDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class StatisticServiceImpl implements StatisticsService {

    private EventRepository eventRepository;
    private UserRepository userRepository;
    private TransactionRepository transactionRepository;
    private TicketRepository ticketRepository;

    @Override
    public AdminDashboardStatisticsDTO getBasicStatistics() {
        return generateBasicData();
    }

    private AdminDashboardStatisticsDTO generateBasicData() {
        var totalActiveEvents = eventRepository.countAllByStatus(EventStatus.ACTIVE);
        var totalTemplateEvents = eventRepository.countAllByStatus(EventStatus.TEMPLATE);
        var totalEndedEvents = eventRepository.countAllByStatus(EventStatus.ENDED);

        var totalUsers = userRepository.countAllByAuthority_AuthorityType(AuthorityType.ROLE_USER);
        var totalOrganizers = userRepository.countAllByAuthority_AuthorityType(AuthorityType.ROLE_ORGANIZER);

        var today = new Timestamp(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
        var transactionsInLast24Hours = transactionRepository.countAllByTimestampIsAfter(today);

        return new AdminDashboardStatisticsDTO(totalActiveEvents, totalTemplateEvents, totalEndedEvents, totalUsers, totalOrganizers, transactionsInLast24Hours);
    }

    @Override
    public EventStatisticsDTO getEventStatistics(UUID eventId) {
        var event = eventRepository.findEventById(eventId);

        if (event.isEmpty()) {
            throw EventException.notFound("Event not found!");
        }

        if (getCurrentUser().getId() != event.get().getUser().getId() && getCurrentUser().getAuthority().getAuthorityType() != AuthorityType.ROLE_ADMIN) {
            throw EventException.notOwner();
        }

        var ticketStats = ticketRepository.getTicketStats(eventId);
        var eventRevenue = ticketRepository.findEventRevenueStats(eventId);

        return new EventStatisticsDTO(ticketStats, eventRevenue, mapToEventDTO(event.get()));
    }

    private User getCurrentUser() {
        var currentlyLoggedUser = SecurityUtils.getCurrentUserUsername();
        return userRepository.findOneByUsername(currentlyLoggedUser.get()).get();
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
}
