/**
 * 로그인 DTO
 * 단일 책임 원칙(SRP): 로그인 데이터 검증만 담당
 */
class LoginDto {
  constructor(data) {
    this.id = data.id;
    this.pwd = data.pwd;
  }

  validate() {
    if (!this.id || !this.pwd) {
      throw new Error('아이디와 비밀번호를 모두 입력해주세요');
    }
    return this;
  }
}

module.exports = LoginDto; 