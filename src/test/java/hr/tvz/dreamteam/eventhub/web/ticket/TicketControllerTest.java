package hr.tvz.dreamteam.eventhub.web.ticket;

import hr.tvz.dreamteam.eventhub.TestBase;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TicketControllerTest extends TestBase {

    @Test
    void getUserTickets() throws Exception {
        this.mockMvc.perform(
                        get("/api/user/tickets?eventId=%s".formatted("ebfdfe4c-5bfa-4f34-b860-9b3b5d38ac57"))
                                .with(user("user")
                                        .password("test")
                                        .roles("USER")
                                )
                                .with(csrf())
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)));
    }
}