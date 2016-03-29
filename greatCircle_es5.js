'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Great Circle calculation
 * @author  Kevin Ulrich
 * @class  greatCircle
 */

var greatCircle = (function () {

	/**
  * Constructor 
  * @param  {object} opts Option-Object. Accepts properties 'sort' ('asc' || 'desc' || false) and limit (positive integer || false)
  */

	function greatCircle(opts) {
		_classCallCheck(this, greatCircle);

		if (typeof opts != 'object') opts = {};

		this.sort = greatCircle._getValidSort(opts.sort);
		this.limit = greatCircle._getValidLimit(opts.sort);
	}

	_createClass(greatCircle, [{
		key: 'calc',

		/**
   * Calculate a list of points. Can override default 'sort' and 'limit' by property.
   * @param  {object} opts Option-Object. Accepts properties from (valid point), to (array of or single valid point), sort (see constructor), limit (see constructor)
   * @return {array}      The resulting distance list with given points and distances
   */
		value: function calc(opts) {
			if (typeof opts.from != 'object' || typeof opts.from.lat == 'undefined' || typeof opts.from.lon == 'undefined') throw 'greatCircle: From needs to be an object with at least lat and lon';
			if (typeof opts.to != 'object') throw 'greatCircle: To needs to be an object with at least lat and lon';

			var tempSort = typeof opts.sort != 'undefined' ? greatCircle._getValidSort(opts.sort) : this.sort;
			var tempLimit = typeof opts.limit != 'undefined' ? greatCircle._getValidLimit(opts.limit) : this.limit;

			var from = greatCircle._getValidPoint(opts.from);
			var to = greatCircle._getValidPointList(opts.to);

			var distances = greatCircle._getDistanceList(from, to);

			if (tempSort !== false) distances = greatCircle._sortDistanceList(distances, tempSort);
			if (tempLimit !== false) distances = greatCircle._limitDistanceList(distances, tempLimit);

			return distances;
		}
	}], [{
		key: 'getDistanceBetween',

		/**
   * The raw calculation according to the haversine formula. 
   * Big thanks to http://www.movable-type.co.uk/scripts/latlong.html for the brilliant explanation of
   * different methods of determining great circle distance!
   * @param  {object} from A valid point
   * @param  {object} to   A valid point
   * @return {number}      Distance in meters
   * @static
   */
		value: function getDistanceBetween(from, to) {
			from = greatCircle._getValidPoint(from);
			to = greatCircle._getValidPoint(to);

			var radLatFrom = greatCircle.floatToRadians(from.lat);
			var radLatTo = greatCircle.floatToRadians(to.lat);

			var radDeltaLat = greatCircle.floatToRadians(to.lat - from.lat);
			var radDeltaLon = greatCircle.floatToRadians(to.lon - from.lon);

			var a = Math.sin(radDeltaLat / 2) * Math.sin(radDeltaLat / 2) + Math.cos(radLatFrom) * Math.cos(radLatTo) * Math.sin(radDeltaLon / 2) * Math.sin(radDeltaLon / 2);

			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

			// Precision less than a meter is not really accurate here

			return parseInt(greatCircle.earthRadius * c);
		}
	}, {
		key: '_limitDistanceList',

		/**
   * Limit a list to a number of items
   * @param  {object} list  The Array/Object to limit
   * @param  {number} limit Number of allowed items as integer
   * @return {object}       Truncated Array/Object
   * @static
   */
		value: function _limitDistanceList(list, limit) {
			limit = greatCircle._getValidLimit(limit);

			if (limit === false) return [];

			var limitedArray = [];

			for (var item in list) {
				if (item == limit) break;
				limitedArray.push(list[item]);
			}

			return limitedArray;
		}
	}, {
		key: '_sortDistanceList',

		/**
   * Sort a list of distances (as determined by the distance property of items)
   * @param  {object} list      List of distances, as returned by _getDistanceList()
   * @param  {mixed} direction A valid direction ('asc' || 'desc' || false)
   * @return {object}           The sorted List
   * @static
   */
		value: function _sortDistanceList(list, direction) {
			direction = greatCircle._getValidSort(direction);

			if (direction != 'asc' && direction != 'desc') return list;

			// Use selection sort for now

			var sortedList = [];

			while (list.length > 0) {
				var maxIdx = 0;

				for (var item in list) {
					var thisItem = list[item];

					if (typeof thisItem.distance == 'undefined') continue;

					if (thisItem.distance >= list[maxIdx].distance) {
						maxIdx = item;
					}
				}

				sortedList.push(list.splice(maxIdx, 1)[0]);
			}

			if (direction == 'asc') sortedList.reverse();

			return sortedList;
		}
	}, {
		key: '_getDistanceList',

		/**
   * Get a list of distances for from to each to point
   * @param  {object} from A valid point
   * @param  {object} to   An array of or a single valid point
   * @return {object}      An Array containing the distances for from to each to point.
   * @static
   */
		value: function _getDistanceList(from, to) {
			from = greatCircle._getValidPoint(from);
			to = greatCircle._getValidPointList(to);

			var distanceList = [];

			for (var item in to) {
				try {
					var distance = greatCircle.getDistanceBetween(from, to[item]);
					distanceList.push({ from: from, to: to[item], distance: distance });
				} catch (e) {
					console.error(e);
				}
			}

			return distanceList;
		}
	}, {
		key: '_getValidPointList',

		/**
   * Check/Clean/Format a given list for validity.
   * @param  {object} list The list to check
   * @return {object}      An Array containing valid points
   * @static
   */
		value: function _getValidPointList(list) {
			try {
				if (!(list instanceof Array)) return [greatCircle._getValidPoint(list)];
			} catch (e) {
				return [];
			}

			var cleanList = [];

			for (var item in list) {
				try {
					cleanList.push(greatCircle._getValidPoint(list[item]));
				} catch (e) {
					console.error(e);
				}
			}

			return cleanList;
		}
	}, {
		key: '_getValidPoint',

		/**
   * Check/Clean/Format a given point for validity
   * @param  {object} point The point to check
   * @return {object}       A valid point
   * @static
   */
		value: function _getValidPoint(point) {
			if (typeof point == 'undefined') throw 'greatCircle: No coordinates given';
			if (isNaN(point.lat) || isNaN(point.lon)) throw 'greatCircle: Invalid coordinates';
			if (parseFloat(point.lat) < -180 || parseFloat(point.lat) > 180) throw 'greatCircle: Invalid coordinates';
			if (parseFloat(point.lon) < -180 || parseFloat(point.lon) > 180) throw 'greatCircle: Invalid coordinates';

			var cleanPoint = { lat: parseFloat(point.lat), lon: parseFloat(point.lon) };

			if (typeof point.payload != 'undefined') cleanPoint.payload = point.payload;

			return cleanPoint;
		}
	}, {
		key: '_getValidSort',

		/**
   * Get a valid sorting parameter. Either 'asc', 'desc', or false for no sorting.
   * @param  {mixed} input Input to check
   * @return {mixed}       Valid sorting parameter for use with further functions
   * @static
   */
		value: function _getValidSort(input) {
			return input && input == 'asc' ? 'asc' : input && input == 'desc' ? 'desc' : false;
		}
	}, {
		key: '_getValidLimit',

		/**
   * Get a valid limit parameter. Can either be false or a positive integer
   * @param  {mixed} input Input to check
   * @return {mixed}       Valid limit parameter
   * @static
   */
		value: function _getValidLimit(input) {
			return typeof input == 'boolean' ? false : input === null ? false : isNaN(input) ? false : parseInt(input) > 0 ? parseInt(input) : false;
		}
	}, {
		key: 'floatToRadians',

		/**
   * Convert a degree as floating point number to degree radians
   * @param  {number} number The input degree
   * @return {number}        Degree Radians
   * @static
   */
		value: function floatToRadians(number) {
			return number * Math.PI / 180;
		}
	}, {
		key: 'earthRadius',

		/**
   * The earths radius as required by the haversine formula
   * @type {Number}
   * @static
   */
		value: 6371000,
		enumerable: true
	}]);

	return greatCircle;
})();
