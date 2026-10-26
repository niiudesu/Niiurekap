import { getStore } from "@netlify/blobs";

export const config = { path: "/api/orders" };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

// Gabungkan per order: versi dengan waktu ubah (u) terbaru yang menang
function merge(a, b) {
  const m = new Map();
  for (const o of [...a, ...b]) {
    if (!o || !o.id) continue;
    const p = m.get(o.id);
    if (!p || (o.u || 0) >= (p.u || 0)) m.set(o.id, o);
  }
  return [...m.values()];
}

export default async (req) => {
  const pass = process.env.APP_PASSWORD;
  if (!pass) return json({ error: "APP_PASSWORD belum diatur di Netlify" }, 500);
  if (req.headers.get("x-app-password") !== pass) return json({ error: "Password salah" }, 401);
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body = {};
  try { body = await req.json(); } catch {}
  const incoming = Array.isArray(body.orders) ? body.orders : [];

  const store = getStore("rekap-order");
  const current = (await store.get("orders", { type: "json" })) || [];
  const month = 30 * 864e5;
  const merged = merge(current, incoming).filter((o) => !(o.del && Date.now() - (o.u || 0) > month));

  if (incoming.length) await store.setJSON("orders", merged);
  return json({ orders: merged });
};
