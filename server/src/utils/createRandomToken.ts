import crypto from "crypto";

export const createRandomToken = () => crypto.randomBytes(32).toString("hex");
