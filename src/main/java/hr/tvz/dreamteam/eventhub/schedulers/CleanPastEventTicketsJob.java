package hr.tvz.dreamteam.eventhub.schedulers;

import hr.tvz.dreamteam.eventhub.web.event.EventRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.springframework.scheduling.quartz.QuartzJobBean;

@Slf4j
@AllArgsConstructor
public class CleanPastEventTicketsJob extends QuartzJobBean {

    private EventRepository eventRepository;

    @Override
    protected void executeInternal(JobExecutionContext context) {
        eventRepository.makePastEventEnded();
        eventRepository.expirePastEventTickets();
    }


}
