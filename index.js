'use strict'

const svg = require('virtual-hyperscript-svg')
const mercator = require('projections/mercator')
const flatten = require('geojson-flatten')

const drawPath = (points, className) =>
	svg('polyline', {
		points: points.map((point) => point.join(',')).join(' '),
		className
	})

const paths = (geojson, projection) => {
	geojson = flatten(geojson)
	const result = []
	if(geojson.type=='FeatureCollection'){
		for(let feature of geojson.features){
			if(feature.geometry.type=='Polygon'){
				const projected = feature.geometry.coordinates[0].map(projection)
				result.push(projected)
			}
			else throw new Error('This GeoJSON geometry type is not supported (yet). Type: '+feature.geometry.type)
		}
	}
	else throw new Error('This GeoJSON type is not supported (yet). Type: '+geojson.type)
	return result
}

const defaults = {
	projection: ([lon, lat]) => {
		const {x, y} = mercator({lon, lat})
		return [x * 100, y * 100] // todo
	},
	className: 'shape'
}

const draw = (geojson, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	return paths(geojson, opt.projection)
	.map((points) => drawPath(points, opt.className))
}

module.exports = Object.assign(draw, {defaults})
