import { useEffect, useState } from 'react';

function ReviewsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    { name: 'Alex M.', stars: 5, text: "This is absolutely revolutionary! I've earned more here in one month than I did in 6 months on other platforms. The games are fun and the profit sharing is real!" },
    { name: 'Sarah K.', stars: 5, text: "Best gaming platform ever! The provably fair system gives me total confidence. Plus, the revenue sharing model is genius. Highly recommend!" },
    { name: 'Mike T.', stars: 5, text: "Reliable, fun, and profitable. The blackjack and poker games are amazing, and I love how transparent everything is. Withdrawal was instant!" },
    { name: 'Emma L.', stars: 4, text: "Great platform! The games are entertaining and I've already withdrawn my first earnings. The profit sharing concept is brilliant!" },
    { name: 'James W.', stars: 5, text: "This changed how I think about gaming platforms. Finally, a company that shares success with users. The liquid glass UI is beautiful too!" },
    { name: 'Lisa P.', stars: 5, text: "Absolutely in love with this platform! The games work perfectly, earnings are real, and the team is trustworthy. Revolutionary idea!" },
    { name: 'David R.', stars: 5, text: "Never seen anything like this. The provably fair system is incredible and the profits keep coming. This is the future of gaming!" },
    { name: 'Sophia C.', stars: 5, text: "Amazing experience from day one. The UI is stunning, games are fair, and the earning potential is real. What's not to love?" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000); // Change review every 5 seconds
    
    return () => clearInterval(interval);
  }, [reviews.length]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        0% { opacity: 0; transform: translateX(50px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes slideOut {
        0% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(-50px); }
      }
      .review-slide-enter {
        animation: slideIn 0.5s ease-out forwards;
      }
      .review-slide-exit {
        animation: slideOut 0.5s ease-in forwards;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const currentReview = reviews[currentIndex];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🌟 Trusted by Thousands</h3>
        <p style={styles.subtitle}>Real experiences from our community</p>
      </div>
      
      <div style={styles.sliderContainer}>
        <div key={currentIndex} style={styles.reviewCard}>
          <div style={styles.reviewHeader}>
            <div>
              <div style={styles.reviewName}>{currentReview.name}</div>
              <div style={styles.stars}>
                {'⭐'.repeat(currentReview.stars)}
              </div>
            </div>
          </div>
          <p style={styles.reviewText}>"{currentReview.text}"</p>
        </div>
        
        {/* Slide indicators */}
        <div style={styles.indicators}>
          {reviews.map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.indicator,
                backgroundColor: index === currentIndex ? '#667eea' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '2rem',
    width: '100%'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.6)'
  },
  sliderContainer: {
    position: 'relative',
    minHeight: '200px'
  },
  reviewCard: {
    background: 'rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.5s ease'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  reviewName: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem'
  },
  stars: {
    fontSize: '1.2rem'
  },
  reviewText: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.8',
    fontStyle: 'italic'
  },
  indicators: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    marginTop: '2rem'
  },
  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer'
  }
};

export default ReviewsSlider;

