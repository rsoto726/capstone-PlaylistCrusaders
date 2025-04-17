package learn.playlist.domain;

import learn.playlist.data.PlaylistSongRepository;
import learn.playlist.models.PlaylistSong;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistSongService {
    private final PlaylistSongRepository repository;

    public PlaylistSongService(PlaylistSongRepository repository) {
        this.repository = repository;
    }

    public Result<PlaylistSong> add(PlaylistSong playlistSong) {
        Result<PlaylistSong> result = validate(playlistSong);
        if (!result.isSuccess()) {
            return result;
        }

        boolean success = repository.add(playlistSong);

        if(success){
            result.setPayload(playlistSong);
        }

        return result;
    }

    public Result<?> addList(int playlistId, List<PlaylistSong> playlistSongs) {
        Result<PlaylistSong> result = new Result<>();
        for (PlaylistSong ps : playlistSongs) {
            if (ps.getPlaylistId() != playlistId) {
                result.addMessage("Invalid entry.", ResultType.INVALID);
            }
            result = validate(ps);
            if (!result.isSuccess()) {
                return result;
            }
        }

        if (!repository.replaceAllForPlaylist(playlistId, playlistSongs)) {
            result.addMessage("Some entries could not be updated.", ResultType.INVALID);
        }
        return result;
    }

    public Result<PlaylistSong> update(PlaylistSong playlistSong) {
        Result<PlaylistSong> result = validate(playlistSong);
        if (!result.isSuccess()) {
            return result;
        }

        boolean success = repository.update(playlistSong);
        if (!success) {
            result.addMessage("Song not found in playlist.", ResultType.NOT_FOUND);
        }

        return result;
    }

    public boolean delete(int playlistId, int songId) {
        return repository.deleteByKey(playlistId, songId);
    }

    private Result<PlaylistSong> validate(PlaylistSong playlistSong) {
        Result<PlaylistSong> result = new Result<>();
        if (playlistSong == null) {
            result.addMessage("PlaylistSong cannot be null", ResultType.INVALID);
            return result;
        }

        if (playlistSong.getPlaylistId() <= 0) {
            result.addMessage("Valid playlistId is required", ResultType.INVALID);
        }

        if (playlistSong.getSongId() <= 0) {
            result.addMessage("Valid songId is required", ResultType.INVALID);
        }

        if (playlistSong.getIndex() < 0) {
            result.addMessage("Index cannot be negative", ResultType.INVALID);
        }

        return result;
    }
}
