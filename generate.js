import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { hwid } = req.query;
  if (!hwid) return res.status(400).json({ error: 'HWID required' });

  const filePath = path.join(process.cwd(), 'keys.json');
  const keys = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const existing = keys[hwid];
  if (existing && Date.now() < existing.expiry) {
    return res.status(200).json({ key: existing.key, expires: existing.expiry });
  }

  const key = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
  const expiry = Date.now() + 24 * 60 * 60 * 1000;

  keys[hwid] = { key, expiry };
  fs.writeFileSync(filePath, JSON.stringify(keys, null, 2));

  return res.status(200).json({ key, expires: expiry });
}
