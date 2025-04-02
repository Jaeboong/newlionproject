import { useState } from 'react';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // 모든 필드가 입력되었는지 확인
    if (!id.trim() || !pwd.trim() || !nickname.trim()) {
      setError('모든 필드를 입력해주세요.');
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
    
    // 닉네임 길이 검증 (2~20자)
    if (nickname.length < 2 || nickname.length > 20) {
      setError('닉네임은 2~20자 사이여야 합니다.');
      return false;
    }
    
    // 비밀번호 일치 여부 확인
    if (pwd !== pwdConfirm) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          pwd,
          nickname
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }
      
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      onRegisterSuccess();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else if (error.name === 'SyntaxError') {
        setError('서버 응답이 올바르지 않습니다. 서버 상태를 확인해주세요.');
      } else {
        setError(error.message || '회원가입 중 오류가 발생했습니다.');
      }
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
          <label htmlFor="id">아이디 (4~20자)</label>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디를 입력하세요 (4~20자)"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pwd">비밀번호 (8자 이상)</label>
          <input
            type="password"
            id="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="비밀번호를 입력하세요 (8자 이상)"
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
          <label htmlFor="nickname">닉네임 (2~20자)</label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요 (2~20자)"
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