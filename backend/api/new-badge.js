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
    try {
    const key = await generateNewKey();

    await redis.set(`counter:${key}`, 0);

    const baseUrl = process.env.BASE_URL ;

    const {style="flat", color="blue", labelColor="grey"} = req.body;
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