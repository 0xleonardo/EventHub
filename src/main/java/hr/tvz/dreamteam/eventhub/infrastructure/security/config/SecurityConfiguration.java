package hr.tvz.dreamteam.eventhub.infrastructure.security.config;

import hr.tvz.dreamteam.eventhub.infrastructure.security.jwt.JwtAuthenticationEntryPoint;
import hr.tvz.dreamteam.eventhub.infrastructure.security.jwt.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {

    private static final String[] SWAGGER_WHITELIST = {
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-resources/**",
            "/swagger-resources",
            "/swagger-ui**"
    };

    private static final String[] API_WHITELIST = {
            "/api/login", "/api/register", "/api/user", "/user",
            "/api/events", "/api/event-types", "/api/event", "/api/events/priority", "/api/events/most-sold",
            "/api/activate-ticket/*"
    };

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .requestMatchers(SWAGGER_WHITELIST)
                .requestMatchers("/h2-console/**");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/h2-console/**")
                        .disable()
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(API_WHITELIST).permitAll()
                        .requestMatchers(SWAGGER_WHITELIST).permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/error").anonymous()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        httpSecurity.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }

}
