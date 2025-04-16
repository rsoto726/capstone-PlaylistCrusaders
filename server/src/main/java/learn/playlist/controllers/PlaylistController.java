package learn.playlist.controllers;

import learn.playlist.config.JwtUtil;
import learn.playlist.domain.PlaylistService;
import learn.playlist.domain.UserService;
import learn.playlist.models.Playlist;
import learn.playlist.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/playlist")
public class PlaylistController {
    private final PlaylistService service;
    private final UserService userService;

    public PlaylistController(PlaylistService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping("/public")
    public List<Playlist> findAllPublic() {
        return service.findAllPublic();
    }

    @GetMapping("/user/{userId}")
    public List<Playlist> findByUserId(@PathVariable int userId) {
        return service.findByUserId(userId);
    }

    @GetMapping("/user/{userId}/public")
    public List<Playlist> findByUserIdPublic(@PathVariable int userId) {
        return service.findByUserIdPublic(userId);
    }

    @GetMapping("/likes/{userId}")
    public List<Playlist> findByLikes(@PathVariable int userId) {
        return service.findByLikes(userId);
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<Object> findById(@PathVariable int playlistId) {
        Playlist result = service.findById(playlistId);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/name/{name}")
    public List<Playlist> findByName(@PathVariable String name) {
        return service.findByName(name);};

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Playlist playlist, @RequestHeader(value = "Authorization", required = true) String authHeader) {
        String token = authHeader.substring(7); // remove "Bearer "
        String email = JwtUtil.extractEmail(token);
        User user = userService.findByEmail(email);
        Playlist result = service.add(playlist, user);
        if (result != null) {
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{playlistId}")
    public ResponseEntity<Object> update(@PathVariable int playlistId, @RequestBody Playlist playlist, @RequestAttribute User user) {
        if (playlistId != playlist.getPlaylistId()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        boolean success = service.update(playlist, user);
        if (success) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<Void> delete(@PathVariable int playlistId, @RequestHeader(value = "Authorization", required = true) String authHeader) {
        String token = authHeader.substring(7); // remove "Bearer "
        String email = JwtUtil.extractEmail(token);
        User user = userService.findByEmail(email);

        boolean success = service.deleteById(playlistId, user);
        if (success) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
