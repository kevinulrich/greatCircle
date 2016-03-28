class greatCircle {
	construct(opts) {
		if(typeof opts != 'object') opts = {};

		this.sort = greatCircle._getValidSort(opts.sort);
		this.limit = greatCircle._getValidLimit(opts.sort);
	}

	calc(opts) {
		if(typeof opts.from != 'object' || typeof opts.from.lat == 'undefined' || typeof opts.from.lon == 'undefined') throw "greatCircle: From needs to be an object with at least lat and lon";
		if(typeof opts.to != 'object') throw "greatCircle: To needs to be an object with at least lat and lon";

		var tempSort = typeof opts.sort != 'undefined' ? greatCircle._getValidSort(opts.sort) : this.sort;
		var tempLimit = typeof opts.limit != 'undefined' ? greatCircle._getValidLimit(opts.limit) : this.limit;

		var from = greatCircle._getValidPoint(opts.from);
		var to = greatCircle._getValidPointList(opts.to);

		var distances = greatCircle._getDistanceList(from, to);

		if(tempSort !== false) greatCircle._sortDistanceList(distances);

		return distances;
	}

	static _sortDistanceList(list) {
		return list;
	}

	static _getDistanceList(from, to) {
		from = greatCircle._getValidPoint(from);
		to = greatCircle._getValidPointList(to);

		var distanceList = [];

		for(var item in to) {
			try {
				let distance = greatCircle.getDistanceBetween(from, to[item]);
				distanceList.push({from: from, to: to[item], distance: distance});
			} catch(e) {
				console.error(e);
			}
		}

		return distanceList;
	}

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

		return greatCircle.earthRadius * c;
	}

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
				console.error(e);
			}
		}

		return cleanList;
	}

	static _getValidPoint(point) {
		if(typeof point == 'undefined') throw "greatCircle: No coordinates given";
		if(isNaN(point.lat) || isNaN(point.lon)) throw "greatCircle: Invalid coordinates";
		if(parseFloat(point.lat) < -180 || parseFloat(point.lat) > 180) throw "greatCircle: Invalid coordinates";
		if(parseFloat(point.lon) < -180 || parseFloat(point.lon) > 180) throw "greatCircle: Invalid coordinates";

		var cleanPoint = {lat: parseFloat(point.lat), lon: parseFloat(point.lon)};

		if(typeof point.payload != 'undefined') cleanPoint.payload = point.payload;

		return cleanPoint;
	}

	static _getValidSort(input) {
		return (input && input == 'asc') ? 'asc' : (input && input == 'desc') ? 'desc' : false;
	}

	static _getValidLimit(input) {
		return (typeof input == 'boolean') ? false : (input === null) ? false : isNaN(input) ? false : (parseInt(input) > 0) ? parseInt(input) : false;
	}

	static earthRadius = 6371000;

	static floatToRadians(number) {
		return number * Math.PI / 180;
	}
}