package learn.playlist.domain;

import learn.playlist.data.PlaylistRepository;
import learn.playlist.models.Playlist;
import learn.playlist.models.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaylistService {
    private final PlaylistRepository repository;

    public PlaylistService(PlaylistRepository repository) {
        this.repository = repository;
    }

    public List<Playlist> findAllPublic() {
        return repository.findAllPublic();
    }

    public List<Playlist> findByUserId(int userId) {
        return repository.findByUserId(userId);
    }

    public List<Playlist> findByUserIdPublic(int userId) {
        return repository.findByUserIdPublic(userId);
    }

    public List<Playlist> findByLikes(int userId) {
        return repository.findByLikes(userId);
    }

    public List<Playlist> findByName(String name) {return repository.findByName(name);};

    public Playlist findById(int playlistId) {
        return repository.findById(playlistId);
    }

    public Playlist add(Playlist playlist, User user) {
        if (playlist == null || user == null || user.getRoles() == null) {
            return null;
        }

        if (user.getRoles().contains("DISABLED")) {
            return null;
        }

        if (!user.getRoles().contains("USER") && !user.getRoles().contains("ADMIN")) {
            return null;
        }

        playlist.setUserId(user.getUserId());
        return repository.add(playlist);
    }

    public boolean update(Playlist playlist, User user) {
        if (playlist == null || playlist.getPlaylistId() <= 0 || user == null || user.getRoles() == null) {
            return false;
        }

        if (user.getRoles().contains("DISABLED")) {
            return false;
        }

        if (!user.getRoles().contains("USER") && !user.getRoles().contains("ADMIN")) {
            return false;
        }

        return repository.update(playlist);
    }

    public boolean deleteById(int playlistId, User user) {
        if (user == null || user.getRoles() == null) {
            return false;
        }

        if (!user.getRoles().contains("ADMIN")) {
            return false;
        }

        return repository.deleteById(playlistId);
    }
}
