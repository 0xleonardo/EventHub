package hr.tvz.dreamteam.eventhub.web.statictics.model;

public record AdminDashboardStatisticsDTO(Long totalActiveEvents, Long totalTemplateEvents, Long totalEndedEvents,
                                          Long totalUsers, Long totalOrganizers, Long totalTransactionsIn24Hours) {
}
