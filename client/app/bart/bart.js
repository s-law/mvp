angular.module('gt3.bart', [])
.controller('BartController', function($scope, Bart) {
  Bart.nearestStation()
  .then(function(data) {
    $scope.destinations = data;
    $scope.walktime = Math.round($scope.destinations.distanceFrom * 20);
  });

  setInterval(function() {
    Bart.nearestStation()
    .then(function(data) {
      $scope.destinations = data;
      $scope.walktime = Math.round($scope.destinations.distanceFrom * 20 );
    });
  }, 30000);

  $scope.classifyTime = function(time) {
    var walkSpeed = 3;
    var runSpeed = 5;
    var howFar = $scope.destinations.distanceFrom;

    if (time > (howFar*(60/walkSpeed)) + 7) {
      return 'blue';
    } else if (time > (howFar*(60/walkSpeed)) + 4) {
      return 'green'
    } else if (time > (howFar*(60/runSpeed)) + 2.5) {
      return 'yellow'
    } else {
      return 'red';
    }
  };
})
