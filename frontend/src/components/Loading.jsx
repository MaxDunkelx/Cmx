function Loading({ size = 'medium', fullScreen = false }) {
  const spinnerSizes = {
    small: '2rem',
    medium: '3rem',
    large: '5rem'
  };

  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;
  const spinnerStyle = {
    ...styles.spinner,
    width: spinnerSizes[size],
    height: spinnerSizes[size]
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}>
        <div style={styles.innerSpinner}></div>
      </div>
      {fullScreen && <div style={styles.text}>Loading...</div>}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  },
  fullScreenContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0a0e27',
    color: '#fff'
  },
  spinner: {
    border: '4px solid #1a1f3a',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  innerSpinner: {
    width: '100%',
    height: '100%',
    border: '4px solid transparent',
    borderRight: '4px solid #764ba2',
    borderRadius: '50%',
    animation: 'spin 0.5s linear infinite reverse'
  },
  text: {
    marginTop: '1.5rem',
    fontSize: '1.2rem',
    color: '#667eea'
  }
};

// Add CSS animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default Loading;

