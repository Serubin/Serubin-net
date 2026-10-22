export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogFields = Record<string, unknown>;

export interface Logger {
  debug(msg: string, fields?: LogFields): void;
  info(msg: string, fields?: LogFields): void;
  warn(msg: string, fields?: LogFields): void;
  error(msg: string, fields?: LogFields): void;
}

type LoggerOptions = {
  /** Emit debug lines regardless of LOG_LEVEL while this returns true. */
  forceDebug?: () => boolean;
};

const LEVEL_RANK: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const RESERVED = new Set(['ts', 'level', 'component', 'msg']);

function env(name: string): string | undefined {
  return typeof process !== 'undefined' ? process.env?.[name] : undefined;
}

function thresholdRank(): number {
  const level = env('LOG_LEVEL')?.trim().toLowerCase();
  return level && level in LEVEL_RANK ? LEVEL_RANK[level as LogLevel] : LEVEL_RANK.info;
}

function isTty(): boolean {
  return typeof process !== 'undefined' && Boolean(process.stdout?.isTTY);
}

const MAX_CAUSE_DEPTH = 5;

function serializeError(err: Error, depth = 0): LogFields {
  const out: LogFields = { name: err.name, message: err.message, stack: err.stack };
  const code = (err as { code?: unknown }).code;
  if (code !== undefined) out.code = code;
  if (err.cause !== undefined && depth < MAX_CAUSE_DEPTH) {
    out.cause = err.cause instanceof Error ? serializeError(err.cause, depth + 1) : String(err.cause);
  }
  return out;
}

function normalize(value: unknown): unknown {
  return value instanceof Error ? serializeError(value) : value;
}

function formatPretty(record: LogFields): string {
  const { ts, level, component, msg, ...rest } = record;
  const time = String(ts).slice(11, 23);
  const extras = Object.entries(rest)
    .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join(' ');
  return `${time} ${String(level).toUpperCase().padEnd(5)} [${component}] ${msg}${extras ? ` ${extras}` : ''}`;
}

function emit(level: LogLevel, component: string, msg: string, fields?: LogFields): void {
  const record: LogFields = { ts: new Date().toISOString(), level, component, msg };
  if (fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || RESERVED.has(key)) continue;
      record[key] = normalize(value);
    }
  }

  let line: string;
  if (isTty()) {
    line = formatPretty(record);
  } else {
    try {
      line = JSON.stringify(record);
    } catch {
      line = JSON.stringify({ ts: record.ts, level, component, msg, logError: 'unserializable fields' });
    }
  }
  console.log(line);
}

/** JSON-lines logger on stdout (pretty single lines on a TTY); LOG_LEVEL sets the threshold. */
export function logger(component: string, options: LoggerOptions = {}): Logger {
  const at = (level: LogLevel) => (msg: string, fields?: LogFields) => {
    const enabled =
      LEVEL_RANK[level] >= thresholdRank() || (level === 'debug' && options.forceDebug?.() === true);
    if (enabled) emit(level, component, msg, fields);
  };
  return { debug: at('debug'), info: at('info'), warn: at('warn'), error: at('error') };
}
