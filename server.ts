import { cliCommand, defineCli, type BbPluginApi } from '@get-bb/plugin-sdk';
import { z } from 'zod';
import { bounded, validateCall, withMcp } from './client.js';

const callSchema = z.object({ name: z.string().min(1).max(128), arguments: z.record(z.string(), z.unknown()).default({}) });
export default async function plugin(bb: BbPluginApi) {
  const settings = bb.settings.define({ apiKey: { type: 'string', label: 'Prolepsia API key', secret: true } });
  const lifecycle = new AbortController();
  bb.onDispose(() => lifecycle.abort());
  const request = async (kind: 'tools' | 'call', input: unknown, signal?: AbortSignal) => {
    const params = kind === 'call' ? callSchema.parse(input) : z.object({ cursor: z.string().optional() }).parse(input);
    if ('name' in params) validateCall(params.name, params.arguments);
    const { apiKey } = await settings.get();
    return withMcp(apiKey, signal ? AbortSignal.any([signal, lifecycle.signal]) : lifecycle.signal, async (client, requestSignal) => {
      const result = 'name' in params
        ? await client.callTool({ name: params.name, arguments: params.arguments }, undefined, { signal: requestSignal, timeout: 65_000 })
        : await client.listTools(params, { signal: requestSignal, timeout: 15_000 });
      return bounded(result);
    });
  };
  bb.agents.registerTool({
    name: 'prolepsia_tools',
    description: 'Discover Prolepsia MCP tools and their exact input schemas. Returns one page and nextCursor when present.',
    parameters: z.object({ cursor: z.string().optional() }),
    execute: (input, ctx) => request('tools', input, ctx.signal),
  });
  bb.agents.registerTool({
    name: 'prolepsia_call',
    description: 'Call a Prolepsia MCP tool using its discovered name and arguments. Supports questions, forecasts, run modes, credits, chats, schedules, and other account tools. Remote isError is preserved. Forecast creation is paid and asynchronous; return taskId immediately and never retry creation blindly. Only cancel when the user requests it.',
    parameters: callSchema,
    execute: (input, ctx) => request('call', input, ctx.signal),
  });
  bb.cli.register(defineCli({
    name: 'prolepsia', summary: 'Prolepsia forecasting over MCP', commands: {
      tools: cliCommand({ summary: 'Discover remote tools and schemas', options: { cursor: { type: 'string', description: 'Remote pagination cursor' } }, run: async (input, ctx) => ({ exitCode: 0, stdout: await request('tools', { cursor: input.options.cursor }, ctx.signal) }) }),
      call: cliCommand({ summary: 'Call a remote MCP tool with JSON arguments', positionals: [{ name: 'name', required: true, description: 'Remote tool name from tools' }], options: { args: { type: 'string', default: '{}', description: 'JSON object of remote tool arguments' } }, run: async (input, ctx) => {
        const output = await request('call', { name: input.positionals.name, arguments: JSON.parse(input.options.args) }, ctx.signal);
        return { exitCode: JSON.parse(output).isError === true ? 1 : 0, stdout: output };
      } }),
    },
  }));
}
