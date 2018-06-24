"use strict";

const earthRadius = 6371000;

class Vector {
	constructor(start, end) {
		this.start = start || null;
		this.end = end || null;
	}

	invert() {
		var start = this.start;
		var end = this.end;

		this.start = end;
		this.end = start;
	}

	getDistance() {
		if(!this.isValid()) {
			throw new Error('Vector is invalid');
		}

		var radLatFrom = Vector.floatToRadians(this.start.latitude);
		var radLatTo = Vector.floatToRadians(this.end.latitude);

		var radDeltaLat = Vector.floatToRadians(this.end.latitude - this.start.latitude);
		var radDeltaLon = Vector.floatToRadians(this.end.longitude - this.start.longitude);

		var a = Math.sin(radDeltaLat / 2) * Math.sin(radDeltaLat / 2) +
		        Math.cos(radLatFrom) * Math.cos(radLatTo) *
		        Math.sin(radDeltaLon / 2) * Math.sin(radDeltaLon / 2);

		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		// Precision less than a meter is not really accurate here

		return parseInt(earthRadius * c);
	}

	getBearing() {

	}

	isValid() {
		if(this.start === null || this.end === null) {
			return false;
		}

		if(this.start.constructor.name !== 'Point' || this.end.constructor.name !== 'Point') {
			return false;
		}

		if(!this.start.isValid() || !this.end.isValid()) {
			return false;
		}

		return true;
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

module.exports = Vector;