import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

export const ENDPOINT = 'https://app.prolepsia.com/api/v1/mcp/';
export const MAX_OUTPUT = 120_000;
export function bounded(value: unknown): string {
  const text = JSON.stringify(value, null, 2);
  if (text.length > MAX_OUTPUT) throw new Error('Response exceeds 120,000 characters. Narrow the query, paginate, or omit subforecasts. The remote operation may already have completed; do not repeat a write.');
  return text;
}
export function validateCall(name: string, args: Record<string, unknown>) {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(name)) throw new Error('Invalid tool name.');
  if (name === 'wait_for_forecast' || name === 'wait_for_question_context') {
    const timeout = args.timeoutSeconds ?? 30;
    if (typeof timeout !== 'number' || !Number.isFinite(timeout) || timeout < 1 || timeout > 55) throw new Error('timeoutSeconds must be between 1 and 55.');
  }
  if (args.all === true) throw new Error('Use paginated calls instead of all=true.');
  if (args.limit !== undefined && (typeof args.limit !== 'number' || !Number.isInteger(args.limit) || args.limit < 1 || args.limit > 100)) throw new Error('limit must be an integer between 1 and 100.');
}
export async function withMcp<T>(key: string | undefined, signal: AbortSignal | undefined, operation: (client: Client, signal: AbortSignal) => Promise<T>): Promise<T> {
  if (!key?.trim()) throw new Error('Configure the Prolepsia API key in BB Settings → Installed plugins → Prolepsia.');
  const transport = new StreamableHTTPClientTransport(new URL(ENDPOINT), { requestInit: { headers: { Authorization: `Bearer ${key.trim()}` } } });
  const client = new Client({ name: 'bb-plugin-prolepsia', version: '0.1.1' });
  const deadline = AbortSignal.timeout(70_000);
  const combined = signal ? AbortSignal.any([signal, deadline]) : deadline;
  const close = () => { void client.close().catch(() => {}); };
  combined.addEventListener('abort', close, { once: true });
  try {
    combined.throwIfAborted();
    await client.connect(transport, { signal: combined, timeout: 15_000 });
    return await operation(client, combined);
  } catch (error) {
    // Do not propagate upstream bodies/headers that could echo credentials.
    if (combined.aborted) throw new Error('Prolepsia request interrupted or timed out. A submitted forecast can still be running; check list_forecasts before resubmitting.');
    const code = (error as { code?: unknown }).code;
    throw new Error(`Prolepsia MCP request failed${typeof code === 'number' ? ` (code ${code})` : ''}. Check API-key scopes and connection. Writes are never retried automatically; check existing forecasts before resubmitting.`);
  } finally {
    combined.removeEventListener('abort', close);
    await client.close().catch(() => {});
  }
}
