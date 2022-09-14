'use strict'

const fs = require('fs')
const path = require('path')
const bbox = require('@turf/bbox')
const h = require('virtual-hyperscript-svg')
const mercator = require('projections/mercator')
const svgify = require('../index')
const toHTML = require('virtual-dom-stringify')
const disparity = require('disparity')

// data from https://gist.github.com/pfloh/ae03cdabca0c822d5283
const fixture = fs.readFileSync(path.join(__dirname, 'berlin.svg'), 'utf8').trim()

const assertEqualString = (a, b) => {
	if (a === b) return
	process.stdout.write(disparity.chars(a, b) + '\n')
	process.exit(1)
}



const projection = ([lon, lat]) => {
	const {x, y} = mercator({lon, lat})
	// Rounding floating point errors to make the tests robust.
	return [
		Math.round(x * 1000000) / 10000,
		Math.round(y * 1000000) / 10000
	]
}

const geojson = require('./berlin.json')
const polylines = svgify(geojson, {projection})

const [west, south, east, north] = bbox(geojson)
const [left, top] = svgify.defaults.projection([west, north])
const [right, bottom] = svgify.defaults.projection([east, south])
const width = right - left
const height = bottom - top

const styles = h('style', {}, `
	.shape {
		stroke: black;
		stroke-width: .001;
		fill: none;
	}
`)

const generated = toHTML(h('svg', {
	width: 600,
	height: Math.abs(height) / Math.abs(width) * 600,
	viewBox: [left, top, width, height].join(',')
}, [].concat(styles, polylines)))

assertEqualString(generated, fixture)

{
	const berlin2Geojson = require('./berlin2.geo.json')
	const berlin2Expected = fs.readFileSync(path.join(__dirname, 'berlin2.svg'), 'utf8').trim()

	const polylines = svgify(geojson, {projection})

	const [west, south, east, north] = bbox(berlin2Geojson)
	const [left, top] = svgify.defaults.projection([west, north])
	const [right, bottom] = svgify.defaults.projection([east, south])
	const width = right - left
	const height = bottom - top

	const styles = h('style', {}, `
		.shape {
			stroke: black;
			stroke-width: .001;
			fill: none;
		}
	`)

	const berlin2Svg = toHTML(h('svg', {
		width: 600,
		height: Math.abs(height) / Math.abs(width) * 600,
		viewBox: [left, top, width, height].join(',')
	}, [].concat(styles, polylines)))

	assertEqualString(berlin2Svg, berlin2Expected)
}

console.info('seems to work ✓')
