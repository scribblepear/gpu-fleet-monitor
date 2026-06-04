// fleet-service.ts — A service class that ties types + utils together
//
// Shows: importing from multiple modules, exporting a class, async methods

import type { Machine } from "./types.js";
import { getHotGPUs, calculateAverageUtil, generateAlerts } from "./gpu-utils.js";

// Re-export everything from types so day2-modules.ts can import from one place
export type { Machine, GPU, MachineStatus, Alert } from "./types.js";

export class FleetService {
  private machines: Machine[];

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  async fetchFleetSnapshot(): Promise<Machine[]> {
    // Simulate network delay — in real code this would hit an API
    await new Promise((resolve) => setTimeout(resolve, 100));
    return this.machines;
  }

  getFleetSummary(): string {
    const totalGPUs = this.machines.flatMap((m) => m.gpus);
    const hotGPUs = getHotGPUs(totalGPUs);
    const avgUtil = calculateAverageUtil(totalGPUs);
    const alerts = this.machines.flatMap((m) =>
      generateAlerts(m.hostname, m.gpus)
    );

    return [
      `Fleet: ${this.machines.length} machines, ${totalGPUs.length} GPUs`,
      `Average utilization: ${avgUtil}%`,
      `Hot GPUs (>80°C): ${hotGPUs.length}`,
      `Active alerts: ${alerts.length}`,
    ].join("\n");
  }
}
