// 기본 에러 클래스
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request
class BadRequestError extends ApiError {
  constructor(message = '잘못된 요청입니다') {
    super(message, 400);
  }
}

// 401 Unauthorized
class UnauthorizedError extends ApiError {
  constructor(message = '인증이 필요합니다') {
    super(message, 401);
  }
}

// 403 Forbidden
class ForbiddenError extends ApiError {
  constructor(message = '접근 권한이 없습니다') {
    super(message, 403);
  }
}

// 404 Not Found
class NotFoundError extends ApiError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, 404);
  }
}

// 409 Conflict
class ConflictError extends ApiError {
  constructor(message = '리소스 충돌이 발생했습니다') {
    super(message, 409);
  }
}

// 500 Internal Server Error
class InternalServerError extends ApiError {
  constructor(message = '서버 오류가 발생했습니다') {
    super(message, 500);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError
}; 