'use client';
import { vars } from 'nativewind';

export const config = {
  light: vars({
    '--background': '255 255 255',
    '--foreground': '0 0 0',
    '--primary': '3 2 19',
    '--primary-foreground': '255 255 255',
    '--secondary': '242 242 245',
    '--secondary-foreground': '3 2 19',
    '--muted': '236 236 240',
    '--muted-foreground': '113 113 130',
    '--accent': '233 235 239',
    '--accent-foreground': '3 2 19',
    '--destructive': '212 24 61',
    '--destructive-foreground': '255 255 255',
    '--border': '0 0 0',
    '--ring': '180 180 180',
  }),
  dark: vars({
    '--background': '37 37 37',
    '--foreground': '251 251 251',
    '--primary': '251 251 251',
    '--primary-foreground': '52 52 52',
    '--secondary': '68 68 68',
    '--secondary-foreground': '251 251 251',
    '--muted': '68 68 68',
    '--muted-foreground': '180 180 180',
    '--accent': '68 68 68',
    '--accent-foreground': '251 251 251',
    '--destructive': '127 29 29',
    '--destructive-foreground': '251 251 251',
    '--border': '68 68 68',
    '--ring': '112 112 112',
  }),
};