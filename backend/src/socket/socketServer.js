// Socket.IO 서버 설정 및 이벤트 처리
const socketIO = require('socket.io');

// 연결된 사용자를 저장할 객체
const connectedUsers = {};
// 현재 사용중인 익명 사용자 번호를 추적
let anonymousCount = 0;

// 새로운 익명 이름 생성 함수
const generateAnonymousName = () => {
  anonymousCount++;
  return `익명${anonymousCount}`;
};

// Socket.IO 서버 초기화 함수
const initializeSocketServer = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // 연결 이벤트 처리
  io.on('connection', (socket) => {
    console.log(`새로운 사용자가 연결되었습니다: ${socket.id}`);
    
    // 자동으로 익명 이름 생성 및 사용자 추가
    const username = generateAnonymousName();
    connectedUsers[socket.id] = { 
      username, 
      id: socket.id 
    };
    
    // 클라이언트에게 자신의 사용자 정보 전송
    socket.emit('user_info', {
      username,
      id: socket.id
    });
    
    // 입장 메시지 전송
    io.emit('message', {
      id: Date.now(),
      type: 'system',
      text: `${username}님이 입장하셨습니다.`,
      timestamp: new Date()
    });
    
    // 사용자 목록 업데이트
    io.emit('users_update', Object.values(connectedUsers));
    
    console.log(`사용자 등록: ${username} (${socket.id})`);
    
    // 메시지 수신 및 브로드캐스팅
    socket.on('send_message', (message) => {
      const user = connectedUsers[socket.id];
      if (!user) return;
      
      // 메시지 형식 생성
      const formattedMessage = {
        id: Date.now(),
        userId: socket.id,
        username: user.username,
        text: message,
        timestamp: new Date(),
        type: 'user'
      };
      
      // 모든 클라이언트에게 메시지 전송
      io.emit('message', formattedMessage);
      console.log(`메시지 수신: ${user.username} - ${message}`);
    });
    
    // 연결 해제 처리
    socket.on('disconnect', () => {
      const user = connectedUsers[socket.id];
      if (user) {
        // 퇴장 메시지 전송
        io.emit('message', {
          id: Date.now(),
          type: 'system',
          text: `${user.username}님이 퇴장하셨습니다.`,
          timestamp: new Date()
        });
        
        // 사용자 제거
        delete connectedUsers[socket.id];
        
        // 사용자 목록 업데이트
        io.emit('users_update', Object.values(connectedUsers));
        
        console.log(`사용자 연결 해제: ${user.username} (${socket.id})`);
      }
    });
  });
  
  return io;
};

module.exports = { initializeSocketServer }; 