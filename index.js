'use strict'

const svg = require('virtual-hyperscript-svg')
const mercator = require('mercator-projection').fromLatLngToPoint
const flatten = require('geojson-flatten')

const defaults = {
	projection: (coords) => {
		const projected = mercator({lng: coords[0], lat: coords[1]})
		return [projected.x, projected.y]
	},
	lineColor: '#000',
	lineWidth: .1
}

const drawPath = (points, stroke, strokeWidth) =>
	svg('polyline', {
		points: points.map((point) => point.join(',')).join(' '),
		fill: 'none', stroke, "stroke-width": strokeWidth
	})

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

const draw = (geojson, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	return paths(geojson)
	.map((points) => points.map(opt.projection))
	.map((points) => drawPath(points, opt.lineColor, opt.lineWidth))
}

module.exports = Object.assign(draw, {defaults})
