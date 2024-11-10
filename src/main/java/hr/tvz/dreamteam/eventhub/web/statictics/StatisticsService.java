package hr.tvz.dreamteam.eventhub.web.statictics;

import hr.tvz.dreamteam.eventhub.web.statictics.model.AdminDashboardStatisticsDTO;
import hr.tvz.dreamteam.eventhub.web.statictics.model.EventStatisticsDTO;

import java.util.UUID;

public interface StatisticsService {

    AdminDashboardStatisticsDTO getBasicStatistics();

    EventStatisticsDTO getEventStatistics(UUID eventId);
}
