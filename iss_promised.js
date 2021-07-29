// iss_promised.js
const request = require('request-promise-native');

const fetchMyIP = () => {
  // use request to fetch IP address from JSON API
  return request("https://api.ipify.org?format=json");
};

/*
 * Makes a request to freegeoip.app using the provided IP address, to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = ipAddr => {
  return request("https://freegeoip.app/json/" + ipAddr);
};

const fetchISSFlyOverTimes = coords => {
  return request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`);
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
    .then(ipAddr => fetchCoordsByIP(JSON.parse(ipAddr).ip))
    .then(coords => fetchISSFlyOverTimes((({latitude, longitude}) => ({
      latitude,
      longitude
    }))(JSON.parse(coords))));
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};
