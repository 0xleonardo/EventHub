package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findOneByUsername(String username);

    Optional<User> findOneByEmail(String email);

    @Query("SELECT u FROM User u WHERE (:searchQuery IS NULL OR (LOWER(u.email) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) " +
            "OR (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) " +
            "OR (LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) " +
            "OR (LOWER(u.username) LIKE LOWER(CONCAT('%', :searchQuery, '%')))) " +
            "AND (:authorityType IS NULL OR (u.authority.authorityType = :authorityType)) ")
    Page<User> findAllWithFilter(String searchQuery, AuthorityType authorityType, Pageable pageable);
}
