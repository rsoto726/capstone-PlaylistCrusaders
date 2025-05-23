package learn.playlist.data;

import learn.playlist.models.Likes;

import java.util.List;

public interface LikeRepository {
    int countLikesForPlaylist(int playlistId);

    List<Integer> findLikedPlaylistIdsByUser(int userId);

    boolean findUserPlaylist(int userId, int playlistId);

    boolean add(Likes likes);

    boolean deleteByKey(int userId, int playlistId);
}
