package Demo.project.of.sprinboot.SecurityJWT;

import Demo.project.of.sprinboot.Service.UserDetailsimp;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.websocket.Decoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JWTUtils {
    // Authorization -> Beader <Token>
    //extract the beader token in the Authendication

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpiration;

    public String getJWtformHeader(HttpServletRequest request) {
        String beaderToken = request.getHeader("Authorization");
        if (beaderToken != null && beaderToken.startsWith("Bearer ")) {
            return beaderToken.substring(7);
        }
        return null;
    }

    //Generate the token
    public String generateJWT(UserDetailsimp  userDetailsimp) {
        String username = userDetailsimp.getUsername();
        String roles =userDetailsimp.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.joining(","));
        return Jwts.builder()
                .subject(username)
                .claim("roles",roles)
                .issuedAt(new Date())
                .expiration(new Date((new Date().getTime()+jwtExpiration)))
                .signWith(key())
                .compact();
    }
    //generate the name in jwtToken extract the name
    public String getUserNameJwtToken(String token){
        return Jwts.parser().verifyWith((SecretKey) key())
                .build().parseSignedClaims(token).getPayload().getSubject();
    }
    // validate the jwtToken
    public boolean validateToken(String authtoken){
        try {
            Jwts.parser().verifyWith((SecretKey) key())
                   .build().parseSignedClaims(authtoken);
            return true;
        } catch (JwtException e) {
            throw new RuntimeException(e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e);
        }
    }

    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

}
