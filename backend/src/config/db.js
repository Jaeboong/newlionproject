const db = require('../models');
const { InternalServerError } = require('../global/customError');

// 데이터베이스 연결 및 초기화
const initializeDatabase = async () => {
  try {
    // 데이터베이스 연결 확인
    await db.sequelize.authenticate();
    console.log('데이터베이스 연결 성공');

    // 모델 싱크 (개발 환경에서만 force: true 사용)
    const forceSync = process.env.NODE_ENV === 'development' && process.env.DB_FORCE_SYNC === 'true';
    await db.sequelize.sync({ force: forceSync });
    console.log(`데이터베이스 모델 동기화 완료${forceSync ? ' (테이블 재생성)' : ''}`);

    return db;
  } catch (error) {
    console.error('데이터베이스 초기화 실패:', error);
    throw new InternalServerError('데이터베이스 연결 오류');
  }
};

module.exports = {
  db,
  initializeDatabase
}; 