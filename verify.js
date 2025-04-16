import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { hwid, key } = req.query;
  if (!hwid || !key) return res.status(400).json({ valid: false });

  const filePath = path.join(process.cwd(), 'keys.json');
  const keys = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const data = keys[hwid];
  if (!data) return res.status(200).json({ valid: false });

  const valid = data.key === key && Date.now() < data.expiry;
  return res.status(200).json({ valid });
}
