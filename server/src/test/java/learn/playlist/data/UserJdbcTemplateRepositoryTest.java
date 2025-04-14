package learn.playlist.data;

import learn.playlist.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class UserJdbcTemplateRepositoryTest {
    @Autowired
    UserJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void shouldCreateUser() {
        User user = repository.add(createUser());
        assertTrue(user.getUserId() > 0);
    }

    @Test
    void shouldUpdate() {
        User user = createUser();
        user.setUserId(1);
        user.setUsername("AliceRocks");
        repository.update(user);

        User alice = repository.findById(1);
        assertEquals("AliceRocks", alice.getUsername());
    }

    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
    }

    private User createUser() {
        User user = new User();
        user.setUsername("Charlie");
        user.setEmail("example@gmail.com");
        user.setPassword("password");
        return user;
    }
}