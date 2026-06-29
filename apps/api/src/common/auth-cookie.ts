import { Response } from "express";

export const AUTH_COOKIE_NAME = "atlas_auth";
export const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function setAuthCookie(response: Response, token: string) {
  response.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

export function clearAuthCookie(response: Response) {
  response.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
