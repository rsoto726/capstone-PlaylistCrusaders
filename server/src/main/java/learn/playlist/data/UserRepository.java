package learn.playlist.data;

import learn.playlist.models.User;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserRepository {
    List<User> findAll();

    @Transactional
    User findByUsername(String username);

    @Transactional
    User findByEmail(String email);

    @Transactional
    User findById(int userId);

    @Transactional
    User add(User user);

    @Transactional
    boolean update(User user);

    @Transactional
    boolean deleteById(int userId);
}
