// const request = require('request');
// const yargs = require('yargs');
// const geocode = require('./geocode/geocode.js');


// const argv = yargs
//   .options({
//     a: {
//       demand: true,
//       alias: 'address',
//       describe: 'Address to fetch weather for',
//       string: true
//     }
//   })
//   .help()
//   .alias('help', 'h')
//   .argv;

// geocode.geocodeAddress(argv.address);

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

const request = require('request');

request({
  url: `https://api.darksky.net/forecast/73ea9c2609dbe0fe919296898218c1eb/41,32`,
  json: true
  },(error, response, body)=>{
    if(error){
      console.log('Unable To Connect');
    }else if(response.statusCode === 400){
      console.log('Unable to fetch weather');
    }else if(response.statusCode === 200){
      console.log(body.currently.temperature);
    }
});



