'use strict'

const svg = require('virtual-hyperscript-svg')
const stringify = require('virtual-dom-stringify')
const mercator = require('mercator-projection').fromLatLngToPoint



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
	return stringify(svg('polyline', {
		points: parsePointList(pointList),
		stroke: config.lineColor,
		"stroke-width": config.lineWidth
	}))
}

const paths = (geojson) => {
	if(geojson.type=='FeatureCollection'){
		for(let feature of geojson.features){
			if(feature.geometry.type=='Polygon'){
				return feature.geometry.coordinates[0]
			}
			if(feature.geometry.type=='MultiPolygon'){
				let result = []
				for(let coordinates of feature.geometry.coordinates){
					for(let path of coordinates){
						result.push(path)
					}
				}
				return result
			}
			throw new Error('This GeoJSON geometry type is not supported (yet). Type: '+feature.geometry.type)
		}
	}
	else throw new Error('This GeoJSON type is not supported (yet). Type: '+geojson.type)
}

const draw = (geojson, options) => {
	config = Object.assign({}, config, options || {})

	let result = ''
	for(let path of paths(geojson)){
		result += drawPath(project(path))
	}

	return result || null
}

module.exports = draw