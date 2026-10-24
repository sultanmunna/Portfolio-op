import { Archivo } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';

export const display = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-display',
  display: 'swap',
});

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-mono',
  display: 'swap',
});
