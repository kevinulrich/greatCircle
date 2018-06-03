"use strict";

/**
 * Great Circle calculation
 * @author  Kevin Ulrich
 * @class  greatCircle
 */
class greatCircle {
	
	/**
	 * Constructor 
	 * @param  {object} opts Option-Object. Accepts properties 'sort' ('asc' || 'desc' || false) and limit (positive integer || false)
	 */
	constructor(opts) {
		if(typeof opts != 'object') opts = {};

		this.sort = greatCircle._getValidSort(opts.sort);
		this.limit = greatCircle._getValidLimit(opts.limit);
	}

	/**
	 * Calculate a list of points. Can override default 'sort' and 'limit' by property.
	 * @param  {object} opts Option-Object. Accepts properties from (valid point), to (array of or single valid point), sort (see constructor), limit (see constructor)
	 * @return {array}      The resulting distance list with given points and distances
	 */
	calc(opts) {
		var tempSort = typeof opts.sort != 'undefined' ? greatCircle._getValidSort(opts.sort) : this.sort;
		var tempLimit = typeof opts.limit != 'undefined' ? greatCircle._getValidLimit(opts.limit) : this.limit;

		var from = greatCircle._getValidPoint(opts.from);
		var to = greatCircle._getValidPointList(opts.to);

		var distances = greatCircle._getDistanceList(from, to);

		if(tempSort !== false) distances = greatCircle._sortDistanceList(distances, tempSort);
		if(tempLimit !== false) distances = greatCircle._limitDistanceList(distances, tempLimit);

		return distances;
	}

	/**
	 * The raw calculation according to the haversine formula. 
	 * Big thanks to http://www.movable-type.co.uk/scripts/latlong.html for the brilliant explanation of
	 * different methods of determining great circle distance!
	 * @param  {object} from A valid point
	 * @param  {object} to   A valid point
	 * @return {number}      Distance in meters
	 * @static
	 */
	static getDistanceBetween(from, to) {
		from = greatCircle._getValidPoint(from);
		to = greatCircle._getValidPoint(to);

		var radLatFrom = greatCircle.floatToRadians(from.lat);
		var radLatTo = greatCircle.floatToRadians(to.lat);

		var radDeltaLat = greatCircle.floatToRadians(to.lat - from.lat);
		var radDeltaLon = greatCircle.floatToRadians(to.lon - from.lon);

		var a = Math.sin(radDeltaLat / 2) * Math.sin(radDeltaLat / 2) +
		        Math.cos(radLatFrom) * Math.cos(radLatTo) *
		        Math.sin(radDeltaLon / 2) * Math.sin(radDeltaLon / 2);

		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		// Precision less than a meter is not really accurate here

		return parseInt(greatCircle.earthRadius * c);
	}

	/**
	 * Limit a list to a number of items
	 * @param  {object} list  The Array/Object to limit
	 * @param  {number} limit Number of allowed items as integer
	 * @return {object}       Truncated Array/Object
	 * @static
	 */
	static _limitDistanceList(list, limit) {
		limit = greatCircle._getValidLimit(limit);
		
		if(limit === false) return [];

		var limitedArray = [];

		for(var item in list) {
			if(item == limit) break;
			limitedArray.push(list[item]);
		}

		return limitedArray;
	}

	/**
	 * Sort a list of distances (as determined by the distance property of items)
	 * @param  {object} list      List of distances, as returned by _getDistanceList()
	 * @param  {mixed} direction A valid direction ('asc' || 'desc' || false)
	 * @return {object}           The sorted List
	 * @static
	 */
	static _sortDistanceList(list, direction) {
		direction = greatCircle._getValidSort(direction);

		// Use selection sort for now

		var sortedList = [];

		while(list.length > 0) {
			sortedList.push(greatCircle._spliceLargestListItem(list));
		}

		if(direction == 'asc') sortedList.reverse();

		return sortedList;
	}

