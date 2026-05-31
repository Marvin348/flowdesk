type ErrorMessageProps = {
  message?: string;
  className?: string;
};

const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  return (
    <div className={`text-sm error-text ${className}`}>{message}</div>
  );
};
export default ErrorMessage;
