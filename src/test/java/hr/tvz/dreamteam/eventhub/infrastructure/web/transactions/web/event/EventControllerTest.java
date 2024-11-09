package hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.web.event;

import com.jayway.jsonpath.JsonPath;
import hr.tvz.dreamteam.eventhub.TestBase;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.create_event.CreateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.create_event.CreateLocationRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.create_event.CreateTicketRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.*;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.UpdateEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventByIdRequest;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class EventControllerTest extends TestBase {

    @Test
    void shouldGetAllActiveEvents() throws Exception {
        this.mockMvc.perform(
                        get("/api/events")
                                .with(csrf())
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(4)));

    }

    @Test
    void shouldGetAllActiveEventsFiltered() throws Exception {
        this.mockMvc.perform(
                        get("/api/events?category=Music Festival")
                                .with(csrf())
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(3)));

    }

    @Test
    void shouldGetEventById() throws Exception {
        var eventByIdRequest = new EventByIdRequest(UUID.fromString("ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57"));

        this.mockMvc.perform(
                        post("/api/event")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(eventByIdRequest))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Summer Music Festival"));

    }

    @Test
    void shouldGetAllEventTypes() throws Exception {
        this.mockMvc.perform(
                        get("/api/event-types")
                                .with(csrf())
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(3)));

    }

    @Test
    void shouldGetAllUserEvents() throws Exception {
        this.mockMvc.perform(
                        get("/api/user/events")
                                .with(user("user")
                                        .password("test")
                                        .roles("USER")
                                )
                                .with(csrf())
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(1)));

    }

    @Test
    void shouldGetAllOrganizerEvents() throws Exception {
        this.mockMvc.perform(
                        get("/api/organizer/events")
                                .with(user("organizer")
                                        .password("test")
                                        .roles("ORGANIZER")
                                )
                                .with(csrf())
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.content", hasSize(1)));

    }

    @Test
    @Transactional
    void shouldCreateNewEvent() throws Exception {
        var request = new CreateEventRequest("test", "test", "Music Festival", "http://example.com", LocalDateTime.now().plusMonths(1), LocalDateTime.now().plusMonths(2),
                List.of(new CreateTicketRequest("test", 10, 10L)), new CreateLocationRequest("test", "test", "test", "test", "test"),
                EventStatus.ACTIVE);

        this.mockMvc.perform(
                        post("/api/event/create")
                                .with(user("organizer")
                                        .password("test")
                                        .roles("ORGANIZER")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$").isString());

    }

    @Test
    @Transactional
    void shouldUpdateEvent() throws Exception {
        var request = new UpdateEventRequest(UUID.fromString("ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57"), "Aquarius Summer Mix", "test", "DJ Party", "http://example.com", LocalDateTime.now().plusMonths(1), LocalDateTime.now().plusMonths(2),
                List.of(new UpdateTicketRequest("test", 10, 10L, 10L, false)), new UpdateLocationRequest("test", "test", "test", "test", "test"));

        var eventByIdRequest = new EventByIdRequest(UUID.fromString("ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57"));

        this.mockMvc.perform(
                        post("/api/event/update")
                                .with(user("organizer2")
                                        .password("test")
                                        .roles("ORGANIZER")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk());

        this.mockMvc.perform(
                        post("/api/event")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(eventByIdRequest))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.description").value("test"));

    }

    @Test
    @Transactional
    void shouldNotUpdateEventIfNotOwner() throws Exception {
        var request = new UpdateEventRequest(UUID.fromString("ebfdfe4c-5bfa-4f34-b860-9c3b5d38ac57"), "Aquarius Summer Mix", "test", "DJ Party", "http://example.com", LocalDateTime.now().plusMonths(1), LocalDateTime.now().plusMonths(2),
                List.of(new UpdateTicketRequest("test", 10, 10L, 10L, false)), new UpdateLocationRequest("test", "test", "test", "test", "test"));

        this.mockMvc.perform(
                        post("/api/event/update")
                                .with(user("organizer")
                                        .password("test")
                                        .roles("ORGANIZER")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Event couldn't be found"));
    }

    @Test
    @Transactional
    void shouldPublishEvent() throws Exception {
        var request = new CreateEventRequest("test", "test", "Music Festival", "http://example.com", LocalDateTime.now().plusMonths(1), LocalDateTime.now().plusMonths(2),
                List.of(new CreateTicketRequest("test", 10, 10L)), new CreateLocationRequest("test", "test", "test", "test", "test"),
                EventStatus.TEMPLATE);

        var mvcResult = this.mockMvc.perform(
                        post("/api/event/create")
                                .with(user("organizer")
                                        .password("test")
                                        .roles("ORGANIZER")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$").isString())
                .andReturn();


        var responseString = mvcResult.getResponse().getContentAsString();
        var newEventUuid = JsonPath.parse(responseString).read("$").toString();

        var publishRequest = new PublishEventRequest(UUID.fromString(newEventUuid));
        var eventByIdRequest = new EventByIdRequest(UUID.fromString(newEventUuid));

        this.mockMvc.perform(
                        post("/api/event/publish")
                                .with(user("organizer")
                                        .password("test")
                                        .roles("ORGANIZER")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(publishRequest))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk());


        this.mockMvc.perform(
                        post("/api/event")
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(eventByIdRequest))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("ACTIVE"));

    }

    @Test
    @Transactional
    void shouldCreateNewEventType() throws Exception {
        var request = new UpdateEventTypeRequest(null, "test", "test");

        this.mockMvc.perform(
                        post("/api/event-type/update-or-create")
                                .with(user("admin")
                                        .password("test")
                                        .roles("ADMIN")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk());
    }

    @Test
    @Transactional
    void shouldDeleteEvent() throws Exception {
        var request = new DeleteEventRequest(UUID.fromString("ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57"));

        this.mockMvc.perform(
                        post("/api/event/delete")
                                .with(user("admin")
                                        .password("test")
                                        .roles("ADMIN")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk());
    }

}
