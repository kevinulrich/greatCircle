var assert = require('assert');
var greatCircle = require('../greatCircle.js');

var googleHQ = new greatCircle.Point({latitude: 37.4203139, longitude: -122.0839101, payload: 'Google Headquarters'});
var oneMarket = new greatCircle.Point({latitude: 37.791574, longitude: -122.404912});
var scotiaSquare = new greatCircle.Point({latitude: 44.6488187, longitude: -63.5767536});
var universityOfZambia = new greatCircle.Point({latitude: -15.3924928, longitude: 28.3186342});
var stangenpyramide = new greatCircle.Point({latitude: 50.0104469, longitude: 8.7194302, payload: 'Stangenpyramide'});
var impossiblePoint = new greatCircle.Point({latitude: 189, longitude: 1.0});
var anotherImpossiblePoint = new greatCircle.Point({latitude: false, longitude: 'hello'});
var pointWithoutLongitude = new greatCircle.Point({latitude: 12});

var vectorWithoutEnd = new greatCircle.Vector(googleHQ);
var vectorWithoutAnything = new greatCircle.Vector();

var list = new greatCircle.PointList();

list.addPoint(oneMarket);
list.addPoint(universityOfZambia);
list.addPoint(scotiaSquare);
list.addPoint(stangenpyramide);

describe('Point validation', function() {
	it('should reject impossible points', function() {
		assert.equal(impossiblePoint.isValid(), false);
		assert.equal(anotherImpossiblePoint.isValid(), false);
	});

	it('should subsitute defaults', function() {
		assert.equal(pointWithoutLongitude.longitude, 0);
		assert.equal(pointWithoutLongitude.isValid(), true);
		assert.equal(typeof scotiaSquare.payload, 'object');
	});
});

describe('Vector calculation', function() {
	it('should return an distance in meters or throw when given invalid points', function() {
		assert.equal(googleHQ.getVectorTo(oneMarket).getDistance(), 50038);
		assert.equal(googleHQ.getVectorFrom(oneMarket).getDistance(), 50038);
		assert.equal(scotiaSquare.getVectorTo(universityOfZambia).getDistance(), 11350402);
		assert.equal(scotiaSquare.getVectorFrom(universityOfZambia).getDistance(), 11350402);
		assert.throws(function(){scotiaSquare.getVectorTo('hello world').getDistance()});
		assert.throws(function(){scotiaSquare.getVectorFrom('hello world').getDistance()});
		assert.throws(function(){oneMarket.getVectorTo(impossiblePoint).getDistance()});
		assert.throws(function(){impossiblePoint.getVectorFrom(impossiblePoint).getDistance()});
		assert.equal(scotiaSquare.getVectorFrom(scotiaSquare).getDistance(), 0);
		assert.throws(function(){scotiaSquare.getVectorFrom(null).getDistance()});
		assert.throws(function(){scotiaSquare.getVectorTo(null).getDistance()});
	});

	it('should subsitute defaults', function() {
		assert.equal(vectorWithoutEnd.end, null);
		assert.equal(vectorWithoutAnything.start, null);
		assert.equal(vectorWithoutAnything.end, null);
		assert.equal(vectorWithoutAnything.isValid(), false);
		assert.equal(vectorWithoutEnd.isValid(), false);
	});
});

describe('Point lists', function() {
	it('should return a correctly sorted list', function() {
		list.sortByDistanceTo(googleHQ);

		var result = list.toArray();

		assert.deepEqual(result[0], oneMarket);
		assert.deepEqual(result[1], scotiaSquare);
		assert.deepEqual(result[2], stangenpyramide);
		assert.deepEqual(result[3], universityOfZambia);

		list.sortByDistanceTo(googleHQ, 'desc');

		result = list.toArray();

		assert.deepEqual(result[3], oneMarket);
		assert.deepEqual(result[2], scotiaSquare);
		assert.deepEqual(result[1], stangenpyramide);
		assert.deepEqual(result[0], universityOfZambia);

		list.sortByDistanceTo(null);

		result = list.toArray();

		assert.equal(result.length, 4);
	});

	it('should be able to count the number of points it contains', function() {
		assert.equal(list.count(), 4);
	});

	it('should reject invalid sorting', function() {
		assert.throws(function(){list.sortByDistanceTo(googleHQ, 'test');});
		assert.throws(function(){list.sortByDistanceTo(googleHQ, googleHQ);});
		assert.throws(function(){list.sortByDistanceTo(googleHQ, [oneMarket, 'asc']);});
	});

	it('should reject invalid points', function() {
		assert.throws(function(){list.addPoint(impossiblePoint)});
		assert.throws(function(){list.addPoint('hello World')});
		assert.throws(function(){list.addPoint(anotherImpossiblePoint)});
		assert.throws(function(){list.addPoint(vectorWithoutEnd)});
	});
});
