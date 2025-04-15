package learn.playlist.domain;

import learn.playlist.data.LikeRepository;
import learn.playlist.models.Likes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {
    private final LikeRepository repository;

    public LikeService(LikeRepository repository) {
        this.repository = repository;
    }

    public int countLikesForPlaylist(int playlistId){return repository.countLikesForPlaylist(playlistId);};

    public List<Integer> findLikedPlaylistFromUser(int userId){return repository.findLikedPlaylistIdsByUser(userId);};

    public boolean addLike(Likes likes) {return repository.add(likes);}

    public boolean removeLike(int userId, int playlistId) {return repository.deleteByKey(userId, playlistId);}
}
