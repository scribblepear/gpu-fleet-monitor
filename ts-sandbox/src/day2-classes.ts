// ============================================
// TypeScript Day 2 — Classes
// Run with: npx ts-node src/day2-classes.ts
// ============================================

// --- 1. BASIC CLASS WITH CONSTRUCTOR ---
// C++ analogy: class with constructor initializer list
//   class GPUNode { string id; GPUNode(string id) : id(id) {} };
class GPUNode {
  id: string;
  model: string;
  vramMB: number;
  temperatureC: number;
  constructor(id: string, model: string, vramMB: number) {
    this.id = id;
    this.model = model;
    this.vramMB = vramMB;
    this.temperatureC = 40;
  }
}
const node1 = new GPUNode("gpu-001", "MI300X", 196608);
console.log(`${node1.id}: ${node1.model}, ${node1.vramMB}MB VRAM`);

// --- 2. ACCESS MODIFIERS ---
// C++ analogy: same keywords — public, private, protected. Same rules.
class AlertManager {
  public alertCount: number;
  private apiKey: string;
  protected maxAlerts: number;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.alertCount = 0;
    this.maxAlerts = 1000;
  }
  public sendAlert(message: string): void {
    console.log(`[key:${this.apiKey.slice(0, 4)}...] ALERT: ${message}`);
    this.alertCount++;
  }
}
const alertMgr = new AlertManager("sk-abc123xyz");
alertMgr.sendAlert("GPU temperature critical");
// alertMgr.apiKey;  // uncomment — private, can't access outside class

// --- 3. CONSTRUCTOR SHORTHAND ---
// No C++ equivalent — TS sugar. Access modifier in constructor params auto-creates
// and assigns the property. Eliminates the this.x = x boilerplate.
class DataCenter {
  constructor(
    public name: string,
    public region: string,
    private internalId: number,
    public gpuCount: number = 0,
  ) {} // no body needed — properties are created automatically
}
const dc = new DataCenter("las-vegas-1", "us-west", 42, 256);
console.log(`${dc.name} (${dc.region}): ${dc.gpuCount} GPUs`);

// TRY: create a class PowerSupply using constructor shorthand with:
//   public wattage (number), public efficiency (string), private serialNumber (string)
//   Instantiate one and log its wattage.


class PowerSupply {
  constructor(
    public wattage: number,
    public efficiency: string,
    private serialNumber: string,

  ) {}
}

const p1 = new PowerSupply(900, "sucks", "hello");

// self note: essentially constructor is able to init member's of the class without having to write it twice
// but you need to do dynamic new type where you set the object you want to instantiate it to use constructor. 

const pS = new PowerSupply(200, "low", "MI455X");

console.log(`wattage is ${pS.wattage}`);

// self note: you can create objects without the necessary raw pointer typing
// you can just create the object in dynamic array by calling constructor

// --- 4. METHODS ---
// C++ analogy: member functions. Return type goes after params with a colon.
class GPUMetrics {
  constructor(
    public nodeId: string,
    private temps: number[] = [],
  ) {}
  recordTemp(tempC: number): void { this.temps.push(tempC); }
  averageTemp(): number {
    if (this.temps.length === 0) return 0;
    return this.temps.reduce((a, b) => a + b, 0) / this.temps.length;
  }
  summary(): string {
    return `${this.nodeId}: avg ${this.averageTemp().toFixed(1)}C over ${this.temps.length} readings`;
  }
  peakTemp(): number {
    return Math.max(...this.temps);

  }
}
const metrics = new GPUMetrics("gpu-007");
metrics.recordTemp(65);
metrics.recordTemp(72);
metrics.recordTemp(68);
console.log(metrics.summary());

// TRY: add a method `peakTemp(): number` to GPUMetrics that returns the highest
//   recorded temperature (use Math.max(...this.temps)). Call it and log the result.
metrics.peakTemp();

