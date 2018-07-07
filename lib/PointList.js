"use strict";

class PointList {
	constructor() {
		this.pointSet = new Set();
		this.referencePoint = null;
		this.sorting = 'asc';
	}

	getClosestPointTo(targetPoint) {
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

	pop() {
		if(this.referencePoint === null) {
			let point = this.pointSet.values().next().value;
			this.removePoint(point);
			return point;
		}

		if(this.sorting === 'asc') {
			let point = this.getClosestPointTo(this.referencePoint);
			this.removePoint(point);
			return point;
		}

		let point = this.getFarthestPointFrom(this.referencePoint);
		this.removePoint(point);
		return point;
	}

	*[Symbol.iterator]() {
		var temporaryPointList = this.clone();

		while(temporaryPointList.pointSet.size > 0) {
			let nextPoint = temporaryPointList.pop();

			yield nextPoint;
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

    clone() {
    	var newList = new PointList();

    	for(let item of this.pointSet.entries()) {
    		newList.addPoint(item[0]);
    	}

    	newList.referencePoint = this.referencePoint;
    	newList.sorting = this.sorting;

    	return newList;
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