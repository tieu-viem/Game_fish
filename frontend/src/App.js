// App.js
import React, { useState, useEffect } from 'react';
import Fish from './Fish';
import Gun from './Gun';
import Bullet from './Bullet';
import socketIOClient from 'socket.io-client';
import GunItem from './GunItem'; 
import AddGunForm from './AddGunForm'; // Import AddGunForm
import AddGunPage from './AddGunPage';
const ENDPOINT = 'http://localhost:3000'; // Thay thế bằng địa chỉ kết nối tới server của bạn
const App = () => {
  const [score, setScore] = useState(0);
  const [fishes, setFishes] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [gunPosition, setGunPosition] = useState({ x: window.innerWidth / 2 - 25, y: window.innerHeight - 50 });
  const [selectedMap, setSelectedMap] = useState('map1.png');
  const [gunStore, setGunStore] = useState([]);
  const [userScore, setUserScore] = useState(0);

  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const socket = socketIOClient(ENDPOINT);

  const maps = ['map1.png', 'map2.png', 'map3.png'];

  const toggleStore = () => {
    setIsStoreOpen((prevIsStoreOpen) => !prevIsStoreOpen);
  };

  const fetchGunStore = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/guns');
      
      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`Failed to fetch gun store: ${response.status} ${response.statusText}`);
      }
  
      // Parse the response only if it is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const guns = await response.json(); // Extract JSON data from the response
        setGunStore(guns);
      } else {
        console.error('Error fetching gun store: Response is not JSON');
      }
    } catch (error) {
      console.error('Error fetching gun store:', error.message);
    }
  };
  
  
  const getRandomPosition = () => {
    // Đưa ra logic của bạn để sinh vị trí ngẫu nhiên trong giới hạn của map
    const fishWidth = 50;
    const fishHeight = 30;
  
    const x = Math.random() * (window.innerWidth - fishWidth);
    const y = Math.random() * (window.innerHeight - fishHeight);
    
    return { x, y };
  };
  const buyGun = async (gunId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/buy-gun/${gunId}`, { method: 'POST' });
      const result = await response.json();
      if (response.ok) {
        setUserScore(result.userScore);
        console.log('Mua súng thành công');
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error buying gun:', error);
    }
  };
  const handleAddGun = async (gunData) => {
    try {
      const response = await fetch('http://localhost:3001/api/guns/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gunData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add gun: ${response.status} ${response.statusText}`);
      }

      // Optionally handle the response if needed
      const newGun = await response.json();
      console.log('Added gun:', newGun);
    } catch (error) {
      console.error('Error adding gun:', error.message);
    }
  };

  useEffect(() => {
    fetchGunStore();
  }, []);

  const spawnFish = () => {
    const newFish = {
      id: Date.now(),
      type: Math.random() < 0.5 ? 'small' : 'big',
      position: getRandomPosition(),
    };
  
    setFishes((prevFishes) => [...prevFishes, newFish]);
  };
  

  const catchFish = (id) => {
    setFishes((prevFishes) => {
      const updatedFishes = prevFishes.filter((fish) => fish.id !== id);

      // If a fish was caught, update the score
      if (updatedFishes.length !== prevFishes.length) {
        setScore((prevScore) => prevScore + 1);
      }

      return updatedFishes;
    });
  };

  const checkCollision = (fish, bullet) => {
    const fishWidth = fish.type === 'small' ? 50 : 100;
    const fishHeight = fish.type === 'small' ? 30 : 60;

    return (
      bullet.position.x < fish.position.x + fishWidth &&
      bullet.position.x + 10 > fish.position.x && // Adjusted the bullet width
      bullet.position.y < fish.position.y + fishHeight &&
      bullet.position.y + 20 > fish.position.y
    );
  };

  const moveGun = (event) => {
    const newPosition = { x: event.clientX, y: event.clientY };
    setGunPosition(newPosition);
    
    // Emit gun position update to the server
    socket.emit('gunPosition', newPosition);
  };

  const handleMapChange = ({ target: { value } }) => {
    setSelectedMap(value);
  };

  const handleShoot = () => {
    const newBullet = {
      id: Date.now(),
      position: { ...gunPosition },
    };

    setBullets((prevBullets) => [...prevBullets, newBullet]);
  };

  const removeBullet = (id) => {
    setBullets((prevBullets) => prevBullets.filter((bullet) => bullet.id !== id));
  };

  useEffect(() => {
    const bulletSpeed = 5;
  
    // Listen for gun position updates from the server
    socket.on('updateGunPosition', (position) => {
      setGunPosition(position);
    });
  
    const intervalId = setInterval(() => {
      setBullets((prevBullets) => {
        const updatedBullets = prevBullets.map((bullet) => ({
          ...bullet,
          position: {
            x: bullet.position.x,
            y: bullet.position.y - bulletSpeed,
          },
        }));
  
        updatedBullets.forEach((bullet) => {
          fishes.forEach((fish) => {
            if (checkCollision(fish, bullet)) {
              catchFish(fish.id);
              setFishes((prevFishes) => prevFishes.filter((f) => f.id !== fish.id));
              removeBullet(bullet.id);
            }
          });
        });
  
        return updatedBullets.filter((bullet) => bullet.position.y > 0);
      });
    }, 50);
  
    return () => {
      clearInterval(intervalId);
       socket.disconnect();
    };
  }, [fishes]);


  return (
    <div>
      <h1>Bắn Cá Game Nhóm 26</h1>
      <h2><label>Select Map: </label></h2>
      <select value={selectedMap} onChange={handleMapChange}>
        {maps.map((map) => (
          <option key={map} value={map}>
            {map}
          </option>
        ))}
      </select>
      <button onClick={spawnFish}>Spawn Cá</button>
      <button onClick={handleShoot}>Bắn Đạn</button>
      
      <button onClick={toggleStore}>{isStoreOpen ? 'Đóng Cửa Hàng' : 'Mở Cửa Hàng'}</button>
      {isStoreOpen && (
        <div>
          <AddGunForm onAddGun={handleAddGun} />
          <h3>Cửa hàng súng</h3>
          <p>Điểm của bạn: {score}</p>
          <ul>
            {gunStore.map((gun) => (
              <GunItem key={gun.id} gun={gun} onBuyGun={buyGun} />
            ))}
          </ul>
        </div>
      )}
      <p>Điểm: {score}</p>
      <div
        style={{
          position: 'relative',
          width: '98.6vw',
          height: '82vh',
          border: '1px solid black',
          backgroundImage: `url(/images/${selectedMap})`,
          backgroundSize: 'cover',
          borderRadius: '7%',
          cursor: 'pointer',
        }}
        onMouseMove={moveGun}
      >
        {fishes.map((fish) => (
          <Fish key={fish.id} type={fish.type} position={fish.position} onClick={() => catchFish(fish.id)} />
        ))}
        <Gun position={gunPosition} onShoot={handleShoot} />
        {bullets.map((bullet) => (
          <Bullet key={bullet.id} position={bullet.position} />
        ))}
      </div>
      

    </div>
  );
};

export default App;
