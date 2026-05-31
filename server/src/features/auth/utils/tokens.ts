import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES_IN = "1d";

const getJwtAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is missing");
  }

  return secret;
};

export const createAccessToken = (userId: string) => {
    
  return jwt.sign(
    { sub: userId }, 
    getJwtAccessSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, getJwtAccessSecret());
};
