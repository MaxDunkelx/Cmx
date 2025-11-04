import { useEffect } from 'react';

function LiquidParticles({ count = 20 }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat1 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(100px, -200px) rotate(360deg); opacity: 0; }
      }
      @keyframes particleFloat2 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(-100px, -200px) rotate(-360deg); opacity: 0; }
      }
      @keyframes particleFloat3 {
        0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translate(150px, -150px) rotate(180deg); opacity: 0; }
      }
      .particle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.4));
        border-radius: 50%;
        filter: blur(2px);
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particleFloat${(i % 3) + 1} ${8 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

export default LiquidParticles;

