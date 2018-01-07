const request = require('request');

var getWeather = (lat,lon,callback) =>{  
    request({
        url: `https://api.darksky.net/forecast/73ea9c2609dbe0fe919296898218c1eb/${lat},${lon}`,
        json: true
        },(error, response, body)=>{
        if(error){
            callback('Unable To Connect');
        }else if(response.statusCode === 400){
            callback('Unable to fetch weather');
        }else if(response.statusCode === 200){
            callback(undefined,{
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        }
    });
};

module.exports.getWeather = getWeather;

