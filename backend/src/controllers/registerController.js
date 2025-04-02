const RegisterDto = require('../dto/registerDto');
const RegisterService = require('../services/registerService');
const RegisterRepository = require('../repositories/registerRepository');

class RegisterController {
  constructor() {
    this.registerRepository = new RegisterRepository();
    this.registerService = new RegisterService(this.registerRepository);
  }

  async register(req, res, next) {
    try {
      // 요청 데이터 검증
      const registerDto = new RegisterDto(req.body).validate();
      
      // 서비스에 회원가입 처리 위임
      const result = await this.registerService.register(registerDto);
      
      // 응답 반환
      res.status(201).json(result);
    } catch (error) {
      // 오류 처리를 글로벌 예외 처리기로 위임
      next(error);
    }
  }
}

// 싱글톤 인스턴스 생성
const registerController = new RegisterController();

// 라우터에서 사용할 핸들러 함수 노출
module.exports = {
  register: (req, res, next) => registerController.register(req, res, next)
}; 