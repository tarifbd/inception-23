import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

function key() {
  const value = process.env.TRACKING_ENCRYPTION_KEY || '';
  if (!/^[a-f0-9]{64}$/i.test(value)) throw new Error('Set TRACKING_ENCRYPTION_KEY to 32 random bytes encoded as 64 hex characters.');
  return Buffer.from(value, 'hex');
}
export function seal(value: string) {
  if (!value) return '';
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return ['enc1', iv.toString('base64'), cipher.getAuthTag().toString('base64'), encrypted.toString('base64')].join(':');
}
export function unseal(value: string) {
  if (!value.startsWith('enc1:')) return value; // Read legacy settings; next save encrypts them.
  const [, iv, tag, encrypted] = value.split(':');
  const cipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64'));
  cipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([cipher.update(Buffer.from(encrypted, 'base64')), cipher.final()]).toString('utf8');
}
