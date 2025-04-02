import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'register', 'home'
  const [isLoading, setIsLoading] = useState(true);
  
  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        // 토큰이 없는 경우 로딩 상태 종료
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('/api/verify-token', {
          method: 'GET',
          headers: {
            'access': token
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('토큰 검증 응답:', data);
          
          // 사용자 정보 추출
          const userData = data.user;
          
          if (userData) {
            setCurrentUser(userData);
            setIsLoggedIn(true);
            setView('home');
            console.log('토큰 검증 성공, 사용자 정보:', userData);
          } else {
            console.error('토큰 검증 응답에 사용자 정보가 없음:', data);
            localStorage.removeItem('authToken');
          }
        } else {
          // 토큰이 유효하지 않은 경우 로컬 스토리지에서 제거
          console.error('토큰 검증 실패');
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        // 오류 발생 시 토큰 제거
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  const handleLogin = (user) => {
    console.log('로그인 핸들러 호출됨, 사용자:', user);
    if (!user) {
      console.error('사용자 정보 없음');
      return;
    }
    
    setCurrentUser(user);
    setIsLoggedIn(true);
    setView('home');
  };
  
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // 서버에 로그아웃 요청
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'access': token
          }
        });
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setCurrentUser(null);
      setView('login');
    }
  };
  
  if (isLoading) {
    return <div className="App">로딩 중...</div>;
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>사용자 관리 시스템</h1>
        <ErrorBoundary>
          {view === 'login' && (
            <Login 
              onLogin={handleLogin} 
              onSwitchToRegister={() => setView('register')} 
            />
          )}
          {view === 'register' && (
            <Register 
              onRegisterSuccess={() => setView('login')} 
              onSwitchToLogin={() => setView('login')} 
            />
          )}
          {view === 'home' && (
            <Home 
              user={currentUser} 
              onLogout={handleLogout} 
            />
          )}
        </ErrorBoundary>
      </header>
    </div>
  );
}

export default App;
