import { useEffect, useState } from "react";

type RateLimitErrorProps = {
  message: string;
  retryAfterSeconds: number;
};

const RateLimitError = ({
  message,
  retryAfterSeconds,
}: RateLimitErrorProps) => {
  const [secondsLeft, setSecondsLeft] = useState(retryAfterSeconds);

  useEffect(() => {
    const inverfal = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(inverfal);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(inverfal);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="error-text">
      {message}{" "}
      {`Bitte versuchen sie es in ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} erneut.`}
    </div>
  );
};
export default RateLimitError;
