const { parse } = require('csv-parse');
const fs = require('fs');

const results = [];

fs.createReadStream('kepler_data.csv')
    // pipe() is used for connecting the writable stream source (kepler_data.csv) to a writable stream destination (parse())
    .pipe(parse({
        // Looking at the csv file, we're going to give some "guidance"
        comment: '#', // # symbols will be treated as comments
        columns: true, // This will treat each row in the csv file as an object
    }))
    .on('data', (data) => {
        results.push(data);
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(results);
        console.log('done');
    });