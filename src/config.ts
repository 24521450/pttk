/**
 * config.ts — Centralised runtime configuration for TrainHyp AI
 *
 * Set VITE_API_URL in your .env.local to point at a different backend:
 *   VITE_API_URL=http://my-server.com:8000
 *
 * Falls back to http://localhost:8000 for local development.
 */

export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";
