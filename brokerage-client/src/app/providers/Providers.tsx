'use client';

import ThemeRegistry from './ThemeRegistry/ThemeRegistry';

export function Providers({ children }: { children: any }) {
  return <ThemeRegistry>{children}</ThemeRegistry>;
}
