package learn.playlist.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class KnownGoodState {
    @Autowired
    JdbcTemplate jdbcTemplate;

    static boolean hasRun = false;

    void set() {
        System.out.println("SETTING KNOWN GOOD STATE");
        if (!hasRun) {
            System.out.println("HAS RUN");
            hasRun = true;
            jdbcTemplate.update("call set_known_good_state();");
            System.out.println("GOOD STATE SET");
        }
    }
}
