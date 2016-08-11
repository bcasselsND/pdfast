'use strict';

var DEFAULT_SIZE = 50;
var DEFAULT_WIDTH = 2;

var helper = require('./helper');

// Triangle
function kernel(x) {
  return 1 - Math.abs(x);
}

module.exports.create = function (arr, options) {
  options = options || {};

  if (!arr || (arr.length === 0)) {
    return [];
  }

  var relaxMin = false;
  var relaxMax = false;

  var size = helper.isNumber(options.size) ? options.size : DEFAULT_SIZE;
  var width = helper.isNumber(options.width) ? options.width : DEFAULT_WIDTH;
  var min = helper.isNumber(options.min) ? options.min : (relaxMin = true, helper.findMin(arr));
  var max = helper.isNumber(options.max) ? options.max : (relaxMax = true, helper.findMax(arr));

  var range = max - min;
  var step = range / (size - 1);
  if (range === 0) {
    // Special case...
    return [{x: min, y: 1}];
  }

  // Relax?
  if (relaxMin) {
    min = min - 2 * width * step;
  }
  if (relaxMax) {
    max = max - 2 * width * step;
  }

  // Recompute?
  if (relaxMin || relaxMax) {
    range = max - min;
    step = range / (size - 1);
  }

  // Good to go

  var buckets = [];
  for (var i = 0; i < size; i++) {
    buckets.push({
      x: min + i * step,
      y: 0
    });
  }

  var xToBucket = function (x) {
    return Math.floor((x - min) / step);
  };

  var partialArea = generatePartialAreas(kernel, width);
  var fullArea = partialArea[width];
  var c = partialArea[width-1] - partialArea[width-2];

  var initalValue = 0;
  arr.forEach(function (x) {
    var bucket = xToBucket(x);

    var start = Math.max(bucket - width, 0);
    var mid = bucket;
    var end = Math.min(bucket + width, buckets.length - 1);

    var leftBlockCount = start - (bucket - width);
    var rightBlockCount = (bucket + width) - end;
    var spilledAreaLeft = partialArea[-width-1 + leftBlockCount] || 0;
    var spilledAreaRight = partialArea[-width-1 + rightBlockCount] || 0;
    var weight = fullArea / (fullArea - spilledAreaLeft - spilledAreaRight);

    if (leftBlockCount > 0) {
      initalValue += weight * (leftBlockCount - 1) * c;
    }

    // Add grads
    var startGradPos = Math.max(0, bucket-width+1);
    if (startGradPos < buckets.length) {
      buckets[startGradPos].y += weight * 1 * c;
    }
    if (mid + 1 < buckets.length) {
      buckets[mid + 1].y -= weight * 2 * c;
    }
    if (end + 1 < buckets.length) {
      buckets[end + 1].y += weight * 1 * c;
    }
  });

  var accumulator = initalValue;
  var gradAccumulator = 0;
  var area = 0;
  buckets.forEach(function (bucket) {
    gradAccumulator += bucket.y;
    accumulator += gradAccumulator;

    bucket.y = accumulator;
    area += accumulator;
  });

  buckets.forEach(function (bucket) {
    bucket.y /= area;
  });

  return buckets;
};

function generatePartialAreas(kernel, width) {
  var partialAreas = {};

  var accumulator = 0;
  for (var i = -width; i <= width; i++) {
    accumulator += kernel(i/width);
    partialAreas[i] = accumulator;
  }

  return partialAreas;
}

module.exports.getExpectedValueFromPdf = function (pdf) {
  if (!pdf || (pdf.length === 0)) {
    return undefined;
  }

  var expected = 0;

  pdf.forEach(function (obj) {
    expected += obj.x * obj.y;
  });

  return expected;
};

module.exports.getXWithLeftTailArea = function (pdf, area) {
  if (!pdf || (pdf.length === 0)) {
    return undefined;
  }

  var accumulator = 0;
  var last = 0;
  for (var i = 0; i < pdf.length; i++) {
    last = i;
    accumulator += pdf[i].y;

    if (accumulator >= area) {
      break;
    }
  }

  return pdf[last].x;
};