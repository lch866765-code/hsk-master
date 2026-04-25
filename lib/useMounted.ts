'use client';

import { useState, useEffect } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 * Use this to defer rendering of localStorage-dependent UI to avoid
 * hydration mismatches between SSR and the client.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Intentionally setting state in effect — this is the standard pattern for
    // detecting client-side mount to avoid SSR/client hydration mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return mounted;
}
