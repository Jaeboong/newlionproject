/**
 * 로그아웃 컨트롤러
 * 단일 책임 원칙(SRP): 로그아웃 요청 처리만 담당
 */
class LogoutController {
  /**
   * 로그아웃 요청 처리
   * @param {Request} req - Express 요청 객체
   * @param {Response} res - Express 응답 객체
   * @param {Function} next - Express 다음 미들웨어
   */
  logout(req, res, next) {
    try {
      // JWT는 Stateless이므로 서버에서 특별한 처리가 필요 없음
      // 클라이언트에서 토큰을 제거하면 로그아웃됨
      res.status(200).json({ message: '로그아웃되었습니다' });
    } catch (error) {
      // 오류 처리를 글로벌 예외 처리기로 위임
      next(error);
    }
  }
}

// 싱글톤 인스턴스 생성
const logoutController = new LogoutController();

// 라우터에서 사용할 핸들러 함수 노출
module.exports = {
  logout: (req, res, next) => logoutController.logout(req, res, next)
}; 