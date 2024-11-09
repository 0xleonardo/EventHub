package hr.tvz.dreamteam.eventhub.infrastructure.schedulers;

import org.quartz.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SchedulerConfig {

    private static final String PAST_EVENT_CLEAN_JOB_ID = "pastEventCleanJob";
    private static final String PAST_EVENT_CLEAN_JOB_TRIGGER = "pastEventCleanJobTrigger";

    @Bean
    public JobDetail cleanPastEventTickets() {
        return JobBuilder.newJob(CleanPastEventTicketsJob.class)
                .withIdentity(PAST_EVENT_CLEAN_JOB_ID)
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger studentsPrintJobTrigger() {
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInHours(1)
                .repeatForever();

        return TriggerBuilder.newTrigger()
                .forJob(cleanPastEventTickets())
                .withIdentity(PAST_EVENT_CLEAN_JOB_TRIGGER)
                .withSchedule(scheduleBuilder)
                .build();
    }
}
