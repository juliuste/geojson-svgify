'use strict'

const fs = require('fs')
const path = require('path')
const bbox = require('@turf/bbox')
const h = require('virtual-hyperscript-svg')
const svgify = require('../index')
const toHTML = require('virtual-dom-stringify')
const disparity = require('disparity')

// data from https://gist.github.com/pfloh/ae03cdabca0c822d5283
const fixture = fs.readFileSync(path.join(__dirname, 'berlin.svg'), 'utf8')

const assertEqualString = (a, b) => {
	if (a === b) return
	process.stdout.write(disparity.chars(a, b) + '\n')
	process.exit(1)
}



const geojson = require('./berlin.json')
const polylines = svgify(geojson, {lineWidth: .001})

const [west, south, east, north] = bbox(geojson)
const [left, top] = svgify.defaults.projection([west, north])
const [right, bottom] = svgify.defaults.projection([east, south])
const width = right - left
const height = bottom - top

const generated = toHTML(h('svg', {
	width: 600,
	height: Math.abs(height) / Math.abs(width) * 600,
	viewBox: [left, top, width, height].join(',')
}, polylines))

assertEqualString(generated, fixture)
