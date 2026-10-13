const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../manifest/pricing-v1.json');
const gatewayModelsPath = path.resolve(__dirname, '../gateway-models.json');
const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/models';

async function getGatewayData() {
  if (fs.existsSync(gatewayModelsPath)) {
    return JSON.parse(fs.readFileSync(gatewayModelsPath, 'utf8')).data;
  }
  console.log(`Fetching latest models from ${GATEWAY_URL}...`);
  const res = await fetch(GATEWAY_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch gateway models: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data;
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const rawGateway = await getGatewayData();

  console.log('Original vercel_gateway_models count:', manifest.vercel_gateway_models?.length || 0);
  console.log('Raw gateway models count:', rawGateway.length);

  const roundRate = (v) => Math.round(v * 1e6) / 1e6;

  const updatedGatewayModels = rawGateway.map((m) => {
    const p = m.pricing || {};
    const inSingle = p.input != null ? parseFloat(p.input) : null;
    const outSingle = p.output != null ? parseFloat(p.output) : null;
    const crSingle = p.input_cache_read != null ? parseFloat(p.input_cache_read) : null;
    const cwSingle = p.input_cache_write != null ? parseFloat(p.input_cache_write) : null;

    return {
      id: m.id,
      name: m.name || m.id,
      owned_by: m.owned_by || m.id.split('/')[0] || 'unknown',
      type: m.type || 'language',
      context_window: m.context_window || null,
      max_tokens: m.max_tokens || null,
      prices_per_1m: {
        input_token: inSingle != null && !isNaN(inSingle) ? roundRate(inSingle * 1e6) : null,
        output_token: outSingle != null && !isNaN(outSingle) ? roundRate(outSingle * 1e6) : null,
        cached_input: crSingle != null && !isNaN(crSingle) ? roundRate(crSingle * 1e6) : null,
        cached_write: cwSingle != null && !isNaN(cwSingle) ? roundRate(cwSingle * 1e6) : null,
      },
    };
  });

  manifest.vercel_gateway_models = updatedGatewayModels;

  // Update rates dictionary
  if (!manifest.rates) manifest.rates = {};
  updatedGatewayModels.forEach((m) => {
    if (m.prices_per_1m && m.prices_per_1m.input_token != null && m.prices_per_1m.output_token != null) {
      const rate = {
        inputPer1M: m.prices_per_1m.input_token,
        outputPer1M: m.prices_per_1m.output_token,
        currency: 'USD',
      };
      if (m.prices_per_1m.cached_input != null) rate.cachedInputPer1M = m.prices_per_1m.cached_input;
      if (m.prices_per_1m.cached_write != null) rate.cacheWritePer1M = m.prices_per_1m.cached_write;

      const fullId = m.id.toLowerCase().trim();
      manifest.rates[fullId] = rate;
      if (fullId.includes('/')) {
        const stripped = fullId.split('/').slice(1).join('/');
        manifest.rates[stripped] = rate;
      }
    }
  });

  manifest.updatedAt = new Date().toISOString();

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log('Updated vercel_gateway_models count:', manifest.vercel_gateway_models.length);
  console.log('Updated rates count:', Object.keys(manifest.rates).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
