const csv = require('fast-csv');
const https = require('https');
const aws = require('aws-sdk');

module.exports.handler = function (event, context, callback) {
    const inputLink = event?.queryStringParameters?.fileUrl;

    if (!inputLink) {
        return callback(new Error('fileUrl query parameter is required'));
    }

    const fileList = {};

    https.get(inputLink).on('response', function (response) {
        const parser = csv.parse({ headers: false, ignoreEmpty: true, trim: true });

        parser
            .on('error', (err) => callback(err))
            .on('data', (row) => handleRow(row, fileList))
            .on('end', () => writeToS3(fileList, callback));

        response.pipe(parser);
    }).on('error', (err) => callback(err));
};

function handleRow(row, fileList) {
    if (!row || row.length === 0) return;
    const outFileName = String(row[0] || '').replace(/^\uFEFF/, '');

    if (!fileList[outFileName]) {
        fileList[outFileName] = [];
    }

    // Match local behavior: empty first column, then col2 and col3
    fileList[outFileName].push(["", row[1], row[2]].join(','));
}

function writeToS3(fileList, callback) {
    const s3 = new aws.S3();
    const bucket = process.env.BUCKET_NAME;
    if (!bucket) return callback(new Error('Missing BUCKET_NAME env var'));

    const uploads = Object.entries(fileList).map(([keyFileName, rows]) =>
        s3.putObject({
            Bucket: bucket,
            Key: `${keyFileName}.csv`,
            Body: rows.join('\n'),
            ContentType: 'text/csv; charset=utf-8',
        }).promise()
    );

    Promise.all(uploads)
        .then(() => {
            callback(null, {
                statusCode: 200,
                headers: { 'Content-Type': 'text/html' },
                body: 'Successfully Completed!'
            });
        })
        .catch((err) => callback(err));
}
