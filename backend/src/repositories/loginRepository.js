const { db } = require('../config/db');
const { InternalServerError } = require('../global/customError');

/**
 * 로그인 레포지토리
 * 단일 책임 원칙(SRP): 로그인 관련 데이터 액세스만 담당
 */
class LoginRepository {
  /**
   * ID로 사용자 찾기
   * @param {string} id - 사용자 ID
   * @returns {Promise<Object|null>} 사용자 객체 또는 null
   */
  async findUserById(id) {
    try {
      const user = await db.User.findByPk(id);
      return user ? user.toJSON() : null;
    } catch (error) {
      throw new InternalServerError('사용자 조회 중 오류가 발생했습니다');
    }
  }
}

module.exports = LoginRepository; 