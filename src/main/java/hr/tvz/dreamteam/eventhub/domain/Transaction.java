package hr.tvz.dreamteam.eventhub.domain;

import hr.tvz.dreamteam.eventhub.infrastructure.security.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Transaction {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    @Column(name = "amount_paid")
    private double amountPaid;
    private Timestamp timestamp;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private Set<Ticket> tickets = new HashSet<>();

    @ManyToOne
    private Event event;
}
