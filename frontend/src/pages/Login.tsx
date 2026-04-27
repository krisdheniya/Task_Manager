import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/auth';

const LoginPage = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // If already authenticated, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Handle Email/Password Auth
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        alert('Check your email for the confirmation link!');
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        
        <form onSubmit={handleEmailAuth} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" disabled={authLoading} style={styles.primaryBtn}>
            {authLoading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Reference_Icon.svg" 
            alt="Google" 
            style={styles.googleIcon} 
          />
          Continue with Google
        </button>

        <p style={styles.toggleText}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={styles.link}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

// Basic CSS-in-JS for a clean look
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' },
  card: { padding: '40px', borderRadius: '12px', backgroundColor: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  title: { marginBottom: '24px', fontSize: '24px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' },
  primaryBtn: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#000', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  divider: { margin: '20px 0', borderBottom: '1px solid #eee', position: 'relative' },
  dividerText: { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '0 10px', color: '#888', fontSize: '14px' },
  googleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: '16px', color: '#555' },
  googleIcon: { width: '20px', height: '20px' },
  toggleText: { marginTop: '20px', color: '#666', fontSize: '14px' },
  link: { color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }
};

export default LoginPage;