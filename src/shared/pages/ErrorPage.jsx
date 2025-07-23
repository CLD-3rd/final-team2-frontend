"use client";

const ErrorPage = ({
  statusCode = 500,
  httpMessage = "Internal Server Error",
  message = "죄송합니다. 예상치 못한 오류가 발생했습니다.",
  onRetry,
  onGoHome,
}) => {
  const getErrorIcon = (status) => {
    if (status === 404) return "🔍";
    if (status === 403) return "🔒";
    if (status === 500) return "⚠️";
    return "❌";
  };

  const getErrorTitle = (status) => {
    if (status === 404) return "페이지를 찾을 수 없습니다";
    if (status === 403) return "접근이 거부되었습니다";
    if (status === 500) return "서버 오류가 발생했습니다";
    return "오류가 발생했습니다";
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = "/";
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon-section">
            <div className="error-icon">{getErrorIcon(statusCode)}</div>
            <div className="error-status-code">{statusCode}</div>
          </div>

          <div className="error-message-section">
            <h1 className="error-title">{getErrorTitle(statusCode)}</h1>

            <div className="error-details">
              <p className="error-http-message">
                <strong>HTTP 상태:</strong> {statusCode} - {httpMessage}
              </p>
              <p className="error-description">{message}</p>
            </div>
          </div>

          <div className="error-actions">
            <button className="error-btn primary" onClick={handleGoHome}>
              <span className="btn-icon">🏠</span>
              홈으로 돌아가기
            </button>

            <button className="error-btn secondary" onClick={handleRetry}>
              <span className="btn-icon">🔄</span>
              다시 시도
            </button>
          </div>

          <div className="error-help">
            <p className="help-text">
              문제가 계속 발생하면 고객센터로 문의해주세요.
            </p>
            <div className="help-links">
              <a href="/support" className="help-link">
                고객센터
              </a>
              <span className="help-separator">|</span>
              <a href="/faq" className="help-link">
                자주 묻는 질문
              </a>
            </div>
          </div>
        </div>

        <div className="error-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
