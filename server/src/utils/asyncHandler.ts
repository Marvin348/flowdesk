import { Request, Response, NextFunction, RequestHandler } from "express";
import type { ParamsDictionary, Query } from "express-serve-static-core";

// export const asyncHandler =
//   (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };

  export const asyncHandler =
    <
      P = ParamsDictionary,
      ResBody = any,
      ReqBody = any,
      ReqQuery = Query,
    >(
      fn: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction,
      ) => Promise<unknown>,
    ): RequestHandler<P, ResBody, ReqBody, ReqQuery> =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
