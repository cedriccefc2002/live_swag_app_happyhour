import { load } from "cheerio";
import { configure, getLogger } from "log4js";

import { getTextAsync } from ".";


export interface IMedia {
    videos: string[];
    audios: string[];
}

const logger = getLogger();
const baseUrl = "https://asia.messages.swag.live";
const RepresentationIDVideo = 1;
const RepresentationIDAudio = 3;

export async function getMedia(id: string): Promise<IMedia> {
    const result: IMedia = {
        videos: [],
        audios: [],
    };
    const url = `${baseUrl}/${id}.mpd`;
    logger.info(`Read ${url}`);
    const xml = load(await getTextAsync(url));
    let videoCount = 1;
    xml(`AdaptationSet[contentType="video"] Representation[id="${RepresentationIDVideo}"] S`).each((index, element) => {
        if (element.attribs.r) {
            videoCount += 1 * parseInt(element.attribs.r, 10);
        } else {
            videoCount += 1;
        }
    });
    let audioCount = 1;
    xml(`AdaptationSet[contentType="audio"] Representation[id="${RepresentationIDAudio}"] S`).each((index, element) => {
        if (element.attribs.r) {
            audioCount += 1 * parseInt(element.attribs.r, 10);
        } else {
            audioCount += 1;
        }
    });
    logger.info(`video Count ${videoCount}; audio Count ${videoCount}`);
    result.videos.push(`https://asia.messages.swag.live/${id}-${RepresentationIDVideo}-00000.mp4`);
    for (let index = 1; index <= videoCount; index++) {
        result.videos.push(`https://asia.messages.swag.live/${id}-${RepresentationIDVideo}-${`${index}`.padStart(5, "0")}.m4s`);
    }
    result.audios.push(`https://asia.messages.swag.live/${id}-${RepresentationIDAudio}-00000.mp4`);
    for (let index = 1; index <= audioCount; index++) {
        result.audios.push(`https://asia.messages.swag.live/${id}-${RepresentationIDAudio}-${`${index}`.padStart(5, "0")}.m4s`);
    }
    return result;
}

if (module.parent === null) {
    configure({
        appenders: { console: { type: "console" } },
        categories: { default: { appenders: ["console"], level: "all" } },
    });
    (async () => {
        logger.info(await getMedia("5da07e2839b5763444a4cacb"));
    })().finally(() => { process.exit(); });
}
