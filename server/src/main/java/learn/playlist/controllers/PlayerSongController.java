package learn.playlist.controllers;

import learn.playlist.domain.PlaylistSongService;
import learn.playlist.domain.Result;
import learn.playlist.models.PlaylistSong;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/playlist-song")
public class PlayerSongController {
    private final PlaylistSongService service;

    public PlayerSongController(PlaylistSongService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody PlaylistSong playlistSong) {
        Result<PlaylistSong> result = service.add(playlistSong);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping
    public ResponseEntity<Object> update(@RequestBody PlaylistSong playlistSong) {
        Result<PlaylistSong> result = service.update(playlistSong);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/replace/{playlistId}")
    public ResponseEntity<Void> replaceAll(@PathVariable int playlistId, @RequestBody List<PlaylistSong> playlistSongs) {
        Result<?> result = service.addList(playlistId, playlistSongs);

        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestParam int playlistId, @RequestParam int songId) {
        boolean success = service.delete(playlistId, songId);
        if(success){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
