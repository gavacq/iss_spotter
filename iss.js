/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchISSFlyOverTimes = (coords, cb) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (err, rsp, body) => {
    if (err) {
      cb(err, null);

      return;
    }

    // if non-200 status, assume server error
    if (rsp.statusCode !== 200) {
      const msg = `Status Code ${rsp.statusCode} when fetching ISS flyover times.\nResponse: ${body}`;
      cb(Error(msg), null);
      
      return;
    }

    const bodyJSON = JSON.parse(body);
    const flyoverTimes = bodyJSON.response;
    cb(null, flyoverTimes);
  });
};

const fetchCoordsByIP = (ip, cb) => {
  request("https://freegeoip.app/json/" + ip, (err, rsp, body) => {
    if (err) {
      cb(err, null);

      return;
    }

    // if non-200 status, assume server error
    if (rsp.statusCode !== 200) {
      const msg = `Status Code ${rsp.statusCode} when fetching geolocation.\nResponse: ${body}`;
      cb(Error(msg), null);
      
      return;
    }

    const bodyJSON = JSON.parse(body);
    const coords = {
      latitude: bodyJSON.latitude,
      longitude: bodyJSON.longitude
    };
    cb(null, coords);
  });
};

const fetchMyIP = cb => {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json", (err, rsp, body) => {
  // inside the request callback ...
  // error can be set if invalid domain, user is offline, etc.
    if (err) {
      cb(err, null);
      
      return;
    }

    // if non-200 status, assume server error
    if (rsp.statusCode !== 200) {
      const msg = `Status Code ${rsp.statusCode} when fetching IP. Response: ${body}`;
      cb(Error(msg), null);
      
      return;
    }

    try {
      const bodyJSON = JSON.parse(body);
      cb(null, bodyJSON);
    } catch (err) {
      cb("Could not parse JSON\nBody: " + body, null);
    }
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = cb => {
  fetchMyIP((err, ipAddr) => {
    if (err) {
      return cb("Error: ", err, null);
    } else {
      fetchCoordsByIP(ipAddr.ip, (err, coords) => {
        if (err) {
          return cb("Error: ", err, null);
        } else {
          fetchISSFlyOverTimes(coords, (err, flyoverTimes) => {
            if (err) {
              return cb("Error: ", err, null);
            } else {
              cb(null, flyoverTimes);
            }
          });
        }
      });
    }
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};
