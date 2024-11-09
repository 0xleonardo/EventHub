package hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.web.statistics;

import hr.tvz.dreamteam.eventhub.TestBase;
import org.junit.jupiter.api.Test;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StatisticsControllerTest extends TestBase {

    @Test
    void shouldGetDashboardStatistics() throws Exception {
        this.mockMvc.perform(
                        get("/api/statistics/basic")
                                .with(user("admin")
                                        .password("test")
                                        .roles("ADMIN")
                                )
                                .with(csrf())
                )
                .andExpect(status().isOk())
                .andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("$.totalActiveEvents").value(4))
                .andExpect(jsonPath("$.totalTemplateEvents").value(0))
                .andExpect(jsonPath("$.totalEndedEvents").value(3))
                .andExpect(jsonPath("$.totalUsers").value(3))
                .andExpect(jsonPath("$.totalOrganizers").value(4))
                .andExpect(jsonPath("$.totalTransactionsIn24Hours").value(3));
    }
}