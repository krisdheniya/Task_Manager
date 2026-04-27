import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, dbUser, signOut, isAdmin } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfile && !(event.target as Element).closest('.profile-container')) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoBox}>=</div>
          <h1 style={styles.appTitle}>TaskHQ</h1>
        </div>
        
        <div style={styles.headerRight} className="profile-container">
          {isAdmin && (
            <span style={styles.adminBadge}>
              Admin
            </span>
          )}
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={styles.profileBtn}
          >
            <div style={styles.avatar}>
              {dbUser?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
            <span style={styles.profileName}>{dbUser?.name || 'User'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 4, color: 'var(--text)'}}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Profile Card Overlay */}
          {showProfile && (
            <div className="glass-panel" style={styles.profileCard}>
              <div style={styles.profileHeader}>
                <div style={styles.avatarLarge}>
                  {dbUser?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={styles.profileCardName}>{dbUser?.name || 'Not set'}</div>
                  <div style={styles.profileCardEmail}>{user?.email}</div>
                </div>
              </div>
              <div style={{ padding: '8px' }}>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 8}}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.welcomeSection}>
          <h2 style={styles.welcomeTitle}>
            Hello, {dbUser?.name?.split(' ')[0] || user?.email?.split('@')[0]}
          </h2>
          <p style={{ color: 'var(--text)' }}>Here is a quick overview of your workspace.</p>
        </div>

        {/* Overview Stats */}
        <div style={styles.statsGrid}>
          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statLabel}>Open Tasks</div>
            <div style={styles.statValue}>0</div>
          </div>
          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statLabel}>In Progress</div>
            <div style={styles.statValue}>0</div>
          </div>
          <div className="glass-panel" style={styles.statCard}>
            <div style={styles.statLabel}>Completed</div>
            <div style={styles.statValue}>0</div>
          </div>
        </div>

        {/* Tasks Section */}
        <section className="glass-panel" style={styles.tasksSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Your Tasks</h3>
            <button className="btn-primary" style={styles.createBtn}>+ New Task</button>
          </div>
          <div style={styles.tasksContainer}>
            <div style={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--border)', marginBottom: 16}}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <p style={{margin: 0, fontWeight: 500, color: 'var(--text-h)'}}>No tasks assigned to you yet</p>
              <p style={{marginTop: 8, fontSize: '14px'}}>When tasks are created, they will appear here.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(18, 18, 18, 0.8)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBox: {
    width: '28px',
    height: '28px',
    background: 'var(--accent)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  appTitle: {
    fontSize: '18px',
    fontWeight: '600',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    position: 'relative'
  },
  adminBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    color: 'var(--accent)',
    borderRadius: '12px',
    letterSpacing: '0.5px',
    border: '1px solid var(--accent)'
  },
  profileBtn: {
    background: 'transparent',
    border: '1px solid var(--glass-border)',
    borderRadius: '24px',
    padding: '4px 12px 4px 4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '13px',
  },
  avatarLarge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
    flexShrink: 0
  },
  profileName: {
    marginLeft: '8px',
    fontSize: '14px',
    color: 'var(--text-h)',
    fontWeight: '500'
  },
  profileCard: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: '0',
    width: '280px',
    padding: '8px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '8px'
  },
  profileCardName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-h)',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px'
  },
  profileCardEmail: {
    fontSize: '13px',
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px'
  },
  logoutBtn: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#f87171',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  main: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  welcomeSection: {
    marginBottom: '40px',
  },
  welcomeTitle: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '40px'
  },
  statCard: {
    padding: '24px',
  },
  statLabel: {
    color: 'var(--text)',
    fontSize: '14px',
    marginBottom: '8px'
  },
  statValue: {
    color: 'var(--text-h)',
    fontSize: '36px',
    fontWeight: 'bold',
    lineHeight: 1
  },
  tasksSection: {
    padding: '32px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
  },
  createBtn: {
    padding: '8px 16px',
    fontSize: '14px',
  },
  tasksContainer: {
    minHeight: '260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed var(--border)',
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.2)'
  },
  emptyState: {
    textAlign: 'center',
    color: 'var(--text)',
  },
};

export default Dashboard;