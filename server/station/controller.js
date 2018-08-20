const utils = require('../config/utils.js');
const bart = require('../bart/bartController.js');

module.exports = {
    nearest: closestStation,
    departures: departingTrains,
    nearestNextDepartures: departureInformationForClosestStation
};

function closestStation(req, res, next) {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const system = req.body.system;

    if (system === 'bart') {
        res.send(bart.determineClosestStation(lat, lon));
    } else {
        res.send({});
    }
}

function departingTrains(req, res, next) {
    res.send({});
}

function departureInformationForClosestStation(req, res, next) {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const system = req.body.system;

    if (system === 'bart') {
        const closestStation = bart.determineClosestStation(lat, lon);
        const currentTime = Date.now()
        const dist = closestStation.distance;
        const departureInfo = {
            closestStation: closestStation.longname,
            distanceFrom: +dist.toFixed(2),
            walkTime: utils.calcWalkTime(dist),
            runTime: utils.calcRunTime(dist),
            destinations: []
        };

        utils.bartJson(closestStation.shortname, currentTime, function(bartApiData, isCached) {
            const destinations = !!bartApiData && !bartApiData.root.message ? bartApiData.root.station[0].etd : [];

            destinations.forEach(function(destination) {
                const destinationInfo = {
                    station: destination.destination,
                    departs: []
                };

                destination.estimate.forEach(function(estimate) {
                    const minutes = estimate.minutes

                    if (minutes !== 'Leaving') {
                        destinationInfo.departs.push(minutes);
                    }
                });

                departureInfo.destinations.push(destinationInfo);
            });

            departureInfo.isCached = isCached;
            res.send(departureInfo);
        });
    } else {
        res.send({});
    }
}
