package hr.tvz.dreamteam.eventhub.infrastructure.security;

import hr.tvz.dreamteam.eventhub.infrastructure.security.user.User;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DomainUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String username) {

        return userRepository
                .findOneByUsername(username)
                .map(this::createSpringSecurityUser)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username + " was not found in the database"));
    }

    private org.springframework.security.core.userdetails.User createSpringSecurityUser(User user) {
        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(user.getAuthority().getAuthorityType().toString());
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), List.of(grantedAuthority));
    }
}
