"use strict";

class PointList {
	constructor() {
		this.pointSet = new Set();
		this.referencePoint = null;
		this.sorting = 'asc';
	}

	getClosestPointTo(targetPoint) {
		var self = this;

		var closestPoint = null;

		this.pointSet.forEach(function(point) {
			if(closestPoint === null) {
				return closestPoint = point;
			}

			if(point.getVectorTo(targetPoint).getDistance() < closestPoint.getVectorTo(targetPoint).getDistance()) {
				closestPoint = point;
			}
		});

		return closestPoint;
	}

	getFarthestPointFrom(targetPoint) {
		var self = this;

		var farthestPoint = null;

		this.pointSet.forEach(function(point) {
			if(farthestPoint === null) {
				return farthestPoint = point;
			}

			if(point.getVectorTo(targetPoint).getDistance() > farthestPoint.getVectorTo(targetPoint).getDistance()) {
				farthestPoint = point;
			}
		});

		return farthestPoint;
	}

	sortByDistanceTo(point, direction = 'asc') {
		if(!PointList._isValidSort(direction)) {
			throw new Error('Sort is invalid');
		}

		this.referencePoint = point;
		this.sorting = direction;

		return this;
	}

	addPoint(point) {
		if(point.constructor.name !== 'Point' || !point.isValid()) {
			throw new Error('Point is invalid');
		}

		this.pointSet.add(point);

		return this;
	}

	removePoint(point) {
		this.pointSet.delete(point);

		return this;
	}

	*[Symbol.iterator]() {
		var temporaryPointList = new PointList();

		for(let item of this.pointSet.entries()) {
			temporaryPointList.addPoint(item[0]);
		}

		while(temporaryPointList.pointSet.size > 0) {
			if(this.sorting === 'asc') {
				let closestPoint = temporaryPointList.getClosestPointTo(this.referencePoint);
				yield closestPoint;
				temporaryPointList.removePoint(closestPoint);

				continue;
			}

			let farthestPoint = temporaryPointList.getFarthestPointFrom(this.referencePoint);
			yield farthestPoint;
			temporaryPointList.removePoint(farthestPoint);
		}
    }

    count() {
    	return this.pointSet.size;
    }

    toArray() {
    	var result = [];

    	for (let point of this) {
    		result.push(point);
    	}

    	return result;
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