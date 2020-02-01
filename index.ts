import { promises } from "fs";

import { configure, getLogger } from "log4js";

import { downloadMutilStream, margeMedia } from "./lib";
import { getFeeds } from "./lib/feed";
import { getMedia } from "./lib/media";

const logger = getLogger();

const outDir = "./out/";

async function download(id: string, title: string, author: string) {
    const media = await getMedia(id);
    await downloadMutilStream(media.videos, `./out/${id}.m4v`);
    await downloadMutilStream(media.audios, `./out/${id}.m4a`);
    await margeMedia(`./out/${id}`, title, author);
    await promises.unlink(`./out/${id}.m4v`);
    await promises.unlink(`./out/${id}.m4a`);
}

if (module.parent === null) {
    configure({
        appenders: { console: { type: "console" } },
        categories: { default: { appenders: ["console"], level: "all" } },
    });
    (async () => {
        try {
            const feeds = await getFeeds();
            const length = feeds.length;
            for (let index = 0; index < length; index++) {
                const feed = feeds[index];
                try {
                    logger.info(`download ${feed.caption} ${index} / ${length}`);
                    await download(feed.id, feed.caption, feed.sender);
                } catch (error) {
                    logger.error(error);
                }
            }
        } catch (error) {
            logger.error(error);
        }
    })().finally(() => { process.exit(); });
}
