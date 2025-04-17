package learn.playlist.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // secret key from application.properties
    @Value("${jwt.secret}")
    private String secretKey;

    private static Key key;
    private static final long EXPIRATION_TIME = 86400000; // 1 day

    @PostConstruct
    public void init() {
        if (secretKey == null || secretKey.length() < 64) {
            throw new IllegalArgumentException("JWT secret key is invalid or too short. Ensure it's at least 64 characters long.");
        } else {
            key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        }
    }
    public static String generateToken(String email) {
        if (key == null) {
            throw new IllegalStateException("JWT key not initialized. Please check your application config.");
        }

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public static String extractEmail(String token) {
        if (key == null) {
            throw new IllegalStateException("JWT key not initialized. Please check your application config.");
        }

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
