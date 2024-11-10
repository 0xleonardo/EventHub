package hr.tvz.dreamteam.eventhub.web.event;

import hr.tvz.dreamteam.eventhub.domain.EventType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventTypeRepository extends JpaRepository<EventType, Long> {

    EventType findEventTypeByName(String name);

    Optional<EventType> findEventTypeById(Long id);

    void deleteById(Long id);
}
