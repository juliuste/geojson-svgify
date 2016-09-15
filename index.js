'use strict'

const svg = require('virtual-hyperscript-svg')
const mercator = require('mercator-projection').fromLatLngToPoint
const flatten = require('geojson-flatten')



let config = {
	projection: (coords) => {
		const projected = mercator({lng: coords[0], lat: coords[1]})
		return [projected.x, projected.y]
	},
	lineColor: '#000',
	lineWidth: 5
}


const project = (wgsList) => wgsList.map(config.projection)

const parsePoint = (point) => point.join(',')
const parsePointList = (pointList) => pointList.map(parsePoint).join(' ')

const drawPath = (pointList) => {
	return svg('polyline', {
		points: parsePointList(pointList),
		stroke: config.lineColor,
		"stroke-width": config.lineWidth
	})
}

const paths = (geojson) => {
	geojson = flatten(geojson)
	let result = []
	if(geojson.type=='FeatureCollection'){
		for(let feature of geojson.features){
			if(feature.geometry.type=='Polygon'){
				result.push(feature.geometry.coordinates[0])
			}
			else throw new Error('This GeoJSON geometry type is not supported (yet). Type: '+feature.geometry.type)
		}
	}
	else throw new Error('This GeoJSON type is not supported (yet). Type: '+geojson.type)
	return result
}

const draw = (geojson, options) => {
	config = Object.assign({}, config, options || {})

	let result = []
	for(let path of paths(geojson)){
		result.push(drawPath(project(path)))
	}

	return result
}

module.exports = draw