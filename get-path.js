module.exports  = function () {
    for (let i = 2; i < process.argv.length; i++) {
        if (process.argv[i] === '-csv' && process.argv[i+1]) {
            return process.argv[i+1]
        }
    }
    console.error('No File Selected');
    process.exit(1);
};
