# geojson-svgify

**Convert [GeoJSON](http://geojson.org/) to [virtual-dom](https://github.com/Matt-Esch/virtual-dom#virtual-dom) `<polyline>` nodes** using the projection of your choice.

[![npm version](https://img.shields.io/npm/v/geojson-svgify.svg)](https://www.npmjs.com/package/geojson-svgify)
[![build status](https://img.shields.io/travis/juliuste/geojson-svgify.svg)](https://travis-ci.org/juliuste/geojson-svgify)
[![dependency status](https://img.shields.io/david/juliuste/geojson-svgify.svg)](https://david-dm.org/juliuste/geojson-svgify)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/geojson-svgify.svg)](https://david-dm.org/juliuste/geojson-svgify#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/geojson-svgify.svg?style=flat)](LICENSE)

## Installation

```shell
npm install geojson-svgify
```

## API

```
svgify(geojson, [options])
```

`geojson` must be an object in the [GeoJSON format](http://geojson.org/). `options` may have the following keys:

- `projection` – A function with the signature `([longitude, latitude]) => [x, y]`. Default: [`mercator-projection`](https://github.com/zacbarton/node-mercator-projection#readme)
- `lineColor` – Any [CSS-compatible color](https://developer.mozilla.org/en-US/docs/Web/CSS/color). Default: `#000`
- `lineWidth` – Any [SVG-compatible stroke width](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-width). Default: `.1`

## Guide

Let's assume you have GeoJSON data.

```js
const geoJSON = require('path/to/geojson-file.json')
```

`svgify` lets you pass in any [projection](https://en.wikipedia.org/wiki/Map_projection); **The default projection is [`mercator-projection`](https://github.com/zacbarton/node-mercator-projection#readme)**. For demonstration purposes, we are *not* going to project our coordinates:

```js
const myProjection = ([lon, lat]) => [lon, lat]
```

The GeoJSON you pass in will be flattened using [`geojson-flatten`](https://github.com/mapbox/geojson-flatten#geojson-flatten).

```js
const svgify = require('geojson-svgify')

const polylines = svgify(geoJSON, {
    lineWidth: 10,      // default is 5
    lineColor: '#f60',  // default is '#000'
    projection: myProjection
})
```

**`polylines` will be an array of [virtual-dom](https://github.com/Matt-Esch/virtual-dom#virtual-dom) `<polyline>` nodes.** You may want to wrap them in an `<svg>` that fits their size:

```js
const bbox = require('@turf/bbox')
const h = require('virtual-hyperscript-svg')

const [west, south, east, north] = bbox(geojson)

const [left, top] = svgify.defaults.projection([west, north])
const [right, bottom] = svgify.defaults.projection([east, south])
const width = right - left
const height = bottom - top

const svg = h('svg', {
    width: Math.abs(width) * 100,
    height: Math.abs(height) * 100,
    viewBox: [left, top, width, height].join(',')
}, polylines)
```

If you want to convert the virtual DOM tree to HTML, use [`virtual-dom-stringify`]:

```js
const toHTML = require('virtual-dom-stringify')
const html = toHTML(svg)
```

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/geojson-svgify/issues).
