import { asyncHandler } from "@/utils/asyncHandler";
import type { Request, Response, NextFunction } from "express";
import { consumeRateLimit } from "@/features/rate-limits/services/rateLimit.service";
import { AppError } from "@/utils/AppError";
import {
  RateLimitTypes,
  IdentifierType,
} from "@/features/rate-limits/types/rateLimits";
import { RATE_LIMIT_CONFIG } from "@/features/rate-limits/constants/rateLimitTTL.constants";

const getIdentifier = (
  req: Request,
  identifierType: IdentifierType,
): string | undefined => {
  if (identifierType === "ip") return req.ip;

  if (identifierType === "email") {
    return typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : undefined;
  }

  return req.user?.id;
};

export const rateLimitMiddleware = <T extends RateLimitTypes>(type: T) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const rules = RATE_LIMIT_CONFIG[type];

      for (const rule of rules) {
        const identifier = getIdentifier(req, rule.identifierType);

        if (!identifier) continue;

        const input = {
          type,
          identifier,
          identifierType: rule.identifierType,
          maxRequests: rule.maxRequests,
          ttlSeconds: rule.ttlSeconds,
        };

        const { allowed, retryAfterSeconds } = await consumeRateLimit(input);

        if (!allowed && retryAfterSeconds !== undefined) {
          res.setHeader("Retry-After", retryAfterSeconds);
        }

        if (!allowed) {
          throw new AppError(
            "You have sent too many requests in a short period of time",
            429,
          );
        }
      }

      next();
    },
  );
};
