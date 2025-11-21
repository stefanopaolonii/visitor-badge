import redis from "../../src/redis.js";
import {makeBadge} from "badge-maker";

export default async function handler(req, res) {
    const { key, style="flat", color="blue", labelColor="grey" } = req.query;

    let svg;
    if(!key){
        svg = makeBadge({
            label: "error",
            message: "no key provided",
            color: "red",
            labelColor,
            style
        });
        res.setHeader("Content-Type", "image/svg+xml");
        res.status(400).send(svg);
        return;
    }

    try {
        const counter = await redis.incr(`counter:${key}`);
        const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
<path d="M10 50 Q50 10 90 50 Q50 90 10 50 Z" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="50" cy="50" r="12" fill="#ffffff"/>
</svg>`;

        svg = makeBadge({
            label: "visitors",
            message: counter.toString(),
            color,
            labelColor,
            style,
            logoSvg,
        });

        res.setHeader("Content-Type", "image/svg+xml");
        res.status(200).send(svg);
    } catch (error) {
        svg = makeBadge({
            label: "error",
            message: "internal error",
            color: "red",
            labelColor,
            style
        });
        res.setHeader("Content-Type", "image/svg+xml");
        res.status(500).send(svg);
    }
}