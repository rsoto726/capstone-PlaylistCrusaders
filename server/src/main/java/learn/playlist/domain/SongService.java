package learn.playlist.domain;

import learn.playlist.data.SongRepository;
import learn.playlist.models.Song;

public class SongService {
    private final SongRepository repository;

    public SongService(SongRepository repository) {
        this.repository = repository;
    }

    public Song findByUrl(String url) {return repository.findByUrl(url);};

    public Result<Song> add(Song song){
        Result<Song> result = new Result<>();

        if (song == null || song.getUrl() == null || song.getUrl().isBlank()) {
            result.addMessage("Song URL is required", ResultType.INVALID);
            return result;
        }

        Song added = repository.add(song);
        result.setPayload(added);
        return result;
    }

    public Boolean delete(int songId){
        return repository.deleteById(songId);
    }
}
