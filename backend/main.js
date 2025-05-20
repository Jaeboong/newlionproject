const express = require('express');
const cors = require('cors')
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const { initializeDatabase } = require('./src/config/db');
const globalExceptionHandler = require('./src/global/globalExceptionHandler');
const { initializeSocketServer } = require('./src/socket/socketServer');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS 설정 - 개발 환경에서는 모든 오리진 허용
app.use(cors({
  origin: true, // 모든 오리진 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'access'],
  exposedHeaders: ['access'] // 응답에서 access 헤더를 노출
}));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', JSON.stringify(req.headers));
  next();
});

// HTTPS 설정
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/mongdangbul.store/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/mongdangbul.store/fullchain.pem')
};

// 미들웨어
app.use(express.json());

// 기본 경로
app.get('/', (req, res) => {
  res.send('API 서버가 실행 중입니다');
});

// 글로벌 예외 처리기
app.use(globalExceptionHandler);

// HTTPS 서버 생성
const server = https.createServer(options, app);

// Socket.IO 서버 초기화
const io = initializeSocketServer(server);

// 데이터베이스 초기화 및 서버 시작
const startServer = async () => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();
    
    // HTTPS 서버 시작
    server.listen(PORT, () => {
      console.log(`HTTPS 서버가 ${PORT} 포트에서 실행 중입니다.`);
      console.log(`Socket.IO 서버가 초기화되었습니다.`);
      console.log(`CORS 설정: 모든 오리진 허용`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();