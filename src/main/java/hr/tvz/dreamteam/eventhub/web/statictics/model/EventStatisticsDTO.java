package hr.tvz.dreamteam.eventhub.web.statictics.model;


import hr.tvz.dreamteam.eventhub.web.transactions.model.EventDTO;

import java.util.List;

public record EventStatisticsDTO(List<TicketStats> ticketStats, RevenueStats revenueStats, EventDTO event) {
}
