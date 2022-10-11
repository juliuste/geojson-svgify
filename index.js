'use strict'

const svg = require('virtual-hyperscript-svg')
const mercator = require('projections/mercator')
const flatten = require('geojson-flatten')

const invalidType = (type) => {
	return new Error(`The ${type} GeoJSON type is not supported yet.`)
}
const invalidGeometryType = (type) => {
	return new Error(`The ${type} GeoJSON geometry type is not supported yet.`)
}

const defaults = {
	computeProps: (feature) => ({
		className: 'shape',
	}),
	projection: ([lon, lat]) => {
		const { x, y } = mercator({ lon, lat })
		return [x * 100, y * 100] // todo
	},
}

const draw = (geojson, opt) => {
	opt = Object.assign({}, defaults, opt || {})

	const flattened = flatten(geojson)
	const polylines = []

	if (flattened.type !== 'FeatureCollection') throw invalidType(flattened.type)
	for (const feature of flattened.features) {
		const g = feature.geometry
		if (g.type !== 'Polygon') throw invalidGeometryType(g.type)

		const points = g.coordinates[0]
			.map(opt.projection)
			.map((point) => point.join(','))
			.join(' ')
		const props = opt.computeProps(feature)

		const el = svg('polyline', Object.assign({}, props, { points }))
		polylines.push(el)
	}

	return polylines
}

module.exports = Object.assign(draw, { defaults })
