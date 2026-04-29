// filepath: price-worker.ts
const TIMER_INTERVAL = 10000;

let timerId: ReturnType<typeof setInterval> | null = null;
let lastPrice = 0;
let threshold = 70000;
// Track if we've notified - reset when price drops below threshold
let hasNotifiedAbove = false;

async function fetchPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await response.json();
    return data.bitcoin.usd;
  } catch (e) {
    console.error('Failed to fetch price:', e);
    return null;
  }
}

function checkThreshold(p: number) {
  const isAbove = p >= threshold;
  
  // Only notify on threshold crossing (below → above)
  if (isAbove && !hasNotifiedAbove) {
    self.postMessage({ type: 'notify', price: p });
    hasNotifiedAbove = true; // Mark as notified, don't notify again until below
  }
  // Reset when price drops below threshold
  if (!isAbove) {
    hasNotifiedAbove = false;
  }
  lastPrice = p;
}

async function update() {
  const p = await fetchPrice();
  // Only send update if price actually changed
  if (p !== null && p !== lastPrice) {
    self.postMessage({ type: 'price', price: p });
    checkThreshold(p);
  } else if (p !== null) {
    // Still send price for sync even if unchanged
    self.postMessage({ type: 'price', price: p });
  }
}

self.onmessage = (e) => {
  if (e.data.type === 'start') {
    threshold = e.data.threshold || 70000;
    // Initialize notification state based on current price
    update().then(() => {
      hasNotifiedAbove = lastPrice >= threshold;
    });
    timerId = setInterval(update, TIMER_INTERVAL);
  } else if (e.data.type === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  } else if (e.data.type === 'updateThreshold') {
    threshold = e.data.threshold;
    // Reset notification state when threshold changes
    hasNotifiedAbove = lastPrice >= threshold;
  }
};