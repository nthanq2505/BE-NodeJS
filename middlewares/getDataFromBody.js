function getDataFromRequest(req, res) {
    return new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            req.body = JSON.parse(data);
            resolve();
        });
    });
}

module.exports = getDataFromRequest