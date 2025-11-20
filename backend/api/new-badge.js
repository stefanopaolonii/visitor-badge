import redis from "../src/redis.js";
import { randomUUID } from "crypto";

async function generateNewKey() {
    let key;

    while (true) {
        key = randomUUID();
        const exists = await redis.exists(`counter:${key}`);

        if (!exists) {
            break;
        }
    }

    return key;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
ù
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const key = await generateNewKey();

        await redis.set(`counter:${key}`, 0);

        const baseUrl = process.env.BASE_URL ;

        let body = req.body;
        if (typeof body === "string") {
            body = JSON.parse(body);
        }

        const { style = "flat", color = "blue", labelColor = "grey" } = body;
        const badgeUrl = `${baseUrl}/api/badge/${key}?style=${style}&color=${color}&labelColor=${labelColor}`;
        const markdown = `![Visits](${badgeUrl})`;

        res.status(200).json({
            badgeUrl,
            markdown,
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}