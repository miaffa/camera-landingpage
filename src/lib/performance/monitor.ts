"use client";

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetric>();

  start(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: Date.now()
    });
  }

  end(name: string): number {
    const metric = this.metrics.get(name);
    if (!metric) return 0;

    const endTime = Date.now();
    const duration = endTime - metric.startTime;
    
    metric.endTime = endTime;
    metric.duration = duration;

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${duration}ms`);
    }

    return duration;
  }

  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name);
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
