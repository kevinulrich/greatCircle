var googleHQ = {lat: 37.4203139, lon: -122.0839101, payload: 'Google Headquarters'};
var oneMarket = {lat: 37.791574, lon: -122.404912};
var scotiaSquare = {lat: 44.6488187, lon: -63.5767536};
var universityOfZambia = {lat: -15.3924928, lon: 28.3186342};
var stangenpyramide = {lat: 50.0104469, lon: 8.7194302, payload: 'Stangenpyramide'};

QUnit.test("Limit Input validation", function( assert ) {
	var limit1 = 5.363754;
	var limit2 = 'hello';
	var limit3 = false;
	var limit4 = 0;
	var limit5 = 4;
	var limit6 = -60;

	assert.equal(greatCircle._getValidLimit(limit1), 5, "Limit from float");
	assert.equal(greatCircle._getValidLimit(limit2), false, "Limit from string");
	assert.equal(greatCircle._getValidLimit(limit3), false, "Limit from boolean");
	assert.equal(greatCircle._getValidLimit(limit4), false, "Limit from integer 0");
	assert.equal(greatCircle._getValidLimit(limit5), 4, "Limit from integer");
	assert.equal(greatCircle._getValidLimit(limit6), false, "Limit from negative integer");
});

QUnit.test("Sort Input validation", function( assert ) {
	var limit1 = 1;
	var limit2 = 'hello';
	var limit3 = 'asc';
	var limit4 = 'desc';
	var limit5 = false;
	var limit6 = true;

	assert.equal(greatCircle._getValidSort(limit1), false, "Sort from integer");
	assert.equal(greatCircle._getValidSort(limit2), false, "Sort from string");
	assert.equal(greatCircle._getValidSort(limit3), 'asc', "Sort from string asc");
	assert.equal(greatCircle._getValidSort(limit4), 'desc', "Sort from string desc");
	assert.equal(greatCircle._getValidSort(limit5), false, "Sort from bool");
	assert.equal(greatCircle._getValidSort(limit6), false, "Sort from bool");
});

QUnit.test("Coordinate validation", function( assert ) {
	var coord1 = {lat: 52.1234, lon: '3.5747', payload: 'test'};
	var coord2 = false;
	var coord3 = {lat: '145.346.324', lon: 3425.46757};
	var coord4 = '52.3525,3564363.34';

	assert.deepEqual(greatCircle._getValidPoint(coord1), {lat: 52.1234, lon: 3.5747, payload: 'test'}, "Valid point");
	assert.throws(function() { greatCircle._getValidPoint(coord2) }, "greatCircle: Invalid coordinates", "false");
	assert.throws(function() { greatCircle._getValidPoint(coord3) }, "greatCircle: Invalid coordinates", "Valid point but unrealistic coordinates");
	assert.throws(function() { greatCircle._getValidPoint(coord4) }, "greatCircle: Invalid coordinates", "String");
});

QUnit.test("Coordinate list validation", function( assert ) {
	var coord1 = {lat: 52.1234, lon: '3.5747', payload: 'test'};
	var coord2 = [false];
	var coord3 = 'hello world';
	var coord4 = [{lat: 52.1234, lon: '3.5747', payload: 'test'}, false, 'hello'];
	var coord5 = [{lat: 52.1234, lon: '3.5747', payload: 'test'}, {lat: 1.1234, lon: '67.5747'}, {lat: 5.1234, lon: '20.5747', payload: 'test'}];

	assert.deepEqual(greatCircle._getValidPointList(coord1), [{lat: 52.1234, lon: 3.5747, payload: 'test'}], "Valid point");
	assert.deepEqual(greatCircle._getValidPointList(coord2), [], "Boolean");
	assert.deepEqual(greatCircle._getValidPointList(coord3), [], "String");
	assert.deepEqual(greatCircle._getValidPointList(coord4), [{lat: 52.1234, lon: 3.5747, payload: 'test'}], "Valid point with invalid points");
	assert.deepEqual(greatCircle._getValidPointList(coord5), [{lat: 52.1234, lon: 3.5747, payload: 'test'}, {lat: 1.1234, lon: 67.5747}, {lat: 5.1234, lon: 20.5747, payload: 'test'}], "Valid points");
});

QUnit.test("Calculating Distance between known points", function( assert ) {
	// We are disregarding the slight error margin the haversine formula might have by rounding to meters
	assert.equal(parseInt(greatCircle.getDistanceBetween(googleHQ, oneMarket)), 50038, 'Distance between Google HQ and One Market SF');
	assert.equal(parseInt(greatCircle.getDistanceBetween(scotiaSquare, universityOfZambia)), 11350402, 'Distance between Scotia Square in Nova Scotia and the University of Zambia');
});