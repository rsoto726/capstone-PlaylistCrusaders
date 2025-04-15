package learn.playlist.domain;

import learn.playlist.data.UserRepository;
import learn.playlist.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class UserServiceTest {

    @Autowired
    UserService service;

    @MockBean
    UserRepository repository;

    @Test
    void shouldFindUserById() {
        User expected = makeUser();
        when(repository.findById(1)).thenReturn(expected);
        User actual = service.findById(1);
        assertEquals(expected, actual);
    }

    @Test
    void shouldFindUserByUsername() {
        User expected = makeUser();
        when(repository.findByUsername("john_doe")).thenReturn(expected);
        User actual = service.findByUsername("john_doe");
        assertEquals(expected, actual);
    }

    @Test
    void shouldFindUserByEmail() {
        User expected = makeUser();
        when(repository.findByEmail("john_doe@example.com")).thenReturn(expected);
        User actual = service.findByEmail("john_doe@example.com");
        assertEquals(expected, actual);
    }

    @Test
    void shouldNotAddUserWhenInvalid() {
        User user = makeUser();

        user.setPassword("password");
        Result<User> result = service.add(user, user.getPassword());
        assertEquals(ResultType.INVALID, result.getType());

        user.setPassword("Password 123!");
        result = service.add(user, user.getPassword());
        assertEquals(ResultType.INVALID, result.getType());

        user.setUsername("john");
        user.setPassword("P@1");
        result = service.add(user, user.getPassword());
        assertEquals(ResultType.INVALID, result.getType());

        user.setUsername("this_username_is_way_too_long_for_the_app");
        user.setPassword("Password123!");
        result = service.add(user, user.getPassword());
        assertEquals(ResultType.INVALID, result.getType());
    }


    @Test
    void shouldAddUserWhenValid() {
        User expected = makeUser();
        User arg = makeUser();
        arg.setUserId(0);

        when(repository.add(arg)).thenReturn(expected);
        Result<User> result = service.add(arg,arg.getPassword());
        assertEquals(ResultType.SUCCESS, result.getType());

        assertEquals(expected, result.getPayload());
    }

    @Test
    void shouldNotUpdateWhenInvalid() {
        User user = makeUser();
        Result<User> result = service.update(user);
        assertEquals(ResultType.NOT_FOUND, result.getType());

        user.setUserId(0);
        user.setUsername(null);
        result = service.update(user);
        assertEquals(ResultType.INVALID, result.getType());
    }

    @Test
    void shouldUpdateUserWhenValid() {
        User expected = makeUser();

        expected.setUsername("Update");

        when(repository.update(expected)).thenReturn(true);
        Result<User> result = service.update(expected);
        assertEquals(ResultType.SUCCESS, result.getType());

        assertEquals(expected, result.getPayload());
    }

    @Test
    void shouldDeleteUserById() {
        when(repository.deleteById(1)).thenReturn(true);
        boolean actual = service.deleteById(1);
        assertTrue(actual);
    }

    User makeUser() {
        User user = new User();
        user.setUserId(1);
        user.setUsername("john_doe");
        user.setEmail("john_doe@example.com");
        user.setPassword("Password123!");
        return user;
    }
}
