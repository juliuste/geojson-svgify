'use strict'

const svg = require('virtual-hyperscript-svg')
const mercator = require('projections/mercator')
const flatten = require('geojson-flatten')

const drawPath = (points, props) =>
	svg('polyline', Object.assign({}, props, {
		points: points.map((point) => point.join(',')).join(' ')
	}))

const paths = (geojson, projection, computeProps) => {
	geojson = flatten(geojson)
	const result = []
	if(geojson.type=='FeatureCollection'){
		for(let feature of geojson.features){
			if(feature.geometry.type=='Polygon'){
				const points = feature.geometry.coordinates[0].map(projection)
				const props = computeProps(feature)
				result.push({points, props})
			}
			else throw new Error('This GeoJSON geometry type is not supported (yet). Type: '+feature.geometry.type)
		}
	}
	else throw new Error('This GeoJSON type is not supported (yet). Type: '+geojson.type)
	return result
}

const defaults = {
	computeProps: (feature) => ({
		className: 'shape'
	}),
	projection: ([lon, lat]) => {
		const {x, y} = mercator({lon, lat})
		return [x * 100, y * 100] // todo
	}
}

const draw = (geojson, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	return paths(geojson, opt.projection, opt.computeProps)
	.map(({points, props}) => drawPath(points, props))
}

module.exports = Object.assign(draw, {defaults})
