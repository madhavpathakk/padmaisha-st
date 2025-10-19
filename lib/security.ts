import type { NextRequest } from 'next/server';

export function getSecurityHeaders(req: NextRequest, nonce: string) {
  return {
    'Content-Security-Policy': getCSP(nonce),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  };
}

export function getCSP(nonce: string) {
  const rules = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "'wasm-unsafe-eval'",
      "'inline-speculation-rules'",
      `'nonce-${nonce}'`,
      'chrome-extension:',
      'https://apis.google.com',
      'https://*.googletagmanager.com',
      'https://*.google-analytics.com',
      'https://web3forms.com',
      'https://*.firebaseio.com',
      'https://*.googleapis.com'
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': [
      "'self'",
      'blob:',
      'data:',
      'https:',
      'http://localhost:*',
      'https://images.unsplash.com',
      'https://*.google-analytics.com',
      'https://*.googletagmanager.com'
    ],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'connect-src': [
      "'self'",
      'https://*.firebaseio.com',
      'https://*.googleapis.com',
      'https://*.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://identitytoolkit.googleapis.com',
      'https://web3forms.com',
      'ws://localhost:*'
    ],
    'frame-src': [
      "'self'",
      'https://accounts.google.com',
      'https://*.firebaseapp.com'
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': []
  };

  return Object.entries(rules)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}
