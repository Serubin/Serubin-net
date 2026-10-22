import { monitorEventLoopDelay, type IntervalHistogram } from 'perf_hooks';

type Labels = Record<string, string>;
type MetricType = 'counter' | 'gauge' | 'histogram';

interface Metric {
  readonly name: string;
  readonly type: MetricType;
  render(): string[];
}

export interface Counter extends Metric {
  inc(labels?: Labels, value?: number): void;
}

export interface Gauge extends Metric {
  set(labels: Labels | undefined, value: number): void;
}

export interface Histogram extends Metric {
  observe(labels: Labels | undefined, value: number): void;
}

type Registry = {
  metrics: Map<string, Metric>;
  eventLoop?: IntervalHistogram;
};

// Keyed on globalThis because server.ts (via tsx) and Next's bundles load separate copies of this module.
const REGISTRY_KEY = Symbol.for('serubin.metrics.v1');

function registry(): Registry {
  const g = globalThis as unknown as Record<symbol, Registry | undefined>;
  return (g[REGISTRY_KEY] ??= { metrics: new Map() });
}

export const DURATION_BUCKETS_SECONDS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];

function escapeLabelValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/"/g, '\\"');
}

function escapeHelp(help: string): string {
  return help.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
}

function formatNumber(value: number): string {
  if (Number.isNaN(value)) return 'NaN';
  if (value === Infinity) return '+Inf';
  if (value === -Infinity) return '-Inf';
  return String(value);
}

function formatLabels(labelNames: string[], labels: Labels, extra?: [string, string]): string {
  const pairs = labelNames.map((n) => `${n}="${escapeLabelValue(labels[n] ?? '')}"`);
  if (extra) pairs.push(`${extra[0]}="${escapeLabelValue(extra[1])}"`);
  return pairs.length > 0 ? `{${pairs.join(',')}}` : '';
}

function seriesKey(labelNames: string[], labels: Labels | undefined): string {
  return labelNames.map((n) => labels?.[n] ?? '').join('\u0000');
}

function header(name: string, help: string, type: MetricType): string[] {
  return [`# HELP ${name} ${escapeHelp(help)}`, `# TYPE ${name} ${type}`];
}

function getOrCreate<T extends Metric>(name: string, type: MetricType, create: () => T): T {
  const metrics = registry().metrics;
  const existing = metrics.get(name);
  if (existing) {
    if (existing.type !== type) {
      throw new Error(`metric ${name} already registered as ${existing.type}`);
    }
    return existing as T;
  }
  const metric = create();
  metrics.set(name, metric);
  return metric;
}

function scalarMetric(name: string, help: string, type: 'counter' | 'gauge', labelNames: string[]) {
  const series = new Map<string, { labels: Labels; value: number }>();
  const entry = (labels: Labels | undefined) => {
    const key = seriesKey(labelNames, labels);
    let s = series.get(key);
    if (!s) {
      s = { labels: { ...labels }, value: 0 };
      series.set(key, s);
    }
    return s;
  };
  return {
    name,
    type,
    entry,
    render: () => [
      ...header(name, help, type),
      ...Array.from(series.values(), (s) => `${name}${formatLabels(labelNames, s.labels)} ${formatNumber(s.value)}`),
    ],
  };
}

export function counter(name: string, help: string, labelNames: string[] = []): Counter {
  return getOrCreate(name, 'counter', () => {
    const m = scalarMetric(name, help, 'counter', labelNames);
    return {
      name,
      type: 'counter' as const,
      render: m.render,
      inc: (labels?: Labels, value = 1) => {
        m.entry(labels).value += value;
      },
    };
  });
}

export function gauge(name: string, help: string, labelNames: string[] = []): Gauge {
  return getOrCreate(name, 'gauge', () => {
    const m = scalarMetric(name, help, 'gauge', labelNames);
    return {
      name,
      type: 'gauge' as const,
      render: m.render,
      set: (labels: Labels | undefined, value: number) => {
        m.entry(labels).value = value;
      },
    };
  });
}

