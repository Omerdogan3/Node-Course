const request = require('request');
const yargs = require('yargs');
const geocode = require('./geocode/geocode.js');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

geocode.geocodeAddress(argv.address, (errrorMessage, results)=>{
  if(errrorMessage){
    console.log(errrorMessage);
  }else{
    console.log(results.address);
    weather.getWeather(results.latitude, results.longitude,  (errrorMessage, weatherResults) => {
      if(errrorMessage){
        console.log(errrorMessage);
      }else{
        console.log(`It is currently ${weatherResults.temperature}, It feels like ${weatherResults.apparentTemperature}`);
      }
    });
  }
});




// var encodedAddress = encodeURIComponent(argv.address);



// request({
//   url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
//   json: true
// }, (error, response, body) => {
//   if (error) {
//     console.log('Unable to connect to Google servers.');
//   } else if (body.status === 'ZERO_RESULTS') {
//     console.log('Unable to find that address.');
//   } else if (body.status === 'OK') {
//     console.log(`Address: ${body.results[0].formatted_address}`);
//     console.log(`Latitude: ${body.results[0].geometry.location.lat}`);
//     console.log(`Longitude: ${body.results[0].geometry.location.lng}`);
//   }
// });
