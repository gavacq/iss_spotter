const {nextISSTimesForMyLocation} = require("./iss");

nextISSTimesForMyLocation((err, flyoverTimes) => {
  if (err) {
    console.log("Error: ", err);
  } else {
    flyoverTimes.forEach(t => {
      console.log(`Next pass at ${Date(t.risetime).toLocaleString()} for ${t.duration} seconds!`);
    });
  }
});
