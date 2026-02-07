import { useEffect, useRef, useState } from 'react';
import './home.css';
import { useNavigate } from 'react-router';

/* =======================
   Game State
======================= */

export const GAME_STATE = {
  START: 'START',
  PLAYING: 'PLAYING'
} as const;

export type GameState = (typeof GAME_STATE)[keyof typeof GAME_STATE];

const WIN_SCORE = 15;

/* =======================
   Player
======================= */

class Player {
  private canvas: HTMLCanvasElement;

  w = 100;
  h = 80;
  x: number;
  y: number;
  dx = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.x = canvas.width / 2 - this.w / 2;
    this.y = canvas.height - 100;
  }

  update() {
    this.x += this.dx;
    this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.w));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.arc(this.x + this.w / 2, this.y, this.w / 2, 0, Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#c9184a';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(this.x + this.w / 2, this.y - 10, this.w / 2, Math.PI, 0);
    ctx.stroke();
  }
}

/* =======================
   Heart
======================= */

class Heart {
  size = Math.random() * 20 + 20;
  x: number;
  y: number;
  speed = Math.random() * 3 + 2;
  color = `hsl(${Math.random() * 20 + 340},100%,60%)`;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * (canvas.width - this.size);
    this.y = -this.size;
  }

  update() {
    this.y += this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();

    const t = this.size * 0.3;

    ctx.moveTo(this.x, this.y + t);
    ctx.bezierCurveTo(
      this.x,
      this.y,
      this.x - this.size / 2,
      this.y,
      this.x - this.size / 2,
      this.y + t
    );
    ctx.bezierCurveTo(
      this.x - this.size / 2,
      this.y + (this.size + t) / 2,
      this.x,
      this.y + (this.size + t) / 2,
      this.x,
      this.y + this.size
    );
    ctx.bezierCurveTo(
      this.x,
      this.y + (this.size + t) / 2,
      this.x + this.size / 2,
      this.y + (this.size + t) / 2,
      this.x + this.size / 2,
      this.y + t
    );
    ctx.bezierCurveTo(
      this.x + this.size / 2,
      this.y,
      this.x,
      this.y,
      this.x,
      this.y + t
    );

    ctx.fill();
  }
}

/* =======================
   Particle
======================= */

class Particle {
  life = 100;
  size = Math.random() * 5 + 2;
  vx = (Math.random() - 0.5) * 4;
  vy = (Math.random() - 0.5) * 4;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.life / 100;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

/* =======================
   Component
======================= */

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const playerRef = useRef<Player | null>(null);
  const heartsRef = useRef<Heart[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const [state, setState] = useState<GameState>(GAME_STATE.START);
  const [score, setScore] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (playerRef.current) {
        playerRef.current.y = canvas.height - 100;
      }
    };

    const spawnHeart = () => {
      if (Math.random() < 0.02) {
        heartsRef.current.push(new Heart(canvas));
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (state === GAME_STATE.PLAYING && playerRef.current) {
        const player = playerRef.current;

        player.update();
        player.draw(ctx);

        spawnHeart();

        heartsRef.current = heartsRef.current.filter(heart => {
          heart.update();
          heart.draw(ctx);

          const hit =
            heart.y + heart.size > player.y &&
            heart.x > player.x &&
            heart.x < player.x + player.w;

          if (hit) {
            setScore(s => s + 1);
            for (let i = 0; i < 5; i++) {
              particlesRef.current.push(new Particle(heart.x, heart.y));
            }
            return false;
          }

          return heart.y <= canvas.height;
        });

        particlesRef.current = particlesRef.current.filter(p => {
          p.update();
          p.draw(ctx);
          return p.life > 0;
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!playerRef.current) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      playerRef.current.x = x - playerRef.current.w / 2;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);

    if (state === GAME_STATE.PLAYING) {
      playerRef.current = new Player(canvas);
      loop();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, [state]);

  useEffect(() => {
    if (score >= WIN_SCORE) {
      navigate('/proposal');
    }
  }, [score, navigate]);

  return (
    <div id="game-container">
      <canvas id="canvas" ref={canvasRef} />

      <div id="ui-layer">
        <div id="score-board">
          ❤️ Love Meter
          <div className="progress-bar">
            <div
              id="love-fill"
              style={{ width: `${(score / WIN_SCORE) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {state === GAME_STATE.START && (
        <div className="screen active">
          <h1 className="home-title">Hi Babygirl, catch my love❤️</h1>
          <p className="subtitle">
            Catch enough hearts to reveal a special question...
          </p>
          <button className="btn" onClick={() => setState(GAME_STATE.PLAYING)}>
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