	/**
	 * Get the list item with the largest distance, remove it from the list
	 * and return it
	 * @param {object} list       List of distances, as returned by _getDistanceList()
	 * @return {object}           The sorted List
	 * @static
	 */
	static _spliceLargestListItem(list) {
		var maxIdx = 0;

		for(var item in list) {
			let thisItem = list[item];

			if(typeof thisItem.distance == 'undefined') continue;

			if(thisItem.distance >= list[maxIdx].distance) {
				maxIdx = item;
			}
		}	

		return list.splice(maxIdx, 1)[0];
	}

	/**
	 * Get a list of distances for from to each to point
	 * @param  {object} from A valid point
	 * @param  {object} to   An array of or a single valid point
	 * @return {object}      An Array containing the distances for from to each to point.
	 * @static
	 */
	static _getDistanceList(from, to) {
		from = greatCircle._getValidPoint(from);
		to = greatCircle._getValidPointList(to);

		var distanceList = [];

		for(var item in to) {
			let distance = greatCircle.getDistanceBetween(from, to[item]);
			distanceList.push({from: from, to: to[item], distance: distance});
		}

		return distanceList;
	}

	/**
	 * Check/Clean/Format a given list for validity.
	 * @param  {object} list The list to check
	 * @return {object}      An Array containing valid points
	 * @static
	 */
	static _getValidPointList(list) {
		try {
			if(!(list instanceof Array)) return [greatCircle._getValidPoint(list)];	
		} catch(e) {
			return [];
		}
		

		var cleanList = [];

		for(var item in list) {
			try {
				cleanList.push(greatCircle._getValidPoint(list[item]));
			} catch(e) {
				continue;
			}
		}

		return cleanList;
	}

	/**
	 * Check/Clean/Format a given point for validity
	 * @param  {object} point The point to check
	 * @return {object}       A valid point
	 * @static
	 */
	static _getValidPoint(point) {
		if(typeof point === 'undefined') throw "greatCircle: No coordinates given";

		if(!this._isValidDegree(point.lat) || !this._isValidDegree(point.lon)) {
			throw "greatCircle: Invalid coordinates";
		}

		var cleanPoint = {lat: parseFloat(point.lat), lon: parseFloat(point.lon)};

		if(typeof point.payload != 'undefined') cleanPoint.payload = point.payload;

		return cleanPoint;
	}

	/**
	 * Check whether a given value can plausibly be a degree
	 * @param {number} The number to check
	 * @return {boolean}
	 * @static
	 */
	static _isValidDegree(degree) {
		if(isNaN(degree)) {
			return false;
		}

		if(Math.abs(parseFloat(degree) > 180)) {
			return false;
		}

		return true;
	}

	/**
	 * Get a valid sorting parameter. Either 'asc', 'desc', or false for no sorting.
	 * @param  {mixed} input Input to check
	 * @return {mixed}       Valid sorting parameter for use with further functions
	 * @static
	 */
	static _getValidSort(input) {
		return (input && input == 'asc') ? 'asc' : (input && input == 'desc') ? 'desc' : false;
	}

	/**
	 * Get a valid limit parameter. Can either be false or a positive integer
	 * @param  {mixed} input Input to check
	 * @return {mixed}       Valid limit parameter
	 * @static
	 */
	static _getValidLimit(input) {
		if(isNaN(parseInt(input))) {
			return false;
		}

		if(parseInt(input) < 0)  {
			return false;
		}

		return parseInt(input);
	}

	/**
	 * Convert a degree as floating point number to degree radians
	 * @param  {number} number The input degree
	 * @return {number}        Degree Radians
	 * @static
	 */
	static floatToRadians(number) {
		return number * Math.PI / 180;
	}
}

/**
 * The earths radius as required by the haversine formula
 * @type {Number}
 * @static
 */
greatCircle.earthRadius = 6371000;

module.exports = greatCircle;