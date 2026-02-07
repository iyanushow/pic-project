import { useState } from 'react';
import './letter.css';

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="letter-page">
      <button className="open-btn" onClick={() => setIsOpen(true)}>
        Open My Letter
      </button>

      {isOpen && (
        <div className="letter-overlay">
          <div className="love-letter">
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
            <h2 className="letter-title">My Sugar Mummy 🌹</h2>
            <p>
              Just like you found these hidden hearts, you've found the deepest
              parts of my soul.
            </p>
            <p>
              Every moment with you is a surprise I cherish, a gift I never want
              to stop opening.
            </p>
            <p>
              Thank you for being my adventure, my comfort, my love, my forever
              valentine
            </p>

            <p style={{ textAlign: 'right' }}>- Yours forever</p>
          </div>
        </div>
      )}
    </div>
  );
}
