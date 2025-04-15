package learn.playlist.domain;

import learn.playlist.data.UserRepository;
import learn.playlist.models.User;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder;
    public UserService(UserRepository repository, BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public List<User> findAll(){return repository.findAll();};

    public User findById(int userId){return repository.findById(userId);};

    public User findByUsername(String username){return repository.findByUsername(username);};

    public User findByEmail(String email){return repository.findByEmail(email);};

    public Result<User> add(User user, String rawPassword){
        Result<User> result = validate(user);

        if (!result.isSuccess()) {
            return result;
        }
        String hashedPassword = encoder.encode(rawPassword);
        user.setPassword(hashedPassword);

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

        if(isValidPassword(user.getPassword())){
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

        return !(hasUppercase && hasSpecialChar) || hasWhitespace;
    }

    public User login(String email, String rawPassword) {
        User user = repository.findByEmail(email);
        if (user != null && encoder.matches(rawPassword, user.getPassword())) {
            return user;
        }
        return null;
    }
}