# geojson-svgify

Convert GeoJSON geometry paths to SVG polyline strings.

[![npm version](https://img.shields.io/npm/v/geojson-svgify.svg)](https://www.npmjs.com/package/geojson-svgify)
[![dependency status](https://img.shields.io/david/juliuste/geojson-svgify.svg)](https://david-dm.org/juliuste/geojson-svgify)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/geojson-svgify.svg)](https://david-dm.org/juliuste/geojson-svgify#info=devDependencies)
[![MIT License](https://img.shields.io/badge/license-MIT-black.svg)](https://opensource.org/licenses/MIT)

## Installation

```shell
npm install geojson-svgify
```

## Usage

```js
const svgify = require('geojson-svgify')
const geoJSON = require('path/file.json')

const options = {
	lineWidth: 10, 		// default: 5
	lineColor: '#f60',	// default: #000
	projection: ([lon, lat]) => [x, y] // default: mercator transformation
}

console.log(svgify(geoJSON, options))
```

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/geojson-svgify/issues).