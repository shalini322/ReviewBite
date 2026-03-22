const redis = require('redis');

// This looks for the cloud URL first, then falls back to local docker if not found
const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
    await client.connect();
    console.log("✅ Connected to Redis Cloud");
}

connectRedis();

module.exports = client;

