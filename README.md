# thewall-templater-dustjs

[![Circle CI](https://circleci.com/gh/holidayextras/the-wall-templater-dustjs/tree/master.svg?style=svg&circle-token=0d2db228af54ee6c66ab83dba0cafcb965f1f573)](https://circleci.com/gh/holidayextras/the-wall-templater-dustjs/tree/master)

## About

This is a template handler compatible with [The Wall](https://github.com/holidayextras/the-wall).

Inside here, you have the template handler that conforms to the interface expected by the wall, it has the template engine (in this case Dust) included and any additional template "helpers" as required.

## Getting Started

If you want to work on this repo you will need to install the dependencies

```
$ git clone git@github.com:holidayextras/the-wall-templater-dustjs.git
```

and then fetch the dependencies

```
$ npm install
```

To include this module in your project add the following to your package.json

```
"thewall-templater-dustjs": "git+ssh://git@github.com:holidayextras/the-wall-templater-dustjs.git"
```


## Documentation

### Helpers

- _calcDistance
	A helper to calc straight distance using two locations with lat and long.

- _loadTemplate
	A special helper so we can load templates with a namespace.

- _formatDate
	using `momentjs` this helper takes a date string and a format and returns a formatted date string.

- _dateDifferential
	using `momentjs` this helper takes a startDate and endDate to calculate the days difference

- _formatNumber
	using 'numeraljs' this helpers takes a number string and a format and returns a formatted date string.

- _forEach
	Itterate through provided object/array/string.

- _removeAllRoomRatesExceptCheapest
	Find cheapest hotel and strip rest from api reply. Should be a temporary solution, too specific.


## Tests

Tests will run using the default grunt task but can also be called stand-alone using:
```
$ npm test
```

## Contributing

Code is linted checked against the style guide with [make-up](https://github.com/holidayextras/make-up), running npm test will run all tests required.


## License
Copyright (c) 2014 Shortbreaks
Licensed under the MIT license.
