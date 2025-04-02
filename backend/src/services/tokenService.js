const { NotFoundError } = require('../global/customError');

/**
 * 토큰 서비스
 * 단일 책임 원칙(SRP): 토큰 검증 관련 비즈니스 로직만 처리
 */
class TokenService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * 토큰으로 사용자 정보 조회
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Object>} 사용자 정보
   */
  async verifyUserToken(userId) {
    // 사용자 조회
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError('사용자를 찾을 수 없습니다');
    }
    
    // 응답 데이터 생성
    return { 
      user: this.createUserResponse(user)
    };
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

module.exports = TokenService; 