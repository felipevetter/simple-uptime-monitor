export default {
  async fetch(request, env, ctx) {
    return await handleCron(env);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleCron(env));
  }
};

async function handleCron(env) {
  const API_BASE = env.API_BASE; 
  const WORKER_SECRET = env.WORKER_SECRET;
  const startTotal = performance.now();
  console.log("[Worker] Starting check cycle...");

  try {
    const targetsResponse = await fetch(`${API_BASE}/api/worker/targets`, {
      headers: { 'Authorization': `Bearer ${WORKER_SECRET}` }
    });

    if (!targetsResponse.ok) {
      throw new Error(`Failed to fetch targets: ${targetsResponse.statusText}`);
    }

    const targets = await targetsResponse.json();
    console.log(`[Worker] Found ${targets.length} monitors active.`);

    if (targets.length === 0) return new Response("No targets", { status: 200 });

    const results = [];
    
    const checks = targets.map(async (target) => {
      const start = performance.now();
      try {
        const res = await fetch(target.url, {
          method: 'GET',
          redirect: 'follow',
          headers: { 'User-Agent': 'SimpleUptime/1.0' }
        });
        
        const latency = Math.round(performance.now() - start);
        
        return {
          monitorId: target.id,
          status: res.status,
          latency: latency
        };
      } catch (err) {
        console.error(`Error checking ${target.url}:`, err);
        return {
          monitorId: target.id,
          status: 0,
          latency: 0
        };
      }
    });

    const checkResults = await Promise.all(checks);

    const postResponse = await fetch(`${API_BASE}/api/worker/results`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WORKER_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkResults)
    });

    if (!postResponse.ok) {
      throw new Error(`Failed to save results: ${postResponse.statusText}`);
    }

    console.log(`[Worker] Cycle finished in ${Math.round(performance.now() - startTotal)}ms`);
    return new Response(`Checked ${targets.length} monitors.`, { status: 200 });

  } catch (error) {
    console.error("[Worker] Critical Error:", error);
    return new Response(error.message, { status: 500 });
  }
}