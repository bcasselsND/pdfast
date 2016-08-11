# About

Estimate probability density function (pdf) using triangular kernel, in O(N + K).

Where:

  * N: number of element in the sample.
  * K: number of bars to represent the pdf.

# API

## create(arr, options)

Create pdf with given array and options.

Options:

  * min: min value for the pdf's x range. If resulting pdf won't fit, the pdf's left part will be squeezed, as [http://stats.stackexchange.com/questions/65866/good-methods-for-density-plots-of-non-negative-variables-in-r](described here).
  * min: max value for the pdf's x range. If resulting pdf won't fit, the pdf's right will be squeezed.
  * size: number of bars to represent the pdf.
  * width: determine how many bar to the left and right does an element affect, similar to *bandwith* in kernel density estimation.

```js
var arr = [1, 2, 3, 3, 4, 5, 5, 5, 6, 8, 9, 9];
var options = {
  min: 0,
  max: 10,
  size: 12,
  width: 2
};

var pdf = pdfast.create(arr, options);
```

`pdf`'s value:
```
/*
[ { x: 0, y: 0.020833333333333332 },
  { x: 0.9090909090909091, y: 0.0625 },
  { x: 1.8181818181818181, y: 0.10416666666666667 },
  { x: 2.727272727272727, y: 0.125 },
  { x: 3.6363636363636362, y: 0.14583333333333334 },
  { x: 4.545454545454545, y: 0.16666666666666666 },
  { x: 5.454545454545454, y: 0.10416666666666667 },
  { x: 6.363636363636363, y: 0.041666666666666664 },
  { x: 7.2727272727272725, y: 0.08333333333333333 },
  { x: 8.181818181818182, y: 0.10416666666666667 },
  { x: 9.09090909090909, y: 0.041666666666666664 },
  { x: 10, y: 0 } ]
 */
```
![pdf-chart][https://github.com/gyosh/pdfast/blob/master/res/sample.png?raw=true "PDF chart"]

## getExpectedValueFromPdf(pdf)

```js
expect(
  pdfast.getExpectedValueFromPdf([
    {x: 1, y: 0.2},
    {x: 2, y: 0.3},
    {x: 3, y: 0.3},
    {x: 4, y: 0.2},
    {x: 5, y: 0.0}
  ])
).closeTo(2.5, 1e-8);
```

## getXWithLeftTailArea(pdf, area)

```js
var pdf = [
  {x: 1, y: 0.2},
  {x: 2, y: 0.4},
  {x: 3, y: 0.3},
  {x: 4, y: 0.075},
  {x: 5, y: 0.025}
];

expect(statisticUtil.getXWithLeftTailArea(pdf, 0)).equal(1);
expect(statisticUtil.getXWithLeftTailArea(pdf, 0.12)).equal(1);
expect(statisticUtil.getXWithLeftTailArea(pdf, 0.19)).equal(1);
expect(statisticUtil.getXWithLeftTailArea(pdf, 0.21)).equal(2);
expect(statisticUtil.getXWithLeftTailArea(pdf, 0.95)).equal(4);
expect(statisticUtil.getXWithLeftTailArea(pdf, 1)).equal(5);
```

# License
MIT