export function histogram(
  name: string,
  help: string,
  labelNames: string[] = [],
  buckets: number[] = DURATION_BUCKETS_SECONDS
): Histogram {
  return getOrCreate(name, 'histogram', () => {
    const bounds = [...buckets].sort((a, b) => a - b);
    const series = new Map<string, { labels: Labels; counts: number[]; sum: number; count: number }>();
    return {
      name,
      type: 'histogram' as const,
      observe: (labels: Labels | undefined, value: number) => {
        const key = seriesKey(labelNames, labels);
        const s = series.get(key) ?? { labels: { ...labels }, counts: bounds.map(() => 0), sum: 0, count: 0 };
        series.set(key, s);
        bounds.forEach((le, i) => {
          if (value <= le) s.counts[i] += 1;
        });
        s.sum += value;
        s.count += 1;
      },
      render: () => {
        const lines = header(name, help, 'histogram');
        series.forEach((s) => {
          bounds.forEach((le, i) => {
            lines.push(`${name}_bucket${formatLabels(labelNames, s.labels, ['le', formatNumber(le)])} ${s.counts[i]}`);
          });
          lines.push(`${name}_bucket${formatLabels(labelNames, s.labels, ['le', '+Inf'])} ${s.count}`);
          lines.push(`${name}_sum${formatLabels(labelNames, s.labels)} ${formatNumber(s.sum)}`);
          lines.push(`${name}_count${formatLabels(labelNames, s.labels)} ${s.count}`);
        });
        return lines;
      },
    };
  });
}

const EVENT_LOOP_RESOLUTION_MS = 10;

function renderProcessMetrics(): string[] {
  const reg = registry();
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();
  const lines = [
    ...header('process_resident_memory_bytes', 'Resident set size in bytes.', 'gauge'),
    `process_resident_memory_bytes ${mem.rss}`,
    ...header('nodejs_heap_used_bytes', 'V8 heap used in bytes.', 'gauge'),
    `nodejs_heap_used_bytes ${mem.heapUsed}`,
    ...header('nodejs_heap_total_bytes', 'V8 heap allocated in bytes.', 'gauge'),
    `nodejs_heap_total_bytes ${mem.heapTotal}`,
    ...header('process_cpu_seconds_total', 'User and system CPU time in seconds.', 'counter'),
    `process_cpu_seconds_total ${formatNumber((cpu.user + cpu.system) / 1e6)}`,
    ...header('process_start_time_seconds', 'Process start time since the Unix epoch in seconds.', 'gauge'),
    `process_start_time_seconds ${formatNumber(Math.round(Date.now() / 1000 - process.uptime()))}`,
  ];

  // Started on the first scrape and reset after each, so quantiles cover one scrape interval.
  if (!reg.eventLoop) {
    reg.eventLoop = monitorEventLoopDelay({ resolution: EVENT_LOOP_RESOLUTION_MS });
    reg.eventLoop.enable();
  }
  const loop = reg.eventLoop;
  // Samples are whole timer intervals, so the sampling resolution itself is not lag.
  const lagSeconds = (ns: number) => Math.max(0, ns / 1e6 - EVENT_LOOP_RESOLUTION_MS) / 1000;
  lines.push(...header('nodejs_eventloop_lag_seconds', 'Event loop delay since the previous scrape.', 'gauge'));
  if (loop.count > 0) {
    for (const q of [0.5, 0.9, 0.99]) {
      lines.push(`nodejs_eventloop_lag_seconds{quantile="${q}"} ${formatNumber(lagSeconds(loop.percentile(q * 100)))}`);
    }
    lines.push(`nodejs_eventloop_lag_seconds{quantile="1"} ${formatNumber(lagSeconds(loop.max))}`);
  }
  loop.reset();
  return lines;
}

/** Prometheus text exposition format 0.0.4. */
export const METRICS_CONTENT_TYPE = 'text/plain; version=0.0.4; charset=utf-8';

export function renderMetrics(): string {
  const lines = renderProcessMetrics();
  registry().metrics.forEach((metric) => {
    lines.push(...metric.render());
  });
  return `${lines.join('\n')}\n`;
}
