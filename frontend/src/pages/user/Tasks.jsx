import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../components/ThemeProvider';
import api from '../../utils/api';
import { initializeUnityAds, loadRewardedAd, showRewardedAd, isAdAvailable } from '../../utils/unityAds';

const CATEGORY_TILES = [
  { id: 'surveys', title: 'Surveys', description: 'Complete quick surveys for CMX', color: '#74b9ff', accent: '#0abde3' },
  { id: 'ads', title: 'Watch Ads', description: 'Earn by watching short clips', color: '#a29bfe', accent: '#8c7ae6' },
  { id: 'social', title: 'Social Tasks', description: 'Share, follow, like our content', color: '#81ecec', accent: '#00cec9' },
  { id: 'installs', title: 'App Installs', description: 'Try curated partner apps', color: '#ffeaa7', accent: '#f6b93b' }
];

const FALLBACK_TASKS = [
  { id: 'fallback-1', title: 'Daily Login', reward: 100, type: 'daily', status: 'Available now' },
  { id: 'fallback-2', title: 'Watch 1 ad', reward: 250, type: 'ads', status: '5 ads ready' },
  { id: 'fallback-3', title: 'Share CMX on social', reward: 400, type: 'social', status: 'Boost rewards' },
  { id: 'fallback-4', title: 'Install partner app', reward: 700, type: 'installs', status: 'Limited time' }
];

