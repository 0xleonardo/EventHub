package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "AUTHORITY")
@Getter
@Setter
public class Authority implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "authority_type", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthorityType authorityType;

    @OneToMany(mappedBy = "authority")
    private List<User> users;
    

}
