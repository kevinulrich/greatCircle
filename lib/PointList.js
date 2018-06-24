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

	getFarthestPointFrom(point) {
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

	sortByProperty() {

	}

	addPoint(point) {
		if(point.constructor.name !== 'Point') {
			throw new Error('Point is invalid');
		}

		this.pointSet.add(point);

		return this;
	}

	removePoint() {
		this.pointSet.delete(point);

		return this;
	}

	toArray() {
		var sortedArray = [];

		return sortedArray;
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