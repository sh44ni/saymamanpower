const https = require('https');

const cloudName = "dp3fmjjeu";
const apiKey = "342195711532734";
const apiSecret = "FzlIL96ry3N2NIQJ78x9iAxaHSI";

const auth = "Basic " + Buffer.from(apiKey + ":" + apiSecret).toString("base64");

const options = {
    hostname: 'api.cloudinary.com',
    path: `/v1_1/${cloudName}/upload_presets`,
    method: 'GET',
    headers: {
        'Authorization': auth
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log("Presets found:", response.presets.length);
            response.presets.forEach(p => {
                console.log(`- Name: ${p.name}, Mode: ${p.unsigned ? 'Unsigned' : 'Signed'}`);
            });
        } else {
            console.error(`Error: ${res.statusCode} ${res.statusMessage}`);
            console.error(data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
