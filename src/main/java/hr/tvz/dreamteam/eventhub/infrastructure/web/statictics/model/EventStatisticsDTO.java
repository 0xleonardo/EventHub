package hr.tvz.dreamteam.eventhub.infrastructure.web.statictics.model;


import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventDTO;

import java.util.List;

public record EventStatisticsDTO(List<TicketStats> ticketStats, RevenueStats revenueStats, EventDTO event) {
}
