package learn.playlist.controllers;

import learn.playlist.config.JwtUtil;
import learn.playlist.domain.Result;
import learn.playlist.domain.UserService;
import learn.playlist.models.User;
import org.apache.catalina.valves.ErrorReportValve;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/user")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> findAll() {
        return service.findAll();
    }

    @GetMapping("/id/{userId}")
    public User findById(@PathVariable int userId) {
        return service.findById(userId);
    }

    @GetMapping("/email")
    public User findByEmail(@RequestParam String email) {
        return service.findByEmail(email);
    }

    @GetMapping("/username/{username}")
    public User findByUsername(@PathVariable String username){
        return service.findByUsername(username);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> add(@RequestBody User user){
        Result<User> result = service.add(user, user.getPassword());
        if(result.isSuccess()){
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Object> update(@PathVariable int userId, @RequestBody User user){
        if(userId != user.getUserId()){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        Result<User> result = service.update(user);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return ErrorResponse.build(result);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteById(@PathVariable int userId) {
        if (service.deleteById(userId)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User user) {
        User loggedInUser = service.login(user.getEmail(), user.getPassword());
        if (loggedInUser == null) {
            return ResponseEntity.badRequest().body("Invalid email or password.");
        }
        String token = JwtUtil.generateToken(loggedInUser.getEmail());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", loggedInUser
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getOwnProfile(@RequestHeader(value = "Authorization", required = false) String authHeader) {
//        System.out.println("GETTING PROFILE");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);
        try {
            String email = JwtUtil.extractEmail(token);
            User user = service.findByEmail(email);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }
    }


    @GetMapping("/loggedin")
    public ResponseEntity<?> getLoggedInUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
//        System.out.println("GET LOGGED IN CALLED");
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                // No token provided – treat as not logged in
                return ResponseEntity.ok(null);
            }

            String token = authHeader.substring(7); // remove "Bearer "
            String email = JwtUtil.extractEmail(token);
            User user = service.findByEmail(email);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            String newToken = JwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of(
                    "userId", user.getUserId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "roles", user.getRoles(),
                    "token", newToken
            ));
        } catch (Exception e) {
            return new ResponseEntity<>("Invalid or expired token", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/validate-email")
    public ResponseEntity<Object> validateEmail(@RequestParam String email) {
        User user = service.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Email not found.");
        }
        return ResponseEntity.ok("Email is valid.");
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody User user) {
        Result<Boolean> result = service.resetPasswordByEmail(user.getEmail(), user.getPassword());
        if (result.isSuccess()) {
            return ResponseEntity.ok("Password reset successful.");
        }

        return ResponseEntity.badRequest().body(result.getMessages());
    }
}
