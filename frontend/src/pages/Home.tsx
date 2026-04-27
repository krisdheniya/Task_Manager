import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/auth';

const Home = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // If already authenticated, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          alert('Passwords do not match');
          setAuthLoading(false);
          return;
        }
        await signUpWithEmail(email, password);
        alert('Check your email for the confirmation link!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes('email rate limit')) {
        alert('Email rate limit exceeded. Please wait a few minutes before trying again.');
      } else {
        alert(error.message);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <div style={styles.logoBox}>=</div>
          <span style={{ fontWeight: 600 }}>TaskHQ</span>
        </div>
        <div style={styles.navLinks}>
          <a href="#product" style={styles.navLink}>Product</a>
          <a href="#teams" style={styles.navLink}>Teams</a>
          <a href="#policies" style={styles.navLink}>Policies</a>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#changelog" style={styles.navLink}>Changelog</a>
        </div>
        <div>
          <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>Book a demo</button>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.heroLeft}>
          <h1 style={styles.heroTitle}>
            Where great<br />teams <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>get it done</span>
          </h1>
          <p style={styles.heroSubtitle}>
            TaskHQ brings tasks, sprints, and teammates into one calm, focused space &mdash; so nothing falls through the cracks.
          </p>

          <div className="glass-panel" style={styles.mockupContainer}>
            <div style={styles.mockupHeader}>
              <div style={styles.windowControls}>
                <span style={{...styles.dot, background: '#ff5f56'}}></span>
                <span style={{...styles.dot, background: '#ffbd2e'}}></span>
                <span style={{...styles.dot, background: '#27c93f'}}></span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>Q2 Product Sprint &middot; 12 open tasks</span>
              <div style={{width: '42px'}}></div>
            </div>
            
            <div style={styles.mockupColumns}>
              {/* TODO Column */}
              <div style={styles.column}>
                <div style={styles.columnHeader}>
                  <span style={{...styles.dot, background: 'var(--text)'}}></span> TODO
                </div>
                <div style={styles.mockupCard}>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '12px'}}>Refactor auth middleware</div>
                  <div style={styles.cardFooter}>
                    <span style={{...styles.badge, color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)'}}>Dev</span>
                    <div style={{...styles.avatar, background: '#4f46e5'}}>KL</div>
                  </div>
                </div>
                <div style={styles.mockupCard}>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '12px'}}>Update onboarding copy</div>
                  <div style={styles.cardFooter}>
                    <span style={{...styles.badge, color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)'}}>Design</span>
                    <div style={{...styles.avatar, background: '#db2777'}}>PR</div>
                  </div>
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div style={styles.column}>
                <div style={styles.columnHeader}>
                  <span style={{...styles.dot, background: '#fbbf24'}}></span> IN PROGRESS
                </div>
                <div style={styles.mockupCard}>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '12px'}}>Design system tokens v2</div>
                  <div style={styles.cardFooter}>
                    <span style={{...styles.badge, color: '#a78bfa', background: 'rgba(167, 139, 250, 0.1)'}}>Design</span>
                    <div style={{display:'flex', gap:'4px'}}>
                      <div style={{...styles.avatar, background: '#10b981'}}>AM</div>
                      <div style={{...styles.avatar, background: '#db2777'}}>PR</div>
                    </div>
                  </div>
                </div>
                <div style={styles.mockupCard}>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '12px'}}>Fix modal z-index bug</div>
                  <div style={styles.cardFooter}>
                    <span style={{...styles.badge, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)'}}>Bug</span>
                    <div style={{...styles.avatar, background: '#4f46e5'}}>KL</div>
                  </div>
                </div>
              </div>

              {/* REVIEW Column */}
              <div style={styles.column}>
                <div style={styles.columnHeader}>
                  <span style={{...styles.dot, background: '#c084fc'}}></span> REVIEW
                </div>
                <div style={styles.mockupCard}>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '12px'}}>API rate limiting docs</div>
                  <div style={styles.cardFooter}>
                    <span style={{...styles.badge, color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)'}}>Review</span>
                    <div style={{...styles.avatar, background: '#10b981'}}>AM</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.mockupFooter}>
              <span style={{...styles.dot, background: '#27c93f'}}></span>
              <span style={{fontSize: '12px', color: 'var(--text)'}}><b>3 teammates</b> active now &middot; last update 12s ago</span>
            </div>

            {/* Notification Badge */}
            <div className="glass-panel anim-glass-badge" style={styles.notificationToast}>
               <div style={{...styles.avatar, background: '#10b981', marginRight: '8px'}}>AM</div>
               <span style={{fontSize: '13px', color: 'var(--text-h)'}}>Amir completed <b>Design tokens v2</b> <span style={{color: 'var(--text)'}}>just now</span></span>
            </div>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.authContainer}>
            <h2 style={{ fontSize: '28px', marginBottom: '8px', fontFamily: 'var(--heading)' }}>Welcome back</h2>
            <p style={{ color: 'var(--text)', marginBottom: '32px' }}>Sign in to your workspace</p>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <button onClick={handleGoogleLogin} className="glass-panel" style={styles.socialBtn}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Reference_Icon.svg" alt="Google" style={{width: 20, height: 20}} />
                  Continue with Google
                </button>

                <div style={styles.divider}>
                  <div style={styles.dividerLine}></div>
                  <span style={styles.dividerText}>{isSignUp ? 'or sign up with email' : 'or sign in with email'}</span>
                  <div style={styles.dividerLine}></div>
                </div>

                <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {isSignUp && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', color: 'var(--text)' }}>Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={isSignUp}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', color: 'var(--text)' }}>Email</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ fontSize: '14px', color: 'var(--text)' }}>Password</label>
                      {!isSignUp && <a href="#" style={{ fontSize: '14px', color: 'var(--accent)', textDecoration: 'none' }}>Forgot?</a>}
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {isSignUp && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', color: 'var(--text)' }}>Confirm Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={isSignUp}
                      />
                    </div>
                  )}
                  <button type="submit" className="btn-primary" disabled={authLoading} style={{ marginTop: '8px' }}>
                    {authLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
                  </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text)' }}>
                  {isSignUp ? 'Already have an account?' : 'New to TaskHQ?'}
                  <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-h)', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '14px', marginLeft: '4px' }}
                  >
                    {isSignUp ? 'Sign In →' : 'Sign Up →'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </main>

      <section id="features" style={styles.section}>
        <div style={styles.sectionContainer}>
          <h2 style={{ fontSize: '40px', marginBottom: '24px', fontFamily: 'var(--heading)' }}>Powerful Features for Focus</h2>
          <p style={{ color: 'var(--text)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', marginBottom: '64px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          </p>
          <div style={styles.grid}>
            <div className="glass-panel" style={styles.gridCard}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-h)' }}>Real-time Collaboration</h3>
              <p style={{ color: 'var(--text)', fontSize: '15px' }}>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
            <div className="glass-panel" style={styles.gridCard}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-h)' }}>Admin Controls</h3>
              <p style={{ color: 'var(--text)', fontSize: '15px' }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
            <div className="glass-panel" style={styles.gridCard}>
              <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-h)' }}>Sprint Tracking</h3>
              <p style={{ color: 'var(--text)', fontSize: '15px' }}>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="policies" style={{...styles.section, background: 'var(--bg-secondary)'}}>
        <div style={styles.sectionContainer}>
          <h2 style={{ fontSize: '40px', marginBottom: '24px', fontFamily: 'var(--heading)' }}>Our Policies & Trust</h2>
          <p style={{ color: 'var(--text)', fontSize: '18px', maxWidth: '600px', margin: '0 auto', marginBottom: '48px' }}>
            We take your data seriously. Review our security and privacy commitments.
          </p>
          <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto', color: 'var(--text)' }}>
            <h3 style={{color: 'var(--text-h)', marginBottom: '12px'}}>1. Privacy Policy</h3>
            <p style={{marginBottom: '24px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum sit amet justo donec enim diam vulputate.</p>
            <h3 style={{color: 'var(--text-h)', marginBottom: '12px'}}>2. Security Standards</h3>
            <p style={{marginBottom: '24px'}}>Faucibus pulvinar elementum integer enim neque. Vel pharetra vel turpis nunc eget lorem dolor sed. Amet dictum sit amet justo donec enim diam.</p>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 TaskHQ Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 64px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(18, 18, 18, 0.8)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-h)'
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
  navLinks: {
    display: 'flex',
    gap: '32px'
  },
  navLink: {
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s'
  },
  main: {
    display: 'flex',
    flex: 1,
    minHeight: 'calc(100vh - 80px)',
  },
  heroLeft: {
    flex: '1.2',
    padding: '64px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRight: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden'
  },
  heroRight: {
    flex: '0.8',
    padding: '64px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'var(--bg-secondary)',
  },
  heroTitle: {
    fontSize: '72px',
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
    marginBottom: '24px',
    maxWidth: '500px'
  },
  heroSubtitle: {
    fontSize: '18px',
    color: 'var(--text)',
    maxWidth: '480px',
    lineHeight: '1.6',
    marginBottom: '48px'
  },
  mockupContainer: {
    padding: '20px',
    width: '100%',
    maxWidth: '600px',
    position: 'relative',
    zIndex: 10,
    marginBottom: '60px'
  },
  mockupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '20px'
  },
  windowControls: {
    display: 'flex',
    gap: '8px'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  mockupColumns: {
    display: 'flex',
    gap: '20px',
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  columnHeader: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    letterSpacing: '1px'
  },
  mockupCard: {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '16px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: '600'
  },
  avatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'white',
    fontWeight: 'bold',
    border: '2px solid var(--bg-tertiary)'
  },
  mockupFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border)'
  },
  notificationToast: {
    position: 'absolute',
    bottom: '-20px',
    left: '40px',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    zIndex: 20
  },
  authContainer: {
    maxWidth: '400px',
    width: '100%',
    margin: '0 auto'
  },
  socialBtn: {
    width: '100%',
    padding: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    color: 'var(--text-h)',
    fontFamily: 'var(--sans)',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '32px 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--border)'
  },
  dividerText: {
    fontSize: '12px',
    color: 'var(--text)'
  },
  section: {
    padding: '100px 64px',
    textAlign: 'center',
    borderBottom: '1px solid var(--border)'
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
    textAlign: 'left'
  },
  gridCard: {
    padding: '32px',
  },
  footer: {
    padding: '40px 64px',
    textAlign: 'center',
    color: 'var(--text)',
    fontSize: '14px',
    background: 'var(--bg-secondary)'
  }
};

export default Home;
