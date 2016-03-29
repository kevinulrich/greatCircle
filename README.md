# greatCircle
Calculate the distance between a point and a list of points

# Example usage

Define your points and send them to calc(). Points can have a payload property to help you identify the results or send other data through greatCircle.

```javascript
var googleHQ = {lat: 37.4203139, lon: -122.0839101, payload: 'Google Headquarters'};
var oneMarket = {lat: 37.791574, lon: -122.404912, payload: 'One Market'};
var scotiaSquare = {lat: 44.6488187, lon: -63.5767536, payload: 'Scotia Square'};

var gc = new greatCircle({
	sort: 'asc', // Set the default sorting to ascending
	limit: 5 // Set the result limit to 5
});

var myDistances = gc.calc({
	from: googleHQ, 
	to: [oneMarket, scotiaSquare],
	sort: 'desc' // We can override sorting here, but we don't have to
});
```

myDistances will contain a list of the distances between Google HQ and One Market as well as between Google HQ and Scotia Square:

```javascript
[
	{
		"from": {
			"lat":37.4203139,
			"lon":-122.0839101,
			"payload":"Google Headquarters"
		},
		"to": {
			"lat":44.6488187,
			"lon":-63.5767536,
			"payload":"Scotia Square"
		},
		"distance":4866320
	},
	{
		"from": {
			"lat":37.4203139,
			"lon":-122.0839101,
			"payload":"Google Headquarters"
		},
		"to": {
			"lat":37.791574,
			"lon":-122.404912,
			"payload":"One Market"
		},
		"distance":50038
	}
]
```

# API-Documentation

## greatCircle

Great Circle calculation

Author: Kevin Ulrich

## constructor

Constructor 

### Params:

* **object** *opts* Option-Object. Accepts properties 'sort' ('asc' || 'desc' || false) and limit (positive integer || false)

## calc(opts)

Calculate a list of points. Can override default 'sort' and 'limit' by property.

### Params:

* **object** *opts* Option-Object. Accepts properties from (valid point), to (array of or single valid point), sort (see constructor), limit (see constructor)

### Return:

* **array** The resulting distance list with given points and distances

## _limitDistanceList(list, limit)

Limit a list to a number of items

### Params:

* **object** *list* The Array/Object to limit
* **number** *limit* Number of allowed items as integer

### Return:

* **object** Truncated Array/Object

## _sortDistanceList(list, direction)

Sort a list of distances (as determined by the distance property of items)

### Params:

* **object** *list* List of distances, as returned by _getDistanceList()
* **mixed** *direction* A valid direction ('asc' || 'desc' || false)

### Return:

* **object** The sorted List

## _getDistanceList(from, to)

Get a list of distances for from to each to point

### Params:

* **object** *from* A valid point
* **object** *to* An array of or a single valid point

### Return:

* **object** An Array containing the distances for from to each to point.

## getDistanceBetween(from, to)

The raw calculation according to the haversine formula. 
Big thanks to http://www.movable-type.co.uk/scripts/latlong.html for the brilliant explanation of
different methods of determining great circle distance!

### Params:

* **object** *from* A valid point
* **object** *to* A valid point

### Return:

* **number** Distance in meters

## _getValidPointList(list)

Check/Clean/Format a given list for validity.

### Params:

* **object** *list* The list to check

### Return:

* **object** An Array containing valid points

## _getValidPoint(point)

Check/Clean/Format a given point for validity

### Params:

* **object** *point* The point to check

### Return:

* **object** A valid point

## _getValidSort(input)

Get a valid sorting parameter. Either 'asc', 'desc', or false for no sorting.

### Params:

* **mixed** *input* Input to check

### Return:

* **mixed** Valid sorting parameter for use with further functions

## _getValidLimit(input)

Get a valid limit parameter. Can either be false or a positive integer

### Params:

* **mixed** *input* Input to check

### Return:

* **mixed** Valid limit parameter

The earths radius as required by the haversine formula

## floatToRadians(number)

Convert a degree as floating point number to degree radians

### Params:

* **number** *number* The input degree

### Return:

* **number** Degree Radians

<!-- End greatCircle.js -->

