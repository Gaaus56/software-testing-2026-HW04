// Địa chỉ các thành phần EShop. Có thể đổi bằng biến môi trường khi chạy.
import path from 'node:path';

export const WEB_URL = process.env.ESHOP_WEB_URL ?? 'http://localhost:5173';
export const ADMIN_URL = process.env.ESHOP_ADMIN_URL ?? 'http://localhost:5174';
export const API_URL = process.env.ESHOP_API_URL ?? 'http://localhost:3000/api';

// Thư mục backend của SUT (mặc định: HW02/eshop-sut/backend, nằm cạnh repo này)
export const BACKEND_DIR =
  process.env.ESHOP_BACKEND_DIR ?? path.resolve(__dirname, '..', '..', 'eshop-sut', 'backend');

export const STUDENT_ID = '23120017';
