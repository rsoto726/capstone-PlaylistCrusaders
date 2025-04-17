package learn.playlist.domain;

import learn.playlist.data.UserRepository;
import learn.playlist.models.RoleName;
import learn.playlist.models.User;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder;
    public UserService(UserRepository repository, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
        ensureAdmin();
    }

    public List<User> findAll(){return repository.findAll();};

    public User findById(int userId){return repository.findById(userId);};

    public User findByUsername(String username){return repository.findByUsername(username);};

    public User findByEmail(String email){return repository.findByEmail(email);};

    public RoleName findUserRole(int userId){return repository.findUserRole(userId);};

    public Result<User> add(User user, String rawPassword){
        Result<User> result = validate(user);

        if (!result.isSuccess()) {
            return result;
        }

        if (repository.findByEmail(user.getEmail()) != null || repository.findByUsername(user.getUsername()) != null) {
            result.addMessage("User with these credentials already in use.", ResultType.INVALID);
            return result;
        }

        String hashedPassword = encoder.encode(rawPassword);
        user.setPassword(hashedPassword);

        List<String> roles = new ArrayList<>(user.getRoles());
        roles.add("USER");
        user.setRoles(roles);

        user=repository.add(user);
        result.setPayload(user);

        return result;
    }

    public Result<User> update(User user){
        Result<User> result = validate(user);

        if (!result.isSuccess()) {
            return result;
        }

        if (user.getUserId() <= 0) {
            result.addMessage("User ID must be set for `update` operation", ResultType.INVALID);
            return result;
        }

        boolean updated = repository.update(user);

        if (!updated) {
            result.addMessage("Could not update user", ResultType.NOT_FOUND);
        } else {
            result.setPayload(user);
        }

        return result;
    }

    public boolean deleteById(int userId) {
        return repository.deleteById(userId);
    }

    private Result<User> validate(User user){
        Result<User> result = new Result<>();

        if(user==null){
            result.addMessage("user cannot be null", ResultType.INVALID);
            return result;
        }

        if(isNullOrBlank(user.getEmail())){
            result.addMessage("email required", ResultType.INVALID);
            return result;
        }

        if(isNullOrBlank(user.getUsername())){
            result.addMessage("username required", ResultType.INVALID);
            return result;
        }

        if(isNullOrBlank(user.getPassword())){
            result.addMessage("password required", ResultType.INVALID);
            return result;
        }

        if(!isValidPassword(user.getPassword())){
            result.addMessage("password must contain an uppercase letter, and a special character", ResultType.INVALID);
        }

        if (!isValidLength(user.getUsername())) {
            result.addMessage("username must be 5-20 characters", ResultType.INVALID);
        }

        if (!isValidLength(user.getPassword())) {
            result.addMessage("password must be 5-20 characters", ResultType.INVALID);
        }



        return result;
    }

    public static boolean isNullOrBlank(String value) {
        return value == null || value.isBlank();
    }

    public static boolean isValidLength(String value){
        return value.length()>4 && value.length()<21;
    }

    public static boolean isValidPassword(String value) {
        boolean hasUppercase = value.matches(".*[A-Z].*");
        boolean hasSpecialChar = value.matches(".*[!@#$^&].*");
        boolean hasWhitespace = value.matches(".*\\s.*");
        boolean isValidLength = value.length() >= 5 && value.length() <= 20;

        return hasUppercase && hasSpecialChar && !hasWhitespace && isValidLength;
    }


    public Result<Boolean> resetPasswordByEmail(String email, String rawPassword) {
        Result<Boolean> result = new Result<>();

        if (rawPassword == null || rawPassword.isEmpty()) {
            result.addMessage("Password cannot be null or empty.", ResultType.INVALID);
            return result;
        }
        if (!isValidPassword(rawPassword)) {
            result.addMessage("Password must be 5–20 characters long, include at least one uppercase letter, one digit, and one special character (!@#$%^&*).", ResultType.INVALID);
            return result;
        }

        User user = repository.findByEmail(email);
        if (user == null) {
            result.addMessage("User not found.", ResultType.NOT_FOUND);
            return result;
        }

        if (encoder.matches(rawPassword, user.getPassword())) {
            result.addMessage("New password must be different from the current password.", ResultType.INVALID);
            return result;
        }

        user.setPassword(encoder.encode(rawPassword));
        boolean updated = repository.update(user);
        result.setPayload(updated);
        return result;
    }

    public User login(String email, String rawPassword) {
        User user = repository.findByEmail(email);

        if (user != null && encoder.matches(rawPassword, user.getPassword())) {
            return user;
        }

        if (user.getRoles().contains("DISABLED")) {
            return null;
        }
        return null;
    }

    private String generateValidRandomPassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String special = "!@#$^&";
        String rest = "abcdefghijklmnopqrstuvwxyz0123456789";
        String combined = upper + special + rest;

        StringBuilder sb = new StringBuilder();
        sb.append(upper.charAt((int)(Math.random() * upper.length())));
        sb.append(special.charAt((int)(Math.random() * special.length())));

        for (int i = 0; i < 8; i++) {
            sb.append(combined.charAt((int)(Math.random() * combined.length())));
        }

        return sb.toString();
    }

    private void ensureAdmin() {

        User user = repository.findByUsername("admin");

        if (user == null) {

            String randomPassword = generateValidRandomPassword();

            user = new User();
            user.setUsername("admin");
            user.setEmail("admin@playlistcrusaders.com");
            user.setPassword(randomPassword);
            user.getRoles().add("ADMIN");

            try {
                Result<User> res = add(user, randomPassword); // 2. admin doesn't exist, add them
                System.out.printf("%n%nRandom admin password: %s%n%n", randomPassword);
                System.out.println(res.getMessages());
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }
    public Result<User> updateRole(int userId, String role) {
        Result<User> result = new Result<>();
        User user = repository.findById(userId);
        if (user == null) {
            result.addMessage("User not found.", ResultType.NOT_FOUND);
            return result;
        }

        user.setRoles(List.of(role));
        if (repository.update(user)) {
            result.setPayload(user);
        } else {
            result.addMessage("Update failed", ResultType.INVALID);
        }

        return result;
    }

}