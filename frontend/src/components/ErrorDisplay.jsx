function ErrorDisplay({ error, onRetry }) {
  if (!error) return null;

  return (
    <div style={styles.container}>
      <div style={styles.icon}>⚠️</div>
      <h3 style={styles.title}>Something went wrong</h3>
      <p style={styles.message}>{error}</p>
      {onRetry && (
        <button onClick={onRetry} style={styles.retryButton}>
          Try Again
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#ff444420',
    border: '2px solid #ff4444',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    margin: '2rem 0'
  },
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.5rem',
    color: '#ff4444',
    marginBottom: '1rem'
  },
  message: {
    color: '#fff',
    marginBottom: '1.5rem',
    fontSize: '1rem'
  },
  retryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#ff4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default ErrorDisplay;

