package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneById(UUID id);

    Optional<User> findOneByUsername(String username);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByUsernameAndAuthority_AuthorityType(@NotNull String username, AuthorityType authority);

    Long countAllByAuthority_AuthorityType(AuthorityType authorityType);

    @Query("SELECT u FROM User u WHERE (:searchQuery IS NULL OR (LOWER(u.email) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) " +
            "OR (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) " +
            "OR (LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) " +
            "OR (LOWER(u.username) LIKE LOWER(CONCAT('%', :searchQuery, '%')))) " +
            "AND (:authorityType IS NULL OR (u.authority.authorityType = :authorityType)) ")
    Page<User> findAllWithFilter(String searchQuery, AuthorityType authorityType, Pageable pageable);
}
