"use strict";

class PointList {
	constructor(opts) {
		this.pointSet = new Set();
		this.sortingProperties = {};
	}

	sortBy(property, direction = 'asc') {

	}

	toArray() {
		
	}

	/**
	 * Is the given string a valid sorting parameter? Either 'asc' or 'desc'
	 * @param  {mixed} 	input Input to check
	 * @return {boolean}
	 * @static
	 */
	static _isValidSort(input) {
		if(typeof input !== 'string') {
			return false;
		}

		if(input !== 'asc' && input !== 'desc') {
			return false;
		}

		return true;
	}
}

module.exports = PointList;