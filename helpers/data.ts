// Đọc file dữ liệu test (data/*.json). Mỗi phần tử: id, input, expected, note.
import fs from 'node:fs';
import path from 'node:path';

export const DATA_DIR = path.resolve(__dirname, '..', 'data');

export interface TestCase<I = Record<string, any>, E = Record<string, any>> {
  id: string;
  input: I;
  expected: E;
  note: string;
}

export function loadCases<I = Record<string, any>, E = Record<string, any>>(file: string): TestCase<I, E>[] {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
}

export const dataPath = (relative: string) => path.join(DATA_DIR, relative);
