import nextAuth from "next-auth";

import { authConfig } from "./auth.config";

export const { auth: middleware } = nextAuth(authConfig);
