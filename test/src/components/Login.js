import { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API 요청을 위한 함수
  const loginUser = async (credentials) => {
    try {
      const response = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '로그인에 실패했습니다.');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!id.trim() || !pwd.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // API 요청
      const data = await loginUser({ id, pwd });
      
      // 토큰을 로컬 스토리지에 저장 (JWT 토큰 사용 시)
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      // 로그인 성공
      onLogin(data.user);
    } catch (error) {
      setError(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">아이디</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디를 입력하세요"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pwd">비밀번호</label>
          <input
            type="password"
            id="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p className="switch-form">
        계정이 없으신가요? <button onClick={onSwitchToRegister} disabled={isLoading}>회원가입</button>
      </p>
    </div>
  );
}

export default Login; 