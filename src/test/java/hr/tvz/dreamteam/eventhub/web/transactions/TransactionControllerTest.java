package hr.tvz.dreamteam.eventhub.web.transactions;

import hr.tvz.dreamteam.eventhub.TestBase;
import hr.tvz.dreamteam.eventhub.web.transactions.model.TransactionRequest;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TransactionControllerTest extends TestBase {

    @Test
    @Transactional
    void shouldAssignTickets() throws Exception {
        var request = new TransactionRequest(UUID.fromString("ebfdfe4d-5bfa-4f34-b861-9b3b5d38ac58"), "Regular", 1, 50.00);

        this.mockMvc.perform(
                        post("/api/transaction")
                                .with(user("user")
                                        .password("test")
                                        .roles("USER")
                                )
                                .with(csrf())
                                .contentType(APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                                .accept(APPLICATION_JSON)
                )
                .andExpect(status().isOk());
    }
}