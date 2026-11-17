// Chuẩn bị dữ liệu và trạng thái cho test bằng Backend API (không dùng để kiểm kết quả UI).
import { execFileSync, spawn } from 'node:child_process';
import { API_URL, BACKEND_DIR } from './env';

export const ACCOUNTS = {
  user: { email: 'test@eshop.com', password: 'Test1234!' },
  admin: { email: 'admin@eshop.com', password: 'Admin123!' },
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function isUp(): Promise<boolean> {
  try {
    return (await fetch(`${API_URL}/products`)).ok;
  } catch {
    return false;
  }
}

/**
 * Khởi động lại backend EShop. Backend seed lại toàn bộ DB mỗi lần khởi động,
 * nên đây là cách đưa dữ liệu (bộ đếm đăng nhập sai, lượt dùng coupon, sản phẩm import) về ban đầu.
 * Chỉ tắt tiến trình `node server.js` đang giữ cổng 3000 (Windows).
 */
export async function resetBackend(): Promise<void> {
  try {
    execFileSync('powershell', ['-NoProfile', '-Command',
      "Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { $p = Get-CimInstance Win32_Process -Filter \"ProcessId=$($_.OwningProcess)\"; if ($p.CommandLine -like '*server.js*') { Stop-Process -Id $_.OwningProcess -Force } }"],
      { stdio: 'ignore' });
  } catch {
    // Không có backend nào đang chạy
  }
  for (let i = 0; i < 25 && (await isUp()); i++) await sleep(200);
  const child = spawn('node', ['server.js'], { cwd: BACKEND_DIR, detached: true, stdio: 'ignore', windowsHide: true });
  child.unref();
  for (let i = 0; i < 50; i++) {
    await sleep(200);
    if (await isUp()) return;
  }
  throw new Error('Backend EShop không khởi động được');
}

async function api(method: string, path: string, body?: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  // Thử lại khi kết nối keep-alive cũ bị đóng do backend vừa khởi động lại
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(API_URL + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
      const text = await res.text();
      let json: any = text;
      try { json = JSON.parse(text); } catch { /* giữ dạng chữ */ }
      return { status: res.status, body: json };
    } catch (e) {
      if (attempt >= 3) throw e;
      await sleep(300);
    }
  }
}

export async function apiLogin(acc: { email: string; password: string }): Promise<string> {
  const r = await api('POST', '/login', acc);
  if (r.status !== 200) throw new Error(`Đăng nhập API thất bại (${acc.email}): ${r.status}`);
  return r.body.token;
}

export interface Product { id: number; name: string; price: number | string; category_id: number }

export async function listProducts(): Promise<Product[]> {
  return (await api('GET', '/products')).body;
}

/** Tạo sản phẩm bằng API admin, trả về id. Dùng để có giỏ hàng với tổng tiền chính xác (FR-09). */
export async function createProduct(name: string, price: number, categoryId = 3): Promise<number> {
  const token = await apiLogin(ACCOUNTS.admin);
  const r = await api('POST', '/products', { name, price, description: 'SP test HW04', imageUrl: 'https://placehold.co/300', category_id: categoryId }, token);
  if (r.status >= 400) throw new Error(`Tạo sản phẩm lỗi: ${r.status}`);
  const found = (await listProducts()).find((p) => p.name === name);
  if (!found) throw new Error(`Không thấy sản phẩm vừa tạo: ${name}`);
  return found.id;
}

export interface CouponSpec {
  code: string;
  type: 'percent' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  expiredOffsetDays: number;
  max_uses_per_user: number;
}

/** Ngày (YYYY-MM-DD, giờ máy) cách hôm nay `offset` ngày */
export function dayFromToday(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('sv-SE');
}

/** Tạo coupon bằng API admin (chuẩn bị dữ liệu biên ngày cho FR-09) */
export async function createCoupon(c: CouponSpec): Promise<void> {
  const token = await apiLogin(ACCOUNTS.admin);
  const { expiredOffsetDays, ...rest } = c;
  const r = await api('POST', '/admin/coupons', { ...rest, expired_at: dayFromToday(expiredOffsetDays) }, token);
  if (r.status >= 400) throw new Error(`Tạo coupon lỗi: ${r.status}`);
}
