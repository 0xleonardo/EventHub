package hr.tvz.dreamteam.eventhub.infrastructure.security.web;

import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.JWTToken;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.LoginDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.security.domain.RegisterCommand;
import hr.tvz.dreamteam.eventhub.infrastructure.security.jwt.JwtFilter;
import hr.tvz.dreamteam.eventhub.infrastructure.security.jwt.TokenProvider;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000/")
@AllArgsConstructor
public class LoginController {

    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<JWTToken> authenticate(@Valid @RequestBody LoginDTO login) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                login.username(),
                login.password()
        );

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.createToken(authentication);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JwtFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);

        return new ResponseEntity<>(new JWTToken(jwt), httpHeaders, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody RegisterCommand registerDetails) {
        return userService.registerUser(registerDetails).map(userDTO -> ResponseEntity.ok().build()).orElse(ResponseEntity.badRequest().build());
    }
}
