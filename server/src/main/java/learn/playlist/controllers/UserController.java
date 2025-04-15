package learn.playlist.controllers;

import learn.playlist.config.JwtUtil;
import learn.playlist.domain.Result;
import learn.playlist.domain.UserService;
import learn.playlist.models.RoleName;
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

    @GetMapping("/name/{username}")
    public User findByUsername(@PathVariable String username){
        return service.findByUsername(username);
    }

    @GetMapping("/role/{userId}")
    public RoleName findUserRole(@PathVariable int userId){return service.findUserRole(userId);};

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
    public ResponseEntity<?> login(@RequestBody User user) {
        User loggedInUser = service.login(user.getEmail(), user.getPassword());
        if (loggedInUser == null) {
            return ResponseEntity.badRequest().body("Invalid email or password.");
        }
        String token = JwtUtil.generateToken(loggedInUser.getEmail());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", loggedInUser.getEmail()
        ));
    }
}
