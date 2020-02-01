import { exec } from "child_process";
import { createWriteStream, promises, WriteStream } from "fs";

import { configure, getLogger } from "log4js";
import { get } from "request";

const logger = getLogger();

async function downloadStream(url: string, stream: WriteStream): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        // const stream = createWriteStream(filename);
        get(url).on("error", (error) => {
            reject(error);
        }).on("complete", resolve).pipe(stream, { end: false });
    });
}

export async function downloadMutilStream(urls: string[], filename: string): Promise<void> {
    const stream = createWriteStream(filename);
    for (const url of urls) {
        logger.info(`downloadStream ${url}`);
        await downloadStream(url, stream);
    }
    stream.close();
}

export async function margeMedia(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        exec(`ffmpeg -y -i ${id}.m4v -i ${id}.m4a -c copy -map 0:v:0 -map 1:a:0 ${id}.mp4`, { }, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

export async function getTextAsync(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        get(url, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(`${body}`);
            }
        });
    });
}

export async function getJsonAsync<T>(url: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        get(url, {
            json: true,
        }, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body as T);
            }
        });
    });
}

if (module.parent === null) {
    configure({
        appenders: { console: { type: "console" } },
        categories: { default: { appenders: ["console"], level: "all" } },
    });
    (async () => {
        try {
            // logger.info(await getJsonAsync("https://api.swag.live/feeds/happy-hour-zh?limit=30&page=1"));
            // logger.info(await getTextAsync("https://asia.messages.swag.live/5da07e2839b5763444a4cacb.mpd"));
            await downloadMutilStream([
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00000.mp4",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00001.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00002.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00003.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00004.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00005.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00006.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00007.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00008.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00009.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-1-00010.m4s"
            ], "./out/5da07e2839b5763444a4cacb.m4v");
            await downloadMutilStream([
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00000.mp4",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00001.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00002.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00003.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00004.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00005.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00006.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00007.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00008.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00009.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00010.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00011.m4s",
                "https://asia.messages.swag.live/5da07e2839b5763444a4cacb-3-00012.m4s"
            ], "./out/5da07e2839b5763444a4cacb.m4a");
            await margeMedia(`./out/5da07e2839b5763444a4cacb`);
            await promises.unlink("./out/5da07e2839b5763444a4cacb.m4v");
            await promises.unlink("./out/5da07e2839b5763444a4cacb.m4a");
        } catch (error) {
            logger.error(error);
        }
        // ffmpeg -i 5da07e2839b5763444a4cacb.m4v -i 5da07e2839b5763444a4cacb.m4a -c copy -map 0:v:0 -map 1:a:0 5da07e2839b5763444a4cacb.mp4
    })().finally(() => { process.exit(); });
}
