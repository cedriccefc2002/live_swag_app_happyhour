import { configure, getLogger } from "log4js";
import { getJsonAsync } from ".";

export interface IFeed {
    sender: string;
    caption: string;
    unlock_price: number;
    tags: string[];
    media: {};
    id: string;
    postedAt: number;
}

const logger = getLogger();

const limit = 100;
const startPage = 1;
const endPage = 10;
const baseUrl = "https://api.swag.live/feeds/happy-hour-zh";

export async function getFeeds(): Promise<IFeed[]> {
    let result: IFeed[] = [];
    for (let page = startPage; page <= endPage; page++) {
        const url = `${baseUrl}?limit=${limit}&page=${page}`;
        logger.info(`Read ${url}`);
        result = result.concat(await getJsonAsync(url));
    }
    logger.info(`Read ${result.length} Feeds`);
    return result;
}

if (module.parent === null) {
    configure({
        appenders: { console: { type: "console" } },
        categories: { default: { appenders: ["console"], level: "all" } },
    });
    (async () => {
        await getFeeds();
    })().finally(() => { process.exit(); });
}
