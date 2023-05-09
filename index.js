const { parse } = require('csv-parse');
const fs = require('fs');

const habitablePlanets = [];

// This is a function to find all the "habitable" planets, according to our data
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] == 'CONFIRMED' 
    // Make sure the amount of light is habitable for humans
    && planet['koi_insol'] > 0.36 
    && planet['koi_insol'] < 1.11
    // Make sure the planets's radii is less than 1.6 times that of Earth's
    && planet['koi_prad'] < 1.6
    // Make sure the planets orbital period is between 100 and 400 days
    && planet['koi_period'] > 99
    && planet['koi_period'] < 401;
}

fs.createReadStream('kepler_data.csv')
    // pipe() is used for connecting the writable stream source (kepler_data.csv) to a writable stream destination (parse())
    .pipe(parse({
        // Looking at the csv file, we're going to give some "guidance"
        comment: '#', // # symbols will be treated as comments
        columns: true, // This will treat each row in the csv file as an object
    }))
    .on('data', (data) => {
        if (isHabitablePlanet(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log(err);
    })
    .on('end', () => {
        console.log(habitablePlanets.map(planet => {
            return planet['kepler_name']
        }));
        console.log(`${habitablePlanets.length} habitable planets found!`);
    });