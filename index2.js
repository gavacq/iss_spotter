const { nextISSTimesForMyLocation } = require("./iss_promised");

const printFlyoverTimes = flyoverTimes => {
  JSON.parse(flyoverTimes).response.forEach(t => {
    console.log(`Next pass at ${Date(t.risetime).toLocaleString()} for ${t.duration} seconds!`);
  });
};

nextISSTimesForMyLocation()
  .then(flyoverTimes => printFlyoverTimes(flyoverTimes))
  .catch(err => console.log("Something broke!\n", err.message));
