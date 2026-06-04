// ============================================
// TypeScript Day 2 — Async Programming
// Run with: npx ts-node src/day2-async.ts
// ============================================

// --- 1. CALLBACKS (the old way) ---
// C++ analogy: like passing a function pointer — void fetchData(void (*callback)(Data))

function checkGpuTemp(gpuId: number, callback: (temp: number) => void): void {
  setTimeout(() => {
    const simulatedTemp = 65 + Math.floor(Math.random() * 25);
    callback(simulatedTemp);
  }, 100);
}

// --- 2. PROMISES ---
// C++ analogy: like std::future<T> / std::promise<T> — a value that will arrive later

interface GpuMetrics {
  gpuId: number;
  temperatureC: number;
  utilizationPct: number;
  memoryUsedMB: number;
}

function fetchGpuMetrics(gpuId: number): Promise<GpuMetrics> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (gpuId < 0) {
        reject(new Error(`Invalid GPU ID: ${gpuId}`));
        return;
      }
      resolve({
        gpuId,
        temperatureC: 65 + Math.floor(Math.random() * 25),
        utilizationPct: Math.floor(Math.random() * 100),
        memoryUsedMB: Math.floor(Math.random() * 81920),
      });
    }, 150);
  });
}

// .then() chaining — each .then returns a new Promise
function demoThenChaining(): Promise<void> {
  return fetchGpuMetrics(0)
    .then((m) => { console.log(`[.then] GPU ${m.gpuId}: ${m.temperatureC}°C`); return fetchGpuMetrics(1); })
    .then((m) => { console.log(`[.then] GPU ${m.gpuId}: ${m.temperatureC}°C`); });
}

// --- 3. ASYNC/AWAIT — the modern way ---
// C++ analogy: like co_await in C++20 coroutines. async fns return Promise, await unwraps it.

async function demoAsyncAwait(): Promise<void> {
  const gpu0 = await fetchGpuMetrics(0);
  console.log(`[await] GPU ${gpu0.gpuId}: ${gpu0.utilizationPct}% utilization`);

  const gpu1 = await fetchGpuMetrics(1);
  console.log(`[await] GPU ${gpu1.gpuId}: ${gpu1.utilizationPct}% utilization`);
}

// --- 4. ERROR HANDLING — try/catch with async ---
// C++ analogy: same try/catch you know, but it catches rejected Promises too

async function demoErrorHandling(): Promise<void> {
  try {
    const badMetrics = await fetchGpuMetrics(-1);
    console.log(badMetrics); // never reached
  } catch (error) {
    if (error instanceof Error) {
      console.log(`[error] Caught: ${error.message}`);
    }
  }
}

// --- 5. PROMISE.ALL — parallel execution ---
// C++ analogy: like launching multiple std::async tasks and waiting on all futures

async function demoPromiseAll(): Promise<void> {
  const gpuIds = [0, 1, 2, 3, 4, 5, 6, 7];

  console.log("[parallel] Fetching all 8 GPUs at once...");
  const allMetrics: GpuMetrics[] = await Promise.all(
    gpuIds.map((id) => fetchGpuMetrics(id))
  );

  console.log(`[parallel] Got ${allMetrics.length} results`);
  const avgTemp = allMetrics.reduce((sum, m) => sum + m.temperatureC, 0) / allMetrics.length;
  console.log(`[parallel] Avg temperature: ${avgTemp.toFixed(1)}°C`);
}

// --- 6. REAL API FETCH — hitting a live endpoint (Star Wars API, no auth needed) ---

interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
}

async function demoRealFetch(): Promise<void> {
  try {
    const response = await fetch("https://swapi.py4e.com/api/people/1/");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const person: SwapiPerson = await response.json();
    console.log(`[fetch] Name: ${person.name}`);
    console.log(`[fetch] Height: ${person.height}cm, Mass: ${person.mass}kg`);
    console.log(`[fetch] Born: ${person.birth_year}`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`[fetch] Failed: ${error.message}`);
    }
  }
}

// --- 7. SETTIMEOUT + PROMISE PATTERN — building block for simulating async work ---

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type NodeStatus = "healthy" | "degraded" | "unreachable";

async function pingNode(hostname: string): Promise<NodeStatus> {
  await sleep(50 + Math.floor(Math.random() * 100));
  const roll = Math.random();
  if (roll > 0.9) return "unreachable";
  if (roll > 0.7) return "degraded";
  return "healthy";
}

async function demoSimulatedPing(): Promise<void> {
  const nodes = ["gpu-node-01", "gpu-node-02", "gpu-node-03"];
  const results = await Promise.all(
    nodes.map(async (node) => {
      const status = await pingNode(node);
      return { node, status };
    })
  );
  for (const r of results) {
    console.log(`[ping] ${r.node}: ${r.status}`);
  }
}

// ============================================
// TRY EXERCISES
// ============================================

// TRY 1: Write a function `fetchGpuTemp(gpuId: number): Promise<number>`
// that returns a Promise resolving to a random temperature after 100ms.
// Use the `new Promise()` + `setTimeout` pattern from section 2.

// TRY 2: Write `getHottestGpu(gpuIds: number[]): Promise<GpuMetrics>` that fetches
// all GPUs in parallel with Promise.all, returns the one with highest temperature.
// Hint: use allMetrics.reduce() to find the max.

// TRY 3: Write `fetchWithRetry(gpuId: number, retries: number): Promise<GpuMetrics>`
// that calls fetchGpuMetrics and retries up to `retries` times on failure.
// Use a for loop + try/catch. Log each retry attempt.

// TRY 4: Fetch https://swapi.py4e.com/api/planets/1/ — create a SwapiPlanet interface
// with name, climate, terrain, population (all strings). Log the planet name and climate.

// TRY 5: Write `monitorFleet(rounds: number): Promise<void>` that runs
// demoSimulatedPing() in a loop `rounds` times, with 200ms sleep between.
// Log "Round X of Y" each time.

// ============================================
// MAIN — calls all examples (top-level await needs special config)
// ============================================

async function main(): Promise<void> {
  console.log("=== CALLBACKS ===");
  checkGpuTemp(0, (temp) => console.log(`[callback] GPU 0: ${temp}°C`));
  await sleep(200);

  console.log("\n=== .then() CHAINING ===");
  await demoThenChaining();

  console.log("\n=== ASYNC/AWAIT ===");
  await demoAsyncAwait();

  console.log("\n=== ERROR HANDLING ===");
  await demoErrorHandling();

  console.log("\n=== PROMISE.ALL (PARALLEL) ===");
  await demoPromiseAll();

  console.log("\n=== REAL API FETCH ===");
  await demoRealFetch();

  console.log("\n=== SIMULATED PING ===");
  await demoSimulatedPing();

  console.log("\n=== Done! Now fill in the TRY exercises. ===");
}

main();
