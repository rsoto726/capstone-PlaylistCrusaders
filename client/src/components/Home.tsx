import React, {useState, useEffect} from 'react';
import PlaylistCard from './PlaylistCard';
import '../styles/HomePage.css';
const sampleData = [
  { title: 'Chill Vibes', songs: ['Song one', 'Song two', 'Song three', 'Song four'] },
  { title: 'Workout Mix', songs: ['Track 1', 'Track 2', 'Track 3'] },
  { title: 'Focus Mode', songs: ['Ambient A', 'Ambient B', 'Ambient C'] },
  { title: 'Throwbacks', songs: ['Hit 1', 'Hit 2', 'Hit 3', 'Hit 4'] },
];
const url = "http://localhost:8080"

const Home: React.FC = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(()=>{
    fetch(`${url}/api/playlist/public`)
      .then(r=>r.json())
      .then(data=>{
        console.log(data)
        setPlaylists(data);
      })
  },[])

  return (
    <div className="container mt-3">
      <div className="row">
        {sampleData.map((playlist, index) => (
          <div key={index} className="col-md-3">
            <PlaylistCard title={playlist.title} songs={playlist.songs} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
