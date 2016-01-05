angular.module('gt3.services', [])
.factory('Bart', function ($http, $q) {
  return {
    getStations: function() {
      return $http({
        method: 'GET',
        url: '/api/bart-stations'
      })
      .then(function (res) {
        return res.data;
      })
    },
    nearestStation: function() {
      // promisifies getCurrentPosition()
      function getPos() {
        return $q(function(resolve, reject) {
          navigator.geolocation.getCurrentPosition(function (position) {
            position = {
              lat: position.coords.latitude,
              lon: position.coords.longitude
            };
            resolve(position);
          }, function(err) {
            reject(err);
          });
        })
      }

      return getPos().then(function(pos) {
        return $http({
          method: 'POST',
          url: '/api/bart-stations',
          data: pos
        })
        .then(function (res) {
          return res.data;
        });
      });
    }
  }
});