const containerStyles = { minHeight: '100vh', padding: '2.5rem 1.5rem 4rem', maxWidth: '1200px', margin: '0 auto' };
const cardBase = { borderRadius: '20px', padding: '1.75rem', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(9, 12, 26, 0.65)', backdropFilter: 'blur(25px)', boxShadow: '0 12px 40px rgba(0,0,0,0.35)', transition: 'transform 200ms ease, border-color 200ms ease' };
const AD_VIDEO_ID = '1La4QzGeaaQ'; // Fallback YouTube video
const AD_REWARD = 250;
const AD_DURATION = 30;

function Tasks() {
  const { user } = useAuth();
  const theme = useTheme();
  const [tasks, setTasks] = useState(FALLBACK_TASKS);
  const [balance, setBalance] = useState(user?.balance ?? 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adCountdown, setAdCountdown] = useState(AD_DURATION);
  const [adCompleted, setAdCompleted] = useState(false);
  const [adRewardMessage, setAdRewardMessage] = useState('');
  const [unityAdsReady, setUnityAdsReady] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [useFallbackAd, setUseFallbackAd] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [tasksRes, balanceRes] = await Promise.all([api.get('/tasks'), api.get('/wallet/balance')]);
        if (!active) return;
        const fetchedTasks = Array.isArray(tasksRes.data?.data) ? tasksRes.data.data : [];
        const normalized = fetchedTasks.slice(0, 12).map((task) => ({
          id: task._id || task.id,
          title: task.title || 'Task',
          reward: Number(task.cmxReward ?? task.reward ?? 0),
          type: task.type || 'daily',
          status: task.description || 'Available'
        }));
        setTasks(normalized.length > 0 ? normalized : FALLBACK_TASKS);
        setBalance(balanceRes.data?.data?.balance ?? user?.balance ?? 0);
        setError('');
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn('Failed to fetch tasks, using fallback', err);
        }
        if (active) {
          setTasks(FALLBACK_TASKS);
          setError('Live task feed unavailable. Showing sample quests.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => { active = false; };
  }, [user?.balance]);

  // Initialize Unity Ads on mount
  useEffect(() => {
    initializeUnityAds().then((ready) => {
      setUnityAdsReady(ready);
      setUseFallbackAd(!ready);
    });
  }, []);

  // Fallback countdown timer (for YouTube mockup)
  useEffect(() => {
    if (!adModalOpen || adCompleted || !useFallbackAd) return;
    const timer = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [adModalOpen, adCompleted, useFallbackAd]);

  const handleAdStart = async () => {
    setAdRewardMessage('');
    setAdCountdown(AD_DURATION);
    setAdCompleted(false);
    setAdLoading(true);
    setAdModalOpen(true);

    // Try Unity Ads first
    if (unityAdsReady && !useFallbackAd) {
      try {
        const loaded = await loadRewardedAd();
        if (loaded) {
          try {
            await showRewardedAd();
            // Ad completed successfully
            handleAdReward();
            setAdModalOpen(false);
          } catch (error) {
            console.error('Unity Ads show error:', error);
            // Fallback to YouTube mockup
            setUseFallbackAd(true);
            setAdLoading(false);
          }
        } else {
          // Fallback to YouTube mockup
          setUseFallbackAd(true);
          setAdLoading(false);
        }
      } catch (error) {
        console.error('Unity Ads error:', error);
        setUseFallbackAd(true);
        setAdLoading(false);
      }
    } else {
      // Use fallback YouTube mockup
      setUseFallbackAd(true);
      setAdLoading(false);
    }
  };

  const handleAdClose = () => {
    setAdModalOpen(false);
    setAdCompleted(false);
    setAdCountdown(AD_DURATION);
  };

  const handleAdReward = async () => {
    try {
      // Call backend to credit reward
      await api.post('/tasks/complete', { taskId: 'ad-watch', taskType: 'ad' });
      setBalance((prev) => prev + AD_REWARD);
      setAdRewardMessage(`🎉 Ad completed! +${AD_REWARD} CMX credited to your wallet.`);
    } catch (error) {
      console.error('Failed to credit ad reward:', error);
      // Still update UI even if backend call fails
      setBalance((prev) => prev + AD_REWARD);
      setAdRewardMessage(`🎉 Ad completed! +${AD_REWARD} CMX credited.`);
    }
  };

  const handleClaimAdReward = () => {
    handleAdReward();
    setAdModalOpen(false);
  };

  const handleTaskAction = (task) => {
    if (task.type === 'ads') {
      handleAdStart();
      return;
    }
    window.alert('Task flow coming soon');
  };

  const summaryCards = useMemo(() => ([
    { label: 'Wallet Balance', value: `${balance.toLocaleString()} CMX` },
    { label: 'Active Quests', value: `${tasks.length}` },
    { label: 'Potential Earnings', value: `${tasks.reduce((sum, task) => sum + (task.reward || 0), 0).toLocaleString()} CMX` }
  ]), [balance, tasks]);

  return (
    <div style={{ ...containerStyles, background: theme.gradients?.background || 'radial-gradient(circle at top, #1c1f3b, #05060f)' }}>
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7f8fa6', fontSize: '0.9rem' }}>Earn CMX</p>
        <h1 style={{ fontSize: '3rem', margin: '0.5rem 0', color: '#fff', fontWeight: 800 }}>Quests & Boosters</h1>
        <p style={{ color: '#a5b1c2' }}>Complete curated mini missions to keep your CMX balance growing.</p>
        {error && (
          <div style={{ marginTop: '1rem', padding: '0.9rem 1.2rem', background: 'rgba(255, 159, 67, 0.15)', border: '1px solid rgba(255, 159, 67, 0.4)', borderRadius: '12px', color: '#ffa502', fontWeight: 600 }}>{error}</div>
        )}
        {adRewardMessage && !error && (
          <div style={{ marginTop: '1rem', padding: '0.9rem 1.2rem', background: 'rgba(46, 213, 115, 0.15)', border: '1px solid rgba(46, 213, 115, 0.4)', borderRadius: '12px', color: '#2ed571', fontWeight: 600 }}>{adRewardMessage}</div>
        )}
      </header>

      <section style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2.5rem' }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ color: '#9aa3ba', fontSize: '0.9rem' }}>{card.label}</span>
            <strong style={{ fontSize: '1.9rem', color: theme.colors?.accent || '#74b9ff' }}>{card.value}</strong>
          </div>
        ))}
      </section>

      <section style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '2.5rem' }}>
        {CATEGORY_TILES.map((tile) => (
          <div key={tile.id} style={{ ...cardBase, border: `1px solid ${tile.accent}44`, background: `linear-gradient(135deg, ${tile.color}22, rgba(5,6,15,0.6))` }}>
            <h3 style={{ color: tile.accent, marginBottom: '0.5rem', fontSize: '1.4rem' }}>{tile.title}</h3>
            <p style={{ color: '#d2d8f7', marginBottom: '1rem', minHeight: '48px' }}>{tile.description}</p>
            <button
              type='button'
              style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', borderRadius: '999px', background: tile.accent, color: '#05060f', fontWeight: 700, cursor: 'pointer', transition: 'opacity 150ms ease' }}
              onClick={() => {
                if (tile.id === 'ads') {
                  handleAdStart();
                } else {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
              }}
            >
              Browse offers
            </button>
          </div>
        ))}
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.75rem', color: '#7f8fa6' }}>Spotlight</p>
            <h2 style={{ margin: 0, color: '#fff' }}>Available Quests</h2>
          </div>
          {!loading && <span style={{ color: '#9aa3ba' }}>{tasks.length} total</span>}
        </div>

        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ ...cardBase, background: 'rgba(13, 17, 36, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ color: '#fff', fontSize: '1.2rem' }}>{task.title}</strong>
                <span style={{ color: theme.colors?.accent || '#74b9ff', fontWeight: 700 }}>+{task.reward.toLocaleString()} CMX</span>
              </div>
              <p style={{ color: '#9aa3ba', minHeight: '48px' }}>{task.status}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ textTransform: 'capitalize', fontSize: '0.85rem', color: '#7f8fa6' }}>{task.type}</span>
                <button type='button' style={{ border: 'none', borderRadius: '999px', padding: '0.65rem 1.5rem', fontWeight: 600, background: theme.colors?.accent || '#74b9ff', color: '#05060f', cursor: 'pointer' }} onClick={() => handleTaskAction(task)}>
                  Start
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: 'center', color: '#9aa3ba' }}>
        <p style={{ marginBottom: '0.5rem' }}>Ready to integrate real ad offers?</p>
        <button type='button' style={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: '999px', padding: '0.75rem 1.75rem', background: 'transparent', color: '#fff', fontWeight: 600, cursor: 'pointer' }} onClick={() => window.open('mailto:ads@cmx.gg', '_blank')}>
          Contact the Ads Team
        </button>
      </footer>

      {adModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.card}>
            <button style={modalStyles.closeButton} onClick={handleAdClose} aria-label='Close ad'>✕</button>
            <h3 style={{ margin: '0 0 1rem', color: '#fff' }}>Watch Ad to Earn CMX</h3>
            
            {adLoading && !useFallbackAd && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9aa3ba' }}>
                <p>Loading ad...</p>
              </div>
            )}

            {useFallbackAd && (
              <>
                <div style={modalStyles.videoWrapper}>
                  <iframe
                    width='560'
                    height='315'
                    src={`https://www.youtube.com/embed/${AD_VIDEO_ID}?autoplay=1&mute=1&controls=0`}
                    title='Sponsored content'
                    frameBorder='0'
                    allow='autoplay; encrypted-media'
                    allowFullScreen
                  ></iframe>
                </div>
                <p style={{ color: '#9aa3ba', marginTop: '1rem' }}>
                  {adCompleted ? 'Ad finished! Claim your reward.' : `Reward unlocks in ${adCountdown}s`}
                </p>
                <button
                  type='button'
                  style={{ ...modalStyles.claimButton, opacity: adCompleted ? 1 : 0.5, cursor: adCompleted ? 'pointer' : 'not-allowed' }}
                  disabled={!adCompleted}
                  onClick={handleClaimAdReward}
                >
                  Claim +{AD_REWARD} CMX
                </button>
              </>
            )}

            {!useFallbackAd && !adLoading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9aa3ba' }}>
                <p>Unity Ads will display here when available.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#7f8fa6' }}>
                  Note: Unity Ads web support is limited. Consider using Unity LevelPlay or web ad networks for production.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;

const modalStyles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { position: 'relative', width: '100%', maxWidth: '640px', background: 'rgba(13, 17, 36, 0.9)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' },
  videoWrapper: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
  closeButton: { position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' },
  claimButton: { width: '100%', marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: '12px', border: 'none', fontWeight: '700', color: '#05060f', background: '#2ed571', transition: 'opacity 200ms ease' }
};
