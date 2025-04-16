package learn.playlist.controllers;

import learn.playlist.domain.LikeService;
import learn.playlist.models.Likes;
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
    private final SimpMessagingTemplate messagingTemplate;

    public LikeController(LikeService service, SimpMessagingTemplate messagingTemplate) {
        this.service = service;
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

    @GetMapping("/find/{userId}/{playlistId}")
    public boolean findIfUserLikedPlaylist(@PathVariable int userId, @PathVariable int playlistId){
        return service.findIfUserLikedPlaylist(userId, playlistId);
    }

    @PostMapping
    public ResponseEntity<Void> addLike(@RequestBody Likes like) {
        boolean success = service.addLike(like);
        if (success) {
            Map<String, Object> message = Map.of(
                    "message", "like added",
                    "playlistId", like.getPlaylistId()
            );

            messagingTemplate.convertAndSend("/topic/likes", message);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteLike(@RequestParam int userId, @RequestParam int playlistId) {
        boolean success = service.removeLike(userId, playlistId);
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
