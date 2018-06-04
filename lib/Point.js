"use strict";

const Vector = require('./Vector.js');

class Point {
	constructor(opts) {
		this.latitude = opts.latitude || 0;
		this.longitude = opts.longitude || 0;
		this.payload = opts.payload || {};
	}

	getVectorTo(point) {
		var vector = new Vector(this, point);

		return vector;
	}

	getVectorFrom(point) {
		var vector = this.getVectorTo(point);

		vector.invert();

		return vector;
	}

	isValid() {
		if(!this._isValidDegree(this.lat) || !this._isValidDegree(this.lon)) {
			return false;
		}
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
}

Point.latitude = 0;
Point.longitude = 0;
Point.payload = {};

module.exports = Point;