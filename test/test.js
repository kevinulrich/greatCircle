var assert = require('assert');
var greatCircle = require('../greatCircle.js');

var googleHQ = new greatCircle.Point({latitude: 37.4203139, longitude: -122.0839101, payload: 'Google Headquarters'});
var oneMarket = new greatCircle.Point({latitude: 37.791574, longitude: -122.404912});
var scotiaSquare = new greatCircle.Point({latitude: 44.6488187, longitude: -63.5767536});
var universityOfZambia = new greatCircle.Point({latitude: -15.3924928, longitude: 28.3186342});
var stangenpyramide = new greatCircle.Point({latitude: 50.0104469, longitude: 8.7194302, payload: 'Stangenpyramide'});

describe('Distance calculation', function() {
	it('should return an integer in meters or throw', function() {
		assert.equal(googleHQ.getVectorTo(oneMarket).getDistance(), 50038);
		assert.equal(scotiaSquare.getVectorTo(universityOfZambia).getDistance(), 11350402);
		assert.throws(function(){scotiaSquare.getVectorTo('hello world').getDistance()});
	});
});
