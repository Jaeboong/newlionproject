const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UnauthorizedError } = require('../global/customError');

/**
 * 로그인 서비스
 * 단일 책임 원칙(SRP): 로그인 관련 비즈니스 로직만 처리
 */
class LoginService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * 사용자 로그인 처리
   * @param {LoginDto} loginDto - 로그인 데이터
   * @returns {Object} 로그인 결과와 토큰
   */
  async login(loginDto) {
    // 사용자 찾기
    const user = await this.userRepository.findUserById(loginDto.id);
    if (!user) {
      throw new UnauthorizedError('아이디 또는 비밀번호가 올바르지 않습니다');
    }

    // 비밀번호 검증
    const isPasswordValid = await this.comparePassword(loginDto.pwd, user.pwd);
    if (!isPasswordValid) {
      throw new UnauthorizedError('아이디 또는 비밀번호가 올바르지 않습니다');
    }

    // 토큰 생성
    const token = this.generateToken(user.id);

    // 사용자 정보 생성 (비밀번호 등 민감 정보 제외)
    const userResponse = this.createUserResponse(user);

    return {
      responseBody: {
        message: '로그인 성공',
        user: userResponse
      },
      token
    };
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * 사용자 응답 객체 생성 (민감한 정보 제외)
   * @param {Object} user - 사용자 데이터
   * @returns {Object} 필터링된 사용자 데이터
   */
  createUserResponse(user) {
    return {
      id: user.id,
      nickname: user.nickname,
      createdAt: user.created_at
    };
  }
}

module.exports = LoginService; 