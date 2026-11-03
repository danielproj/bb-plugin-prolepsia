import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bounded, validateCall, withMcp, ENDPOINT } from './client.js';

test('bounds prevent unbounded fetches and long waits', () => {
  for (const args of [{ all: true }, { limit: 101 }, { limit: 0 }, { limit: 1.5 }]) assert.throws(() => validateCall('list_forecasts', args));
  for (const timeoutSeconds of [0, 56, NaN, '55']) assert.throws(() => validateCall('wait_for_forecast', { timeoutSeconds }));
  validateCall('wait_for_forecast', { timeoutSeconds: 55 });
  assert.throws(() => bounded({ text: 'a'.repeat(120_000) }));
  assert.equal(JSON.parse(bounded({ isError: true })).isError, true);
});
test('missing credentials fail before network access', async () => {
  await assert.rejects(withMcp('', undefined, async () => null), /Configure/);
});
test('real MCP transport initializes, authenticates, lists tools, and preserves remote errors', async () => {
  const original = globalThis.fetch;
  const methods: string[] = [];
  globalThis.fetch = async (url, init) => {
    assert.equal(String(url), ENDPOINT);
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer test-key');
    const body = JSON.parse(String(init?.body));
    methods.push(body.method);
    if (!('id' in body)) return new Response(null, { status: 202 });
    const result = body.method === 'initialize'
      ? { protocolVersion: '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: 'fixture', version: '1' } }
      : body.method === 'tools/list' ? { tools: [], nextCursor: 'page2' }
      : { content: [{ type: 'text', text: 'Not permitted' }], isError: true };
    return Response.json({ jsonrpc: '2.0', id: body.id, result });
  };
  try {
    await withMcp('test-key', undefined, async (client) => {
      assert.equal((await client.listTools()).nextCursor, 'page2');
      assert.equal((await client.callTool({ name: 'create_forecast', arguments: {} })).isError, true);
    });
    assert.equal(methods.filter(m => m === 'tools/call').length, 1);
  } finally { globalThis.fetch = original; }
});
test('transport errors do not disclose keys or retry writes', async () => {
  const original = globalThis.fetch;
  let attempts = 0;
  globalThis.fetch = async () => { attempts++; throw new Error('secret-key'); };
  try {
    await assert.rejects(withMcp('secret-key', undefined, async () => null), error => !String(error).includes('secret-key'));
    assert.equal(attempts, 1);
  } finally { globalThis.fetch = original; }
});
