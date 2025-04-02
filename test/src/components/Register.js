import { useState } from 'react';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // API 요청을 위한 함수
  const registerUser = async (userData) => {
    try {
      const response = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!id.trim() || !pwd.trim() || !nickname.trim()) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    if (pwd !== pwdConfirm) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 새 사용자 등록 데이터
      const userData = {
        id,
        pwd,
        nickname
      };
      
      // API 요청으로 회원가입
      await registerUser(userData);
      
      // 회원가입 성공
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      onRegisterSuccess();
    } catch (error) {
      setError(error.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>회원가입</h2>
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
            required
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
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pwdConfirm">비밀번호 확인</label>
          <input
            type="password"
            id="pwdConfirm"
            value={pwdConfirm}
            onChange={(e) => setPwdConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            required
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? '처리 중...' : '회원가입'}
        </button>
      </form>
      <p className="switch-form">
        이미 계정이 있으신가요? <button onClick={onSwitchToLogin} disabled={isLoading}>로그인</button>
      </p>
    </div>
  );
}

export default Register; 