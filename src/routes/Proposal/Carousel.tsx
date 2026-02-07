import { useState, useEffect } from 'react';
import './carousel.css';

const imagesPaths = [
  '1.gif',
  '2.gif',
  '3.gif',
  '4.gif',
  '5.gif',
  '6.gif',
  '7.gif'
];

export default function EmojiCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % imagesPaths.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="img-container" className="emoji">
      <img
        src={imagesPaths[currentIndex]}
        alt="Valentine"
        className="image"
        id="img"
      />
    </div>
  );
}
