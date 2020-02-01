import { configure, getLogger } from "log4js";
import { getJsonAsync } from ".";

export interface IMessage {
    sender: string;
    media: {
        dash: string;
        hls: string;
        "hls-variants": {
            preview: string;
            sd: string;
            hd: string;
        }
    };
    caption: {
        text: string;
        x: number;
        y: number;
    };
    hashtags: string[];
    rating: number;
    id: string;
    type: string;
    postedAt: number;
    expiresAt: number;
    unlockPrice: number;
    isUnlocked: boolean;
    tags: string[];
    mediaType: string;
    replyPrice: number;
}

const logger = getLogger();
const baseUrl = "https://api.swag.live/messages";

export async function getMessage(ids: string[]): Promise<IMessage[]> {
    let result: IMessage[] = [];
    for (const id of ids) {
        const url = `${baseUrl}/${id}`;
        logger.info(`Read ${url}`);
        result = result.concat(await getJsonAsync(url));
    }
    logger.info(`Read ${result.length} Messages`);
    return result;
}

if (module.parent === null) {
    configure({
        appenders: { console: { type: "console" } },
        categories: { default: { appenders: ["console"], level: "all" } },
    });
    (async () => {
        await getMessage(["5da07e2839b5763444a4cacb"]);
    })().catch((error) => { console.error(error); }).finally(() => { process.exit(); });
}
