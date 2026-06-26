type ErrorMessageProps = {
  message?: string;
  className?: string;
};

const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  return (
    <div className={`text-sm ${className} error-text`}>{message}</div>
  );
};
export default ErrorMessage;
