const { db } = require('../config/db');
const { ConflictError, InternalServerError } = require('../global/customError');

/**
 * 회원가입 레포지토리
 * 단일 책임 원칙(SRP): 회원가입 관련 데이터 액세스만 담당
 */
class RegisterRepository {
  /**
   * 사용자 생성
   * @param {Object} userData - 사용자 데이터
   * @returns {Promise<Object>} 생성 결과
   */
  async createUser(userData) {
    try {
      const user = await db.User.create(userData);
      return user.toJSON();
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictError('이미 사용 중인 아이디입니다');
      }
      throw new InternalServerError('사용자 생성 중 오류가 발생했습니다');
    }
  }

  /**
   * 사용자 ID 중복 확인
   * @param {string} id - 사용자 ID
   * @returns {Promise<boolean>} 중복 여부
   */
  async checkUserExists(id) {
    try {
      const count = await db.User.count({ where: { id } });
      return count > 0;
    } catch (error) {
      throw new InternalServerError('사용자 조회 중 오류가 발생했습니다');
    }
  }
}

module.exports = RegisterRepository; 