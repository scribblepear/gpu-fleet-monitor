// ============================================
// TypeScript Day 1 Practice
// Run with: npx ts-node src/practice.ts
// ============================================

// --- 1. BASIC TYPES ---
// C++ analogy: like declaring int x = 5; but the type system is structural, not nominal

const hostname: string = "gpu-node-04";
const gpuCount: number = 8;
const isOnline: boolean = true;

// self note: this is like writing const string hostname = "..."; but in TS you just have to switch the order of the var name with the datatype, include the : as well as what you are setting it to be. TS also supports implicit type setting

// arrays (like std::vector<int>)
const temperatures: number[] = [65, 72, 68, 71, 70, 69, 73, 67];

// TRY: declare a 
// variable `datacenter` of type string, set it to "las-vegas-1"

const datacenter: string = "las-vegas-1";

// self note: this is essentially like writing -- const string datacenter = "las-vegas-1";


// --- 2. INTERFACES ---
// C++ analogy: like a struct, but only describes shape (no memory layout)

interface GPU {
  index: number;
  model: string;
  utilizationPct: number;
  temperatureC: number;
  memoryUsedMB: number;
  memoryTotalMB: number;
  powerDrawW: number;
}

const gpu0: GPU = {
  index: 0,
  model: "MI300X",
  utilizationPct: 87,
  temperatureC: 72,
  memoryUsedMB: 98304,
  memoryTotalMB: 196608,
  powerDrawW: 550,
};

// self note: same thing as a stuct and making member vars within it no need for const or let tho. you can also just use comments for setting the created objects member vars no need for ';'

console.log(`GPU ${gpu0.index}: ${gpu0.model} at ${gpu0.utilizationPct}% util`);

// self note: this is same thing as cout << GPU << gpu0.index

// TRY: create a Machine interface with hostname, ipAddress, gpus (GPU array), status
interface Machine {

  hostname: string;
  ipAddress: string;
  gpus: GPU[];
  status: string;

}


// --- 3. UNION TYPES ---
// C++ analogy: like std::variant<string, string, string> but for literal values

type MachineStatus = "online" | "degraded" | "offline";
type AlertSeverity = "warning" | "critical";

let status: MachineStatus = "online";
// status = "broken"; // uncomment to see the error — TS catches invalid values at compile time

// TRY: create a type MetricType that can be "temperature" | "utilization" | "memory"

type MetricType = "temperature" | "utilization" | "memory";

// --- 4. ENUMS ---
// C++ analogy: basically the same as enum class

enum Datacenter {
  LasVegas = "las-vegas-1",
  Phoenix = "phoenix-1",
  Dallas = "dallas-1",
}

console.log(`Datacenter: ${Datacenter.LasVegas}`);

// TRY: create an enum for GPU models (MI300X, MI250X, MI210)

enum GPUmodels {

  MI300X = "mi-300-x",
  MI250X = "mi-250-x",
  MI210 = "mi-210"

}


// --- 5. TYPE NARROWING ---
// C++ analogy: like dynamic_cast checks but at the type level, no runtime cost

function describeValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase(); // TS knows it's a string here
  }
  return value.toFixed(2); // TS knows it's a number here
}

console.log(describeValue("hello"));
console.log(describeValue(3.14159));

// narrowing with `in` keyword — checking if a property exists
interface OnlineGPU {
  status: "online";
  utilization: number;
}

interface OfflineGPU {
  status: "offline";
  lastSeen: Date;
}

type GPUState = OnlineGPU | OfflineGPU;

function describeGPU(gpu: GPUState): string {
  if (gpu.status === "online") {
    return `Running at ${gpu.utilization}%`; // TS narrows to OnlineGPU
  }
  return `Offline since ${gpu.lastSeen}`; // TS narrows to OfflineGPU
}

// TRY: write a function that takes (value: string | number | boolean) and returns
// different strings for each type using typeof narrowing

function describeVal(value: string | number | boolean): string {

  if (typeof value === "string") { 
    return value;
  }
  else if (typeof value === "number") {
    return value.toFixed(2);
  }
  else if (typeof value === "boolean") {
    return "false";
  }
  return "hello";

}

// self note: ok so when writing a function with narrow tryping and using "typeof" you need to set it to the actual named datatype in quotations 
// you also need to end the function with "else" or with a "return" statement of the return datatype otherwise TS freaks out
// if you don't want to specify what it needs to return you can just use "unspecified" as the DT

// --- 6. GENERICS ---
// C++ analogy: like templates — std::vector<T> → Array<T>

//essentially you have a function named firstElement that is templated/generic via the <T> keyword next to func name. then the parameter you are passing in is an array 
//that arrary is also templated/generic datatype and then you return either a generic datatype or any because it's generic so you can pass and return anything
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstTemp = firstElement(temperatures); // TS infers number
// self note: this temperatures array is the var name and you can just pass that array and TS will infer it's a number just from that
const firstHost = firstElement(["node-01", 
  "node-02"]); // TS infers string
// 

console.log(`First temp: ${firstTemp}, First host: ${firstHost}`);

// generic interface — like a templated struct
interface ApiResponse<T> {
  data: T;
  error: string | null;
  timestamp: Date;
}

const gpuResponse: ApiResponse<GPU> = {
  data: gpu0,
  error: null,
  timestamp: new Date(),
};

console.log(`Response for GPU: ${gpuResponse.data.model}`);

// TRY: write a generic function `last<T>(arr: T[]): T | undefined` that returns
// the last element of an array


function last<T>(arr: T[]): T | undefined {

  return arr.at(-1);

}

// --- 7. OPTIONAL PROPERTIES + OPTIONAL CHAINING ---
// C++ analogy: like std::optional<T>

interface Alert {
  machineId: string;
  gpuIndex: number;
  severity: AlertSeverity;
  message: string;
  acknowledgedBy?: string; // optional — might not exist
}

const alert: Alert = {
  machineId: "abc123",
  gpuIndex: 2,
  severity: "critical",
  message: "Temperature exceeded 90C",
};

// optional chaining — safe access (like checking nullptr before dereferencing)
console.log(`Acknowledged by: ${alert.acknowledgedBy?.toUpperCase() ?? "nobody"}`);

// nullish coalescing — ?? only falls back on null/undefined (not 0, "", false)
const utilization = 0;
console.log(utilization ?? "no data"); // prints 0 (correct)
console.log(utilization || "no data"); // prints "no data" (WRONG — 0 is falsy)


// ============================================
// You're done with Day 1 basics!
// Fill in the TRY sections, then run:
//   npx ts-node src/practice.ts
// ============================================
