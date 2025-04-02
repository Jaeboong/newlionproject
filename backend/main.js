const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./src/config/db');
const globalExceptionHandler = require('./src/global/globalExceptionHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 인증 라우트 - 모든 인증 관련 엔드포인트는 auth.js에서 처리
app.use('/api', require('./src/routes/auth'));

// 기본 경로
app.get('/', (req, res) => {
  res.send('API 서버가 실행 중입니다');
});

// 글로벌 예외 처리기
app.use(globalExceptionHandler);

// 데이터베이스 초기화 및 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer(); 