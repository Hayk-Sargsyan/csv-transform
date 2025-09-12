const fs = require('fs');
const path = require('path');

module.exports = function () {
    for (let i = 2; i < process.argv.length; i++) {
        if ((process.argv[i] === '-csv' || process.argv[i] === '--csv') && process.argv[i + 1]) {
            const p = path.resolve(process.argv[i + 1]);
            try {
                fs.accessSync(p, fs.constants.R_OK);
                return p;
            } catch (e) {
                console.error(`File not readable: ${p}`);
                process.exit(1);
            }
        }
    }
    console.error('No CSV file provided. Usage: node csv-transform.js -csv <path>');
    process.exit(1);
};
