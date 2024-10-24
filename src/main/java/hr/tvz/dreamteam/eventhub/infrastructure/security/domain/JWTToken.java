package hr.tvz.dreamteam.eventhub.infrastructure.security.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

@Value
@Getter
@Setter
@AllArgsConstructor
public class JWTToken {

    private String token;

}
