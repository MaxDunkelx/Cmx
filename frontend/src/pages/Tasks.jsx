import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../components/ThemeProvider';
import api from '../utils/api';

function Tasks() {
  const { user, setUser } = useAuth();
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('available');
  const [adTimer, setAdTimer] = useState(null);
  const [watchingAd, setWatchingAd] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, balanceRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/wallet/balance')
      ]);
      const normalizedTasks = (tasksRes.data?.data || []).map((task) => ({
        ...task,
        cmxReward: Number(task.cmxReward ?? task.reward ?? 0),
        completed: Boolean(task.completed)
      }));
      setTasks(normalizedTasks);
      setBalance(balanceRes.data?.data?.balance ?? 0);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Use mock data if API fails
      setTasks([
        {
          _id: '1',
          title: 'Daily Login',
          description: 'Login to the platform',
          cmxReward: 100,
          type: 'daily',
          completed: false
        },
        {
          _id: '2',
          title: 'Watch Advertisement',
          description: 'Watch a 30 second ad',
          cmxReward: 250,
          type: 'ad',
          completed: false
        },
        {
          _id: '3',
          title: 'Complete Profile',
          description: 'Fill out your profile information',
          cmxReward: 500,
          type: 'survey',
          completed: false
        },
        {
          _id: '4',
          title: 'First Game Win',
          description: 'Win your first game',
          cmxReward: 1000,
          type: 'game',
          completed: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onComplete = async (taskId, taskType) => {
    if (taskType === 'ad') {
      // Handle ad watching
      setWatchingAd(true);
      setAdTimer(30);
      
      const interval = setInterval(() => {
        setAdTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setWatchingAd(false);
            completeAdTask(taskId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    // Handle other task types
    completeTask(taskId);
  };

  const completeTask = async (taskId) => {
    try {
      const response = await api.post('/tasks/complete', { taskId });
      const reward = response.data?.data?.reward ?? 0;
      setMessage(`🎉 Earned ${reward} CMX!`);
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to complete task');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const completeAdTask = async (taskId) => {
    try {
      // Simulate ad completion reward
      setMessage(`🎉 Ad completed! Earned 250 CMX!`);
      setBalance(prev => prev + 250);
      if (setUser) {
        setUser((prev) => (prev ? { ...prev, balance: (prev.balance ?? 0) + 250 } : prev));
      }
      fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to complete ad');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getTaskIcon = (type) => {
    const icons = {
      daily: '📅',
      ad: '📺',
      survey: '📋',
      game: '🎮',
      social: '👥',
      download: '📱'
    };
    return icons[type] || '✅';
  };

  const getTaskColor = (type) => {
    const colors = {
      daily: '#667eea',
      ad: '#2ed571',
      survey: '#ff9500',
      game: '#ff4757',
      social: '#4a90e2',
      download: '#764ba2'
    };
    return colors[type] || theme.colors.accent;
  };

  const availableTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.gradients.background, 
      color: '#fff', 
      padding: '2rem' 
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          marginBottom: '0.5rem',
          background: theme.gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          💰 Earn CMX Hub
        </h1>
        <p style={{ color: '#fff9', fontSize: '1.2rem' }}>
          Complete tasks to earn CMX tokens
        </p>
      </div>

      {/* Balance Card */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        style={{
          background: theme.gradients.card,
          backdropFilter: 'blur(40px)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto 2rem'
        }}
      >
        <div style={{ fontSize: '1rem', color: '#fff9', marginBottom: '0.5rem' }}>Total Earned</div>
        <div style={{ fontSize: '3rem', fontWeight: '800', color: theme.colors.accent }}>
          {balance.toLocaleString()} CMX
        </div>
      </motion.div>

      {/* Message Banner */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              padding: '1rem 2rem',
              background: 'rgba(46, 213, 115, 0.2)',
              border: '2px solid rgba(46, 213, 115, 0.5)',
              borderRadius: '12px',
              marginBottom: '2rem',
              textAlign: 'center',
              color: '#2ed571',
              fontWeight: '700',
              fontSize: '1.2rem'
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ad Watching Overlay */}
      <AnimatePresence>
        {watchingAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
          >
            <div style={{
              background: theme.gradients.card,
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📺</div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Watching Advertisement</h2>
              <div style={{
                fontSize: '4rem',
                fontWeight: '800',
                color: theme.colors.accent,
                marginBottom: '2rem'
              }}>
                {adTimer}s
              </div>
              <p style={{ color: '#fff9' }}>Please watch the ad to earn rewards</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        marginBottom: '2rem'
      }}>
        {['available', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '1rem 3rem',
              background: activeTab === tab ? theme.colors.accent : 'rgba(255,255,255,0.05)',
              border: `2px solid ${activeTab === tab ? theme.colors.accent : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '16px',
              color: activeTab === tab ? '#000' : '#fff',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab} ({tab === 'available' ? availableTasks.length : completedTasks.length})
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {(activeTab === 'available' ? availableTasks : completedTasks).map((task, idx) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            style={{
              background: theme.gradients.card,
              backdropFilter: 'blur(40px)',
              border: `2px solid ${getTaskColor(task.type)}40`,
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: `0 8px 32px ${getTaskColor(task.type)}20`
            }}
          >
            <div style={{ 
              fontSize: '4rem', 
              textAlign: 'center', 
              marginBottom: '1rem' 
            }}>
              {getTaskIcon(task.type)}
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              marginBottom: '0.75rem',
              textAlign: 'center',
              color: getTaskColor(task.type)
            }}>
              {task.title}
            </h3>
            <p style={{
              color: '#fff9',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {task.description}
            </p>
            <div style={{
              background: `${getTaskColor(task.type)}20`,
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: getTaskColor(task.type)
              }}>
                +{Number(task.cmxReward ?? task.reward ?? 0).toLocaleString()} CMX
              </div>
            </div>
            {activeTab === 'available' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onComplete(task._id, task.type)}
                disabled={watchingAd}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: getTaskColor(task.type),
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  cursor: watchingAd ? 'not-allowed' : 'pointer',
                  opacity: watchingAd ? 0.5 : 1
                }}
              >
                {watchingAd ? 'Please wait...' : 'Complete Task →'}
              </motion.button>
           ) : (
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                background: 'rgba(46, 213, 115, 0.2)',
                borderRadius: '12px',
                color: '#2ed571',
                fontWeight: '700'
              }}>
                ✅ Completed
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {activeTab === 'available' && availableTasks.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem',
          background: theme.gradients.card,
          borderRadius: '20px',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <p style={{ color: '#fff9', fontSize: '1.2rem' }}>
            All tasks completed! Check back later for more earning opportunities.
          </p>
        </div>
      )}
    </div>
  );
}

export default Tasks;
