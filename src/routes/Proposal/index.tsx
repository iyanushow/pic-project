import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import './proposal.css';
import { useNavigate } from 'react-router';
import EmojiCarousel from './Carousel';

const noTexts = [
  'No',
  'Are you sure?',
  'Pookie please',
  "Don't do this to me :(",
  "You're breaking my heart",
  "I'm gonna cry..."
];

export default function Proposal() {
  const noRef = useRef<HTMLButtonElement | null>(null);
  const yesRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [noClickCount, setNoClickCount] = useState(0);

  const moveNoButton = () => {
    const card = cardRef.current;
    const noBtn = noRef.current;

    if (!noBtn || !card) return;

    const maxX = card.clientWidth - noBtn.offsetWidth;
    const maxY = card.clientHeight - noBtn.offsetHeight;

    noBtn.style.left = `${Math.random() * maxX}px`;
    noBtn.style.top = `${Math.random() * maxY}px`;

    setNoClickCount(c => (c + 1) % noTexts.length);
  };

  const onYes = () => {
    confetti({
      particleCount: 260,
      spread: 120,
      origin: { y: 0.65 }
    });

    setTimeout(() => {
      navigate('/letter');
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const heart = document.createElement('div');
      const container = document.getElementById('main-container');

      heart.className = 'heart';
      heart.innerHTML = Math.random() > 0.5 ? '❤️' : '💗';
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.fontSize = `${Math.random() * 22 + 14}px`;
      heart.style.animationDuration = `${Math.random() * 3 + 4}s`;
      heart.style.opacity = `${Math.random() * 0.5 + 0.4}`;
      container?.appendChild(heart);
      setTimeout(() => heart.remove(), 8000);
    }, 380);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="main-container">
      <div id="proposal-container">
        <div className="card" ref={cardRef}>
          <EmojiCarousel />

          <h2 className="title">
            Hi Sugar Plum,
            <br />
            will you be my Valentine?
          </h2>

          <div className="proposal-buttons">
            <button
              onClick={onYes}
              id="yes"
              className="proposal-btn yes-btn animateYes"
              ref={yesRef}>
              Yes 💖
            </button>

            <div className="no-container">
              <button
                id="no"
                className="proposal-btn no-btn"
                onMouseEnter={moveNoButton} // Desktop hover
                onTouchStart={moveNoButton}
                ref={noRef}>
                {noTexts[noClickCount]} 🙈
              </button>
            </div>
          </div>

          <div className="hint">Our love story will go on forever ✨</div>
        </div>
      </div>
    </div>
  );
}
