/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

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

module.exports = {
  fetchMyIP,
  fetchCoordsByIP
};
