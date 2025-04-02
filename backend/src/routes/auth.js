const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// 컨트롤러 가져오기
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const tokenController = require('../controllers/tokenController');
const logoutController = require('../controllers/logoutController');

// 회원가입
router.post('/register', registerController.register);

// 로그인
router.post('/login', loginController.login);

// 토큰 검증
router.get('/verify-token', authMiddleware, tokenController.verifyToken);

// 로그아웃
router.post('/logout', authMiddleware, logoutController.logout);

module.exports = router; 