const csv = require('fast-csv');
const https = require('https');
const aws = require('aws-sdk');

module.exports.handler = function (event, context, callback) {
    const inputLink = event.queryStringParameters['fileUrl'];

    if (!inputLink) {
        return callback(new Error('link not found'));
    }

    const fileList = {};

    https.get(inputLink).on('response', function (response) {
        response.pipe(csv()).on('data', (chunk) => handleChunk(chunk, fileList));
        response.on('end', () => writeToS3(fileList, callback));
    });
};

function handleChunk(chunk, fileList) {
    let data = chunk.toString();
    if (!data) {
        return;
    }

    data = data.split(',');
    const outFileName = data[0];

    if (!fileList[outFileName]) {
        fileList[outFileName] = []
    }
    fileList[outFileName].push(`,${data[1]},${data[1]}`);
}


function writeToS3(fileList, callback) {
    const s3 = new aws.S3();

    Object.keys(fileList).forEach(keyFileName => {
        s3.putObject({
            Bucket: process.env.BUCKET_NAME,
            Key: `${keyFileName}.csv`,
            Body: fileList[keyFileName].join('\n'),
        })
    }).promise().then(() => {
        callback(null, {
            statusCode: 200,
            headers: {
                "Content-Type": "text/html"
            },
            body: 'Successfully Completed!'
        });
    }).catch((err) => callback(err));
}
