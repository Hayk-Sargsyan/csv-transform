const csv = require('fast-csv');
const fs = require('fs');

module.exports = function createStreamByName(name) {
    // Use fast-csv v4 format stream; write rows as arrays for predictable order
    const csvStream = csv.format({ headers: false });
    csvStream.pipe(fs.createWriteStream(`${name}.csv`, { encoding: 'utf8' }));
    return csvStream;
};
