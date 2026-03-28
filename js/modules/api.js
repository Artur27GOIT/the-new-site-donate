const API_URL = "https://sheetdb.io/api/v1/564kk8ptt07xm";

let cachedTickets = null;
let lastFetchTime = 0;

function throttle(ms) {
  const now = Date.now();
  if (now - lastFetchTime < ms) return false;
  lastFetchTime = now;
  return true;
}

export async function fetchTakenTickets() {
  if (!throttle(3000) && cachedTickets) return cachedTickets;

  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Fetch error");

  const data = await res.json();
  cachedTickets = data.flatMap((row) => row.Tickets.split(","));
  return cachedTickets;
}

export async function saveDonation(data) {
  const attempt = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Server error");
  };

  try {
    await attempt();
  } catch {
    await new Promise((r) => setTimeout(r, 1000));
    await attempt();
  }

  if (cachedTickets) {
    cachedTickets = [...cachedTickets, ...data.Tickets.split(",")];
  }
}

export function getTimestamp() {
  const now = new Date();
  const d = now.getDate().toString().padStart(2, "0");
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const y = now.getFullYear();
  const h = now.getHours().toString().padStart(2, "0");
  const min = now.getMinutes().toString().padStart(2, "0");
  return `${d}/${m}/${y} ${h}:${min}`;
}
