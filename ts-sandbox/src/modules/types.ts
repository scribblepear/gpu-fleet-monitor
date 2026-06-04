// types.ts — Shared type definitions for the GPU fleet monitor
//
// C++ analogy: This is like a header file (.h), but with key differences:
//   - No #pragma once or include guards needed — each module is loaded once automatically
//   - No forward declarations — TypeScript resolves dependencies for you
//   - You explicitly choose what to export (everything else is module-private)
//
// Named exports (what we use here):
//   export interface Foo { ... }   — consumers import with: import { Foo } from "./types.js"
//
// Default exports (we avoid these — harder to refactor, no auto-import):
//   export default class Foo { }   — consumer: import Foo from "./types.js"
//   The name isn't enforced, so someone could import it as `import Banana from "./types.js"`

export type MachineStatus = "online" | "offline" | "degraded" | "maintenance";

export interface GPU {
  id: string;
  model: string;
  tempCelsius: number;
  utilizationPercent: number;
  memoryUsedGB: number;
  memoryTotalGB: number;
}

export interface Machine {
  hostname: string;
  status: MachineStatus;
  gpus: GPU[];
  lastHeartbeat: Date;
}

export interface Alert {
  machineHostname: string;
  gpuId: string;
  message: string;
  severity: "warning" | "critical";
  timestamp: Date;
}
