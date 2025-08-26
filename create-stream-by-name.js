const csv = require('fast-csv');
const fs = require('fs');

module.exports = function createStreamByName(name) {
    const csvStream = csv.createWriteStream({headers: false});
    csvStream.pipe(fs.createWriteStream(`${name}.csv`, { encoding: 'utf8' }));
    return csvStream;
};
