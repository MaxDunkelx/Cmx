import { useEffect, useState } from 'react';
import cmxLogoImage from '../assets/images/CMX-logo.png';

function CMXLogo({ size = '100px', animated = true }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cmxPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.95; }
      }
      @keyframes cmxFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }
      .cmx-logo-image {
        max-width: 100%;
        height: auto;
        display: block;
      }
      .cmx-logo-animated {
        animation: cmxPulse 3s ease-in-out infinite,
                   cmxFloat 6s ease-in-out infinite;
      }
      .cmx-logo-container {
        position: relative;
        display: inline-block;
        background: transparent !important;
        border-radius: 50%;
        overflow: hidden;
        clip-path: circle(50%);
        -webkit-clip-path: circle(50%);
      }
      .cmx-logo-image {
        background: transparent !important;
        background-color: transparent !important;
        border-radius: 50%;
        clip-path: circle(50%);
        -webkit-clip-path: circle(50%);
        mix-blend-mode: screen;
        -webkit-filter: brightness(1.5) contrast(1.2);
        filter: brightness(1.5) contrast(1.2);
      }
      .cmx-logo-container * {
        background: transparent !important;
        background-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div 
      className="cmx-logo-container" 
      style={{ 
        width: size, 
        height: size, 
        background: 'transparent',
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
        clipPath: 'circle(50%)',
        WebkitClipPath: 'circle(50%)'
      }}
    >
      <img 
        src={cmxLogoImage}
        alt="CMX Logo"
        className={`cmx-logo-image ${animated ? 'cmx-logo-animated' : ''}`}
        onLoad={() => setLogoLoaded(true)}
        onError={(e) => {
          console.error('Logo load error:', e);
          setLogoLoaded(true); // Show placeholder even on error
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          imageRendering: 'crisp-edges',
          display: logoLoaded ? 'block' : 'none',
          background: 'transparent',
          mixBlendMode: 'normal',
          borderRadius: '50%',
          clipPath: 'circle(50%)',
          WebkitClipPath: 'circle(50%)'
        }}
      />
      {!logoLoaded && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.4em',
          fontWeight: '900',
          letterSpacing: '2px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          CMX
        </div>
      )}
    </div>
  );
}

export default CMXLogo;
