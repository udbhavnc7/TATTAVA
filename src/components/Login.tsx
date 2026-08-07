import React, { useState } from 'react';
import { User, Mail, Lock, Pointer } from 'lucide-react';
import ImmersiveBackground from './ImmersiveBackground';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
  onGoogleLogin?: () => void;
}

export default function Login({ onLogin, onGoogleLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bubbleText, setBubbleText] = useState('Beep boop. Who goes there?');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (val.trim()) {
      setBubbleText(`Hey ${val}, peekaboo`);
    } else {
      setBubbleText('Beep boop. Who goes there?');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    
    if (!val) {
      if (name.trim()) {
        setBubbleText(`Hey ${name}, peekaboo`);
      } else {
        setBubbleText('Beep boop. Who goes there?');
      }
      return;
    }

    const isHard = val.length >= 8 && /[!@#$%^&*(),.?":{}|<>0-9]/.test(val);
    const isMedium = val.length >= 5;

    if (isHard) {
      setBubbleText("Oh Jesus Christ! That's a damn tough password");
    } else if (isMedium) {
      setBubbleText("Bruh, don't try to fool the shit outta me");
    } else {
      setBubbleText("Dude that's an easy password, try harder");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBubbleText("yea you can now enter the app buddy");
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="volt-login-container">
      <ImmersiveBackground />
      <div className="volt-wrapper">
        <div className="bubble" id="bubble" role="status" aria-live="polite">
          <span id="bubbleText">{bubbleText}</span>
        </div>

        <div className="antenna" aria-hidden="true">
          <span className="antenna-tip"></span>
          <span className="antenna-rod"></span>
        </div>

        <div className="head3d" aria-hidden="true">
          <div className="head" id="head">
            <span className="ear ear--l"></span>
            <span className="ear ear--r"></span>
            <div className="face">
              <div className="eye"></div>
              <div className="blush left"></div>
              <div className="mouth"></div>
              <div className="blush right"></div>
              <div className="eye"></div>
            </div>
          </div>
        </div>

        <div className="login-card-wrapper">
          <div className="hand hand--l"></div>
          <div className="hand hand--r"></div>
          
          <div className="login-card">
            <h2>Beep boop. Who goes there?</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <User />
                <input 
                  type="text" 
                  placeholder="Your name" 
                  value={name}
                  onChange={handleNameChange}
                  disabled={isLoggingIn}
                  required
                />
              </div>
              
              <div className="input-group">
                <Mail />
                <input type="email" placeholder="Your email" disabled={isLoggingIn} required />
              </div>
              
              <div className="input-group">
                <Lock />
                <input 
                  type="password" 
                  placeholder="Super secret password" 
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoggingIn}
                  required
                />
              </div>
              
              <button type="submit" disabled={isLoggingIn} className="login-btn flex items-center justify-center gap-2">
                LOG ME IN <Pointer size={18} />
              </button>
            </form>

            {onGoogleLogin && (
              <>
                <div className="login-divider">or</div>
                <button
                  type="button"
                  onClick={onGoogleLogin}
                  disabled={isLoggingIn}
                  className="login-btn-google flex items-center justify-center gap-2"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  Sign in with Google
                </button>
              </>
            )}
          </div>

          <span className="foot foot--l" aria-hidden="true"></span>
          <span className="foot foot--r" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  );
}
