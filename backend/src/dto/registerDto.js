/**
 * 회원가입 DTO
 * 단일 책임 원칙(SRP): 회원가입 데이터 검증만 담당
 */
class RegisterDto {
  constructor(data) {
    this.id = data.id;
    this.pwd = data.pwd;
    this.nickname = data.nickname;
  }

  validate() {
    if (!this.id || !this.pwd || !this.nickname) {
      throw new Error('모든 필드를 입력해주세요');
    }

    if (this.id.length < 4 || this.id.length > 20) {
      throw new Error('아이디는 4~20자 사이여야 합니다');
    }

    if (this.pwd.length < 8) {
      throw new Error('비밀번호는 최소 8자 이상이어야 합니다');
    }

    if (this.nickname.length < 2 || this.nickname.length > 20) {
      throw new Error('닉네임은 2~20자 사이여야 합니다');
    }

    return this;
  }
}

module.exports = RegisterDto; 