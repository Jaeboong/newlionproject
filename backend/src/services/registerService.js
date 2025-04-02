const bcrypt = require('bcrypt');
const { ConflictError } = require('../global/customError');

/**
 * 회원가입 서비스
 * 단일 책임 원칙(SRP): 회원가입 관련 비즈니스 로직만 처리
 */
class RegisterService {
  constructor(registerRepository) {
    this.registerRepository = registerRepository;
  }

  /**
   * 사용자 등록 처리
   * @param {RegisterDto} registerDto - 회원가입 데이터
   * @returns {Promise<Object>} 등록 결과
   */
  async register(registerDto) {
    // 사용자 ID 중복 확인
    const exists = await this.registerRepository.checkUserExists(registerDto.id);
    if (exists) {
      throw new ConflictError('이미 사용 중인 아이디입니다');
    }

    // 비밀번호 해싱
    const hashedPassword = await this.hashPassword(registerDto.pwd);

    // 사용자 생성
    await this.registerRepository.createUser({
      id: registerDto.id,
      pwd: hashedPassword,
      nickname: registerDto.nickname
    });

    return { message: '회원가입이 완료되었습니다' };
  }

  /**
   * 비밀번호 해싱
   * @param {string} password - 원본 비밀번호
   * @returns {Promise<string>} 해시된 비밀번호
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

module.exports = RegisterService; 