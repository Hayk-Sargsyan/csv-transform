const csv = require('fast-csv');
const fs = require('fs');

const getPath = require('./get-path');
const createStreamByName = require('./create-stream-by-name');

const csvPath = getPath();
const streamList = {};

const parser = csv.parse({ headers: false, ignoreEmpty: true, trim: true });

parser
    .on('error', (err) => {
        console.error('CSV parse error:', err.message);
        closeAllStreams();
        process.exit(1);
    })
    .on('data', (row) => handleRow(row))
    .on('end', () => {
        closeAllStreams();
        console.log('Successfully Completed!!!');
    });

fs.createReadStream(csvPath).pipe(parser);

function handleRow(row) {
    if (!row || row.length === 0) return;

    // Remove potential BOM from first value
    const outFileName = String(row[0] || '').replace(/^\uFEFF/, '');

    if (!streamList[outFileName]) {
        streamList[outFileName] = createStreamByName(outFileName);
    }

    // Write a new row with an empty first column, preserving columns 2 and 3
    streamList[outFileName].write(['', row[1], row[2]]);
}

function closeAllStreams() {
    Object.values(streamList).forEach((wStream) => wStream.end());
}