// --- 5. INHERITANCE WITH extends ---
// C++ analogy: class GPUFleetNode : public FleetNode { ... };
//   super() = calling the base constructor
class FleetNode {
  constructor(
    public hostname: string,
    public ipAddress: string,
    public status: "online" | "offline" = "online",
  ) {}
  describe(): string {
    return `${this.hostname} (${this.ipAddress}) — ${this.status}`;
  }
}
class GPUFleetNode extends FleetNode {
  constructor(
    hostname: string,
    ipAddress: string,
    public gpuCount: number,
    public gpuModel: string,
  ) {
    super(hostname, ipAddress); // must call super() first, like C++
  }
  describe(): string {
    return `${super.describe()} | ${this.gpuCount}x ${this.gpuModel}`;
  }
}
const gpuNode = new GPUFleetNode("rack14-node03", "10.0.14.3", 8, "MI300X");
console.log(gpuNode.describe());

// TRY: create a StorageNode extending FleetNode. Add diskTB (number),
//   override describe() to include disk info. Instantiate and log describe().

class StorageNode extends FleetNode {

  constructor(

    hostname: string,
    ipAddress: string,
    public diskTb: number,

  ) {
    super(hostname, ipAddress);
  }
  descrive(): string {
    return  `${super.describe()} | ${this.diskTb}`;
  }
}

// --- 6. IMPLEMENTING INTERFACES ---
// C++ analogy: like inheriting from a pure virtual (abstract) base class
//   class CoolingUnit : public IMonitorable { void healthCheck() override {} };
interface Monitorable {
  healthCheck(): string;
  getMetrics(): Record<string, number>;
}
class CoolingUnit implements Monitorable {
  constructor(
    public unitId: string,
    private fanSpeedRPM: number,
    private coolantTempC: number,
  ) {}
  healthCheck(): string {
    if (this.coolantTempC > 60) return "WARNING: coolant temp high";
    if (this.fanSpeedRPM < 500) return "WARNING: fan speed low";
    return "OK";
  }
  getMetrics(): Record<string, number> {
    return { fanSpeedRPM: this.fanSpeedRPM, coolantTempC: this.coolantTempC };
  }
}
const cooler = new CoolingUnit("cool-rack14", 2400, 38);
console.log(`Cooling: ${cooler.healthCheck()}`);

// TRY: create a class NetworkSwitch that implements Monitorable.
//   Constructor shorthand: public switchId, portCount, packetsDropped.
//   healthCheck: "WARNING" if packetsDropped > 100, else "OK".
//   getMetrics: return { portCount, packetsDropped }.

// --- 7. STATIC METHODS AND PROPERTIES ---
// C++ analogy: same — FleetRegistry::totalNodes not registry.totalNodes
class FleetRegistry {
  static totalNodes: number = 0;
  static nodeIds: string[] = [];
  static register(nodeId: string): void {
    FleetRegistry.nodeIds.push(nodeId);
    FleetRegistry.totalNodes++;
  }
  static summary(): string {
    return `Fleet: ${FleetRegistry.totalNodes} nodes registered`;
  }
}
FleetRegistry.register("gpu-001");
FleetRegistry.register("gpu-002");
FleetRegistry.register("gpu-003");
console.log(FleetRegistry.summary());

// --- 8. GETTERS AND SETTERS ---
// C++ analogy: like getX()/setX() but called as properties — syntactic sugar.
//   card.powerDrawW = 500   calls the setter (validates)
//   card.powerDrawW          calls the getter
class GPUCard {
  private _powerDrawW: number = 0;
  constructor(public model: string, public maxPowerW: number) {}

  get powerDrawW(): number { return this._powerDrawW; }
  set powerDrawW(watts: number) {
    if (watts < 0) throw new Error("Power draw cannot be negative");
    if (watts > this.maxPowerW) throw new Error(`Exceeds max: ${this.maxPowerW}W`);
    this._powerDrawW = watts;
  }
  // read-only computed property — getter with no setter
  get powerUtilization(): string {
    return `${((this._powerDrawW / this.maxPowerW) * 100).toFixed(1)}%`;
  }
}
const card = new GPUCard("MI300X", 750);
card.powerDrawW = 550;
console.log(`Power: ${card.powerDrawW}W (${card.powerUtilization} of max)`);

// TRY: set card.powerDrawW = -10 or 9999. Wrap in try/catch, log the error message.

// ============================================
// Done with Day 2! Fill in TRY sections, then:
//   npx ts-node src/day2-classes.ts
// ============================================
