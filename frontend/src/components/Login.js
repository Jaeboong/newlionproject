import { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // 모든 필드가 입력되었는지 확인
    if (!id.trim() || !pwd.trim()) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return false;
    }
    
    // 아이디 길이 검증 (4~20자)
    if (id.length < 4 || id.length > 20) {
      setError('아이디는 4~20자 사이여야 합니다.');
      return false;
    }
    
    // 비밀번호 길이 검증 (최소 8자)
    if (pwd.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 폼 유효성 검사
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, pwd }),
      });
      
      const data = await response.json();
      console.log('로그인 응답:', data);
      
      if (!response.ok) {
        setError(data.message || '로그인에 실패했습니다.');
        return;
      }
      
      // access 헤더에서 토큰 추출
      const token = response.headers.get('access');
      console.log('받은 토큰:', token);
      
      // 토큰이 없는 경우
      if (!token) {
        setError('인증 토큰을 받지 못했습니다.');
        return;
      }
      
      // 토큰 저장
      localStorage.setItem('authToken', token);
      
      // 사용자 정보 추출
      let user;
      if (data.user) {
        // 백엔드가 직접 user 객체를 반환하는 경우
        user = data.user;
      } else if (data.message && data.message === '로그인 성공') {
        // 백엔드가 user 객체를 responseBody.user에 포함하는 경우
        user = data.user || {
          id: id,
          nickname: id
        };
      }
      
      console.log('로그인 성공, 사용자 정보:', user);
      
      // 로그인 성공 처리
      onLogin(user);
    } catch (error) {
      console.error('로그인 오류:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else if (error.name === 'SyntaxError') {
        setError('서버 응답이 올바르지 않습니다. 서버 상태를 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
        console.error(error);
      }
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