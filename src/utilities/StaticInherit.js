/**
 * Created by lundfall on 16/02/2017.
 */

/* Patch Object.assign if not present */
var objectAssign = function (target, varArgs) { // .length of function is 2
  'use strict';
  if (target == null) { // TypeError if undefined or null
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var to = Object(target);

  for (var index = 1; index < arguments.length; index++) {
    var nextSource = arguments[index];

    if (nextSource != null) { // Skip over if undefined or null
      for (var nextKey in nextSource) {
        // Avoid bugs when hasOwnProperty is shadowed
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
};

export function staticInherits(inheritsTo, inheritsFrom) {
  objectAssign(inheritsTo, inheritsFrom);
  inheritsTo.prototype = Object.create(inheritsFrom.prototype);
}
