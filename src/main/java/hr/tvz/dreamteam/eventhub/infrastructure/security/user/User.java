package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_account")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @NotNull
    @Column(length = 100, unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @NotNull
    @Column(length = 250, nullable = false)
    private String password;

    @NotNull
    @Column(length = 250, unique = true, nullable = false)
    private String email;

    @Column(name = "image_url")
    private String imageUrl;

    @JsonIgnore
    @ManyToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "authority_id", referencedColumnName = "id")
    private Authority authority;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String about;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

}
