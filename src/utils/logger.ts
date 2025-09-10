// Lightweight colored logger for RN/Expo Metro (ANSI where supported)
const C = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
} as const;

function color(s: string, col: keyof typeof C) {
  return `${C[col]}${s}${C.reset}`;
}

export function truncate(str: string, max = 800) {
  if (str.length <= max) return str;
  return str.slice(0, max) + '…';
}

export function pretty(data: unknown, max = 800) {
  try {
    return truncate(JSON.stringify(data, null, 2), max);
  } catch {
    return String(data);
  }
}

function statusColor(status: number) {
  if (status >= 500) return 'red';
  if (status >= 400) return 'yellow';
  if (status >= 200) return 'green';
  return 'blue';
}

const ENABLED: boolean = (typeof __DEV__ !== 'undefined' ? __DEV__ : true);

export const logger = {
  info: (msg: string) => { if (ENABLED) console.log(`${color('[INFO]', 'blue')} ${msg}`); },
  warn: (msg: string) => { if (ENABLED) console.log(`${color('[WARN]', 'yellow')} ${msg}`); },
  error: (msg: string) => { if (ENABLED) console.log(`${color('[ERROR]', 'red')} ${msg}`); },
  http: (args: { method: string; url: string; status: number; ms: number }) => {
    if (!ENABLED) return;
    const { method, url, status, ms } = args;
    const line = [
      color('[HTTP]', 'magenta'),
      color(method.toUpperCase(), 'cyan'),
      color(url, 'gray'),
      '->',
      color(String(status), statusColor(status) as any),
      color(`${ms}ms`, 'magenta'),
    ].join(' ');
    console.log(line);
  },
  httpBody: (data: unknown) => {
    if (!ENABLED) return;
    const body = pretty(data);
    console.log(`  ${color('↳ body:', 'dim')} ${body}`);
  },
};

export default logger;
