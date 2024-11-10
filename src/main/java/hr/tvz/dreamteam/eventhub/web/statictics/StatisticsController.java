package hr.tvz.dreamteam.eventhub.web.statictics;

import hr.tvz.dreamteam.eventhub.web.statictics.model.AdminDashboardStatisticsDTO;
import hr.tvz.dreamteam.eventhub.web.statictics.model.EventStatisticsDTO;
import lombok.AllArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("api")
@AllArgsConstructor
public class StatisticsController {

    private StatisticsService statisticsService;

    @Secured("ROLE_ADMIN")
    @GetMapping("/statistics/basic")
    public AdminDashboardStatisticsDTO getDashboardStatistics() {
        return statisticsService.getBasicStatistics();
    }

    @Secured({"ROLE_ORGANIZER", "ROLE_ADMIN"})
    @GetMapping("/event/statistics/{eventId}")
    public EventStatisticsDTO getEventStats(@PathVariable(name = "eventId") UUID eventId) {
        return statisticsService.getEventStatistics(eventId);
    }

}
