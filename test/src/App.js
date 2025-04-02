import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'register', 'home'
  const [isLoading, setIsLoading] = useState(true);
  
  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // 토큰 검증 API 호출
          // 실제 구현 시 아래 주석을 해제하고 백엔드 API 경로에 맞게 수정
          // const response = await fetch('api/verify-token', {
          //   method: 'GET',
          //   headers: {
          //     'Authorization': `Bearer ${token}`
          //   }
          // });
          
          // if (response.ok) {
          //   const data = await response.json();
          //   setCurrentUser(data.user);
          //   setIsLoggedIn(true);
          //   setView('home');
          // } else {
          //   // 토큰이 유효하지 않음
          //   localStorage.removeItem('authToken');
          // }

          // 백엔드 연동 전까지는 토큰이 있으면 자동 로그인된 것으로 간주
          // 실제로는 위의 주석 처리된 코드를 사용해야 합니다
          setIsLoggedIn(true);
          setView('home');
          
          // 임시 사용자 데이터 (실제로는 API 응답에서 받은 데이터 사용)
          setCurrentUser({
            id: 'temp_user',
            nickname: '임시 사용자'
          });
        } catch (error) {
          console.error('인증 확인 중 오류 발생:', error);
          localStorage.removeItem('authToken');
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setView('home');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('login');
    localStorage.removeItem('authToken');
  };
  
  if (isLoading) {
    return <div className="App">로딩 중...</div>;
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>사용자 관리 시스템</h1>
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
      </header>
    </div>
  );
}

export default App;
