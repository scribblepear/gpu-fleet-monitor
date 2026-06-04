// day2-modules.ts — TypeScript Modules & Imports
// Run: npx tsx src/day2-modules.ts
//
// === MODULE SYSTEM OVERVIEW ===
//
// TypeScript uses ES modules. If you're coming from C++, here's the mental model:
//
//   C++ #include "gpu.h"          →  import { GPU } from "./types.js"
//   C++ namespace gpu { ... }     →  Each file IS its own namespace (module)
//   C++ #pragma once              →  Not needed — modules are loaded exactly once
//   C++ forward declarations      →  Not needed — TS resolves the dependency graph
//   C++ header + implementation   →  Not needed — one .ts file does both
//
// Export flavors:
//   export const X = ...          Named export (preferred — explicit, refactor-friendly)
//   export function foo() { }     Named export
//   export interface Bar { }      Named export (type-only, erased at runtime)
//   export default class { }      Default export (avoid — name not enforced)
//
// Import flavors:
//   import { X, Y } from "..."    Named imports (destructuring syntax)
//   import type { X } from "..."  Type-only import (erased at runtime)
//   import * as mod from "..."    Namespace import (like C++ namespace alias)
//
// Barrel exports:
//   An index.ts that re-exports from multiple files, so consumers do:
//     import { GPU, FleetService } from "./modules/index.js"
//   instead of importing from each file individually.

import type { Machine, GPU } from "./modules/fleet-service.js";
import { FleetService } from "./modules/fleet-service.js";
import { formatGPUStatus, getHotGPUs } from "./modules/gpu-utils.js";

// --- Sample data ---
const sampleGPUs: GPU[] = [
  { id: "gpu-0", model: "A100", tempCelsius: 72, utilizationPercent: 88, memoryUsedGB: 32, memoryTotalGB: 80 },
  { id: "gpu-1", model: "A100", tempCelsius: 91, utilizationPercent: 97, memoryUsedGB: 76, memoryTotalGB: 80 },
  { id: "gpu-2", model: "H100", tempCelsius: 65, utilizationPercent: 45, memoryUsedGB: 20, memoryTotalGB: 80 },
  { id: "gpu-3", model: "H100", tempCelsius: 83, utilizationPercent: 99, memoryUsedGB: 78, memoryTotalGB: 80 },
];

const machines: Machine[] = [
  { hostname: "node-01", status: "online",   gpus: [sampleGPUs[0]!, sampleGPUs[1]!], lastHeartbeat: new Date() },
  { hostname: "node-02", status: "degraded", gpus: [sampleGPUs[2]!, sampleGPUs[3]!], lastHeartbeat: new Date() },
];

// --- Using the imported modules ---

console.log("=== GPU Status (using formatGPUStatus from gpu-utils) ===");
for (const gpu of sampleGPUs) {
  console.log(formatGPUStatus(gpu));
}

console.log("\n=== Hot GPUs (using getHotGPUs from gpu-utils) ===");
const hotOnes = getHotGPUs(sampleGPUs);
for (const gpu of hotOnes) {
  console.log(`  ${gpu.id}: ${gpu.tempCelsius}°C`);
}

console.log("\n=== Fleet Summary (using FleetService class) ===");
const fleet = new FleetService(machines);
console.log(fleet.getFleetSummary());

console.log("\n=== Async fetch (FleetService.fetchFleetSnapshot) ===");
fleet.fetchFleetSnapshot().then((snapshot) => {
  console.log(`Fetched ${snapshot.length} machines from fleet API`);
  for (const m of snapshot) {
    console.log(`  ${m.hostname}: ${m.status}, ${m.gpus.length} GPUs`);
  }
});

// ============================================================
// TRY IT: Exercises
// ============================================================
//
// 1. Create a new module: src/modules/alert-formatter.ts
//    - Export a function formatAlert(alert: Alert): string
//    - Import it here and use it with generateAlerts output
//
// 2. Add a function to gpu-utils.ts: getUnderutilizedGPUs(gpus, threshold)
//    - Returns GPUs with utilization below the threshold
//    - Import and call it here to find idle GPUs
//
// 3. Create a barrel file: src/modules/index.ts
//    - Re-export everything from types.ts, gpu-utils.ts, fleet-service.ts
//    - Change the imports at the top of this file to use "./modules/index.js"
