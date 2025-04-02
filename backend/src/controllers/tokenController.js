const TokenService = require('../services/tokenService');
const LoginRepository = require('../repositories/loginRepository');

/**
 * 토큰 컨트롤러
 * 단일 책임 원칙(SRP): 토큰 검증 요청 처리만 담당
 */
class TokenController {
  constructor() {
    this.loginRepository = new LoginRepository();
    this.tokenService = new TokenService(this.loginRepository);
  }

  /**
   * 토큰 검증 요청 처리
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express 다음 미들웨어
   */
  async verifyToken(req, res, next) {
    try {
      // 인증 미들웨어에서 가져온 사용자 ID
      const userId = req.user.id;
      
      // 서비스에 토큰 검증 위임
      const result = await this.tokenService.verifyUserToken(userId);
      
      // 응답 반환
      res.status(200).json(result);
    } catch (error) {
      // 오류 처리를 글로벌 예외 처리기로 위임
      next(error);
    }
  }
}

// 싱글톤 인스턴스 생성
const tokenController = new TokenController();

// 라우터에서 사용할 핸들러 함수 노출
module.exports = {
  verifyToken: (req, res, next) => tokenController.verifyToken(req, res, next)
}; 