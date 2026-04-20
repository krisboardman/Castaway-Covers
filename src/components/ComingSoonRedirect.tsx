'use client';

/**
 * No-op placeholder. Coming-soon gating is controlled by the middleware
 * (`src/middleware.ts`) and the `NEXT_PUBLIC_COMING_SOON_MODE` env var
 * (see `src/config/site.ts`). This component is kept only to avoid
 * breaking existing imports.
 */
export default function ComingSoonRedirect() {
  return null;
}
