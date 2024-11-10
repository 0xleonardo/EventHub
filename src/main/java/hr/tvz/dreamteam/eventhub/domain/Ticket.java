package hr.tvz.dreamteam.eventhub.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Ticket {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    private String category;
    private double price;

    @Column(name = "activate_id")
    private UUID activateId;

    @Enumerated(value = EnumType.STRING)
    private TicketStatus status;

    @ManyToOne
    private Event event;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
