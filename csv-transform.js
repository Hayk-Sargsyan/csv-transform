const csv = require('fast-csv');
const fs = require('fs');

const getPath = require('./get-path');
const createStreamByName = require('./create-stream-by-name');

const csvPath = getPath();
const streamList = {};

fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (chunk) => handleChunk(chunk))
    .on('end', () => {
        closeAllStreams();
        console.log('Successfully Completed!!!');
    });

function handleChunk(data) {
    const outFileName = data[0];

    if (!streamList[outFileName]) {
        streamList[outFileName] = createStreamByName(outFileName);
    }

    streamList[outFileName].write({a: '', b: data[1], c: data[2]});
}

function closeAllStreams() {
    Object.values(streamList).forEach(wStream => wStream.end());
}
