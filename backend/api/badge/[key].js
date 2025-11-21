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
        svg = makeBadge({
            label: "visitors",
            message: counter.toString(),
            color,
            labelColor,
            style,
            logoBase64: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMiAxMiIgd2lkdGg9IjEyIiBoZWlnaHQ9IjEyIj48cGF0aCBkPSJNMS4yIDZxNC44IC00LjggOS42IDAgLTQuOCA0LjggLTkuNiAwWiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAuNiIgZmlsbD0ibm9uZSIvPjxwYXRoIGN4PSI1MCIgY3k9IjUwIiByPSIxMiIgZmlsbD0iI2ZmZmZmZiIgZD0iTTcuNDQgNkExLjQ0IDEuNDQgMCAwIDEgNiA3LjQ0QTEuNDQgMS40NCAwIDAgMSA0LjU2IDZBMS40NCAxLjQ0IDAgMCAxIDcuNDQgNnoiLz48L3N2Zz4=`,
        });

        res.setHeader("Content-Type", "image/svg+xml");
        res.status(200).send(svg);
    } catch (error) {
        svg = makeBadge({
            label: "error",
            message: error.message ||"internal error",
            color: "red",
            labelColor,
            style
        });
        res.setHeader("Content-Type", "image/svg+xml");
        res.status(500).send(svg);
    }
}