package learn.playlist.controllers;

import learn.playlist.domain.Result;
import learn.playlist.domain.SongService;
import learn.playlist.models.Song;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
@RequestMapping("/api/song")
public class SongController {
    private final SongService service;

    public SongController(SongService service) {
        this.service = service;
    }

    @GetMapping
    public Song findByUrl(@RequestParam String url) {
        return service.findByUrl(url);
    }

    @PostMapping
    public ResponseEntity<Object> add(@RequestBody Song song) {
        System.out.println(song);
        Result<Song> result = service.add(song);
        if (result.isSuccess()) {
            return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/{songId}")
    public ResponseEntity<Void> delete(@PathVariable int songId) {
        boolean success = service.delete(songId);
        if(success){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
