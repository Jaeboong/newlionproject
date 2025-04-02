const { ApiError } = require('./customError');

// 글로벌 에러 처리 미들웨어
const globalExceptionHandler = (err, req, res, next) => {
  console.error('에러 발생:', err);

  // API 에러 처리
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // JWT 검증 에러 처리
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: '유효하지 않은 토큰입니다'
    });
  }

  // 입력 검증 에러 처리
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message
    });
  }

  // 데이터베이스 에러 처리
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(500).json({
      message: '데이터베이스 오류가 발생했습니다'
    });
  }

  // 그 외 모든 에러
  return res.status(500).json({
    message: '서버 오류가 발생했습니다'
  });
};

module.exports = globalExceptionHandler; 