const LoginDto = require('../dto/loginDto');
const LoginService = require('../services/loginService');
const LoginRepository = require('../repositories/loginRepository');

/**
 * 로그인 컨트롤러
 * 단일 책임 원칙(SRP): 로그인 요청 처리만 담당
 */
class LoginController {
  constructor() {
    this.loginRepository = new LoginRepository();
    this.loginService = new LoginService(this.loginRepository);
  }

  /**
   * 로그인 요청 처리
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express 다음 미들웨어
   */
  async login(req, res, next) {
    try {
      // 요청 데이터 검증
      const loginDto = new LoginDto(req.body).validate();
      
      // 서비스에 로그인 처리 위임
      const result = await this.loginService.login(loginDto);
      
      // 토큰을 헤더에 설정
      res.setHeader('access', result.token);
      
      // 응답 반환 (토큰 제외)
      res.status(200).json(result.responseBody);
    } catch (error) {
      // 오류 처리를 글로벌 예외 처리기로 위임
      next(error);
    }
  }
}

// 싱글톤 인스턴스 생성
const loginController = new LoginController();

// 라우터에서 사용할 핸들러 함수 노출
module.exports = {
  login: (req, res, next) => loginController.login(req, res, next)
}; 