const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../global/customError');
require('dotenv').config();

/**
 * 인증 미들웨어
 * JWT 토큰을 검증하여 유효한 사용자인지 확인
 * Bearer 스키마로 Authorization 헤더에서 토큰을 추출
 */
const authMiddleware = (req, res, next) => {
  // 헤더에서 토큰 가져오기
  const token = req.header('access');

  // 토큰이 없는 경우
  if (!token) {
    throw new UnauthorizedError('인증 토큰이 없습니다');
  }

  // 토큰 검증
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 요청 객체에 사용자 정보 추가
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('유효하지 않은 토큰입니다');
  }
};

module.exports = authMiddleware; 