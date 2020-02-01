import get from "request";

if (module.parent === null) {
    get("https://api.swag.live/feeds/happy-hour-zh?limit=30&page=1", {
        json: true,
    }, (error, response, body) => {
        if (error) {
            console.error(error);
        } else {
            console.log(response);
            console.log(body);
        }
    });
}
