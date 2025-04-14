package learn.playlist.data;

import learn.playlist.models.User;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository {
    @Transactional
    User findByUsername(String username);

    @Transactional
    User findByEmail(String email);

    @Transactional
    User findById(String userId);

    @Transactional
    User add(User user);

    @Transactional
    void update(User user);

    @Transactional
    boolean deleteById(int userId);
}
