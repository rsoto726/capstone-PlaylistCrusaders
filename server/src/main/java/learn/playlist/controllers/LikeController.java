package learn.playlist.controllers;

import learn.playlist.config.JwtUtil;
import learn.playlist.domain.LikeService;
import learn.playlist.domain.UserService;
import learn.playlist.models.Likes;
import learn.playlist.models.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/like")
public class LikeController {
    private final LikeService service;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    public LikeController(LikeService service, UserService userService, SimpMessagingTemplate messagingTemplate) {
        this.service = service;
        this.userService=userService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/count/{playlistId}")
    public int countLikes(@PathVariable int playlistId) {
        return service.countLikesForPlaylist(playlistId);
    }

    @GetMapping("/find/{userId}")
    public List<Integer> findPlaylistsFromUserLikes(@PathVariable int userId) {
        return service.findLikedPlaylistFromUser(userId);
    }

    @GetMapping("/find/user/{playlistId}")
    public boolean findIfUserLikedPlaylist(@RequestHeader(value = "Authorization", required = false) String authHeader, @PathVariable int playlistId){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }

        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        User user = userService.findByEmail(email);
        if (user == null) {
            return false;
        }
        return service.findIfUserLikedPlaylist(user.getUserId(), playlistId);
    }

    @PostMapping
    public ResponseEntity<Void> addLike(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                        @RequestBody Map<String, Integer> payload) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        User user = userService.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        int playlistId = payload.get("playlistId");
        Likes like = new Likes();
        like.setUserId(user.getUserId());
        like.setPlaylistId(playlistId);

        boolean success = service.addLike(like);
        if (success) {
            Map<String, Object> message = Map.of(
                    "message", "like added",
                    "playlistId", playlistId
            );
            messagingTemplate.convertAndSend("/topic/likes", message);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<Void> deleteLike(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                           @PathVariable int playlistId) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);
        String email = JwtUtil.extractEmail(token);
        User user = userService.findByEmail(email);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        boolean success = service.removeLike(user.getUserId(), playlistId);
        if (success) {
            Map<String, Object> message = Map.of(
                    "message", "like removed",
                    "playlistId", playlistId
            );
            messagingTemplate.convertAndSend("/topic/likes", message);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
