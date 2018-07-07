# greatCircle
A JavaScript toolbox for working with geographical entities. Currently supports single points, calculating their distance and sorting them by distance. Ideas for future expansion:

* Calculating Bearing between points
* Taking into account differences in altitude
* Calculating sunrise and sunset at a given point in time for a geographical position

[![Build Status](https://travis-ci.org/kevinulrich/greatCircle.svg?branch=master)](https://travis-ci.org/kevinulrich/greatCircle)
[![codecov](https://codecov.io/gh/kevinulrich/greatCircle/branch/master/graph/badge.svg)](https://codecov.io/gh/kevinulrich/greatCircle)
[![Maintainability](https://api.codeclimate.com/v1/badges/954e24edb74d15ead6cb/maintainability)](https://codeclimate.com/github/kevinulrich/greatCircle/maintainability)

```
npm install @kevinulrich/greatcircle
```

# Example usage

This library ships different modules for working with geographical positions. Currently these are: Point, Vector and PointList

## Working with Points

The point constructor accepts an options object, no options actually have to be given. Missing latitude or longitude will default to 0, missing payload will default to an empty object. The payload can be any valid JavaScript object, string or number for example.

```javascript
var myPoint = new greatCircle.Point({
	latitude: 50.0104469, 
	longitude: 8.7194302, 
	payload: 'Stangenpyramide'
});
```

You can make greatCircle calculate a vector between points by using the ```getVectorFrom``` or ```getVectorTo``` methods.

```javascript
var myVector = myPoint.getVectorTo(anotherPoint)
```

greatCircle will help you validate geographical positions. You can simply input your latitude and longitude and it will not only check for valid numbers but also if the given latitude or longitude is within -180 and 180 degrees.

```javascript
var myPoint = new greatCircle.Point({
	latitude: 564.564, 
	longitude: 2, 
	payload: 'Bad Point'
});

console.log(myPoint.isValid());

// Will output false
```

## Working with Vectors

The vector constructor takes two arguments for a starting and an end point. These must be valid Point objects. The order of start an end is very important as a vector is directional. As of 2.0, the library is only able to calculate the distance of a vector so the order is not important right now, but will become important once bearing and other features come into play.

```javascript
var myVector = new greatCircle.Vector(myPoint, anotherPoint);
```

You can not easily calculate the length of the vector by getting the distance. ```getDistance``` will return a number in meters.

```javascript
myVector.getDistance();
```

## Working with PointLists

A pointlist is an aggregate of multiple points and can be used to determine the closest point to another or even sort all points by their distance to a given reference point.

```javascript
var myList = new greatCircle.PointList();

myList.addPoint(myPoint);
myList.addPoint(anotherPoint);

console.log(myList.count());
// Will output 2
```

To sort all points within the list by their distance to or from another point you can use the ```sortByDistanceTo``` method. It will accept two parameters: The reference point to be used and a sorting parameter which accepts ```asc``` or ```desc```, default is ```asc```;

```javascript
myList.sortByDistanceTo(referencePoint, 'desc');
```

To retrieve the contained points, the PointList implements iteration as well as a ```toArray``` method.

```javascript
var sortedPoints = myList.toArray();

for (let point of myList) {
	console.log(point);
}

// Will output all contained points by their distance in reference to the point and sorting given by a previous call to ```sortByDistanceTo```.
```