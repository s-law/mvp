var request = require('request');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;

module.exports = {
  // optimized Haversine formula:
  // https://stackoverflow.com/a/21623206
  calcDistance: function (lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;

    return 7918 * Math.asin(Math.sqrt(a)); // 2 * R; R = 3959 mi
  },
  calcWalkTime: function(distance) {
    // average walking speed is 3 MPH
    // (x miles / 3 miles per hour) * 60 minutes per hour
    // future version will incorporate GMaps call
    return Math.ceil(distance * 20);
  },
  calcRunTime: function(distance) {
    // decent jogging speed is 5 MPH
    // (x miles / 5 miles per hour) * 60 minutes per hour
    // future version will incorporate GMaps call
    return Math.ceil(distance * 12);
  },
  bartParse: function(url, cb) {
    request(url, function(err, res, xml) {
      parseString(xml, function(err, result) {
        cb(result);
      });
    });
  },
  caltrainParse: function(url, cb) {
    request(url, function(err, res, body) {
      var result = {};

      // 511 API does not provide train numbers, so data
      // must be scraped from caltrain site
      var $ = cheerio.load(body);

      // TODO: walk through DOM and extract train nos., 
      // times, service type
      // check table header for direction

      cb(result);
    });
  }
}