// gpu-utils.ts — Utility functions for GPU data
//
// Import patterns demonstrated:
//   import type { X }  — type-only import, erased at runtime (like C++ "using" in a header)
//   import { X }       — value import, exists at runtime
//   export { X }       — re-export: lets consumers import X from this file instead of the original

// "import type" tells TypeScript (and bundlers) these are compile-time only
import type { GPU, Alert } from "./types.js";

// Re-export types so consumers can get everything from one place
// This is the "barrel export" pattern — like a convenience header in C++
export type { GPU, Alert } from "./types.js";

export function getHotGPUs(gpus: GPU[], thresholdCelsius: number = 80): GPU[] {
  return gpus.filter((gpu) => gpu.tempCelsius > thresholdCelsius);
}

export function calculateAverageUtil(gpus: GPU[]): number {
  if (gpus.length === 0) return 0;
  const total = gpus.reduce((sum, gpu) => sum + gpu.utilizationPercent, 0);
  return Math.round(total / gpus.length);
}

export function formatGPUStatus(gpu: GPU): string {
  const tempWarning = gpu.tempCelsius > 85 ? " ⚠️ HOT" : "";
  return (
    `[${gpu.id}] ${gpu.model} — ` +
    `${gpu.utilizationPercent}% util, ${gpu.tempCelsius}°C${tempWarning}, ` +
    `${gpu.memoryUsedGB}/${gpu.memoryTotalGB} GB VRAM`
  );
}

export function generateAlerts(hostname: string, gpus: GPU[]): Alert[] {
  return gpus
    .filter((gpu) => gpu.tempCelsius > 85 || gpu.utilizationPercent > 95)
    .map((gpu) => ({
      machineHostname: hostname,
      gpuId: gpu.id,
      message:
        gpu.tempCelsius > 85
          ? `GPU temp critical: ${gpu.tempCelsius}°C`
          : `GPU utilization saturated: ${gpu.utilizationPercent}%`,
      severity: gpu.tempCelsius > 90 ? "critical" as const : "warning" as const,
      timestamp: new Date(),
    }));
}
