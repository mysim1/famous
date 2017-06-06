/**
 * Created by lundfall on 02/06/2017.
 */


define(function (require, exports, module) {

  /**
   * Singleton class optimized for high performance in DOM updates. All DOM updates that are done through this class will
   * be cached and can be flushed at the same order the instructions came in.
   *
   *
   * @type {{}}
   */
  var DOMBuffer = {};
  var enqueuedOperations = [];



  DOMBuffer.assignProperty = function (object, property, value) {
    enqueuedOperations.push({data: [object, property, value], operation: 'assignProperty'});
  };

  DOMBuffer.setAttribute = function (element, attribute, value) {
    enqueuedOperations.push({data: [element, attribute, value], operation: 'setAttribute'});
  };

  DOMBuffer.addToObject = function (object, value) {
    enqueuedOperations.push({data: [object, value], operation: 'addToObject'});
  };

  DOMBuffer.removeFromObject = function (object, attribute) {
    enqueuedOperations.push({data: [object, attribute], operation: 'removeFromObject'});
  };

  DOMBuffer.removeAttribute = function (element, attribute) {
    enqueuedOperations.push({data: [element, attribute], operation: 'removeAttribute'});
  };

  DOMBuffer.removeChild = function (parent, childToRemove) {
    enqueuedOperations.push({data: [parent, childToRemove], operation: 'removeChild'});
  };

  DOMBuffer.appendChild = function (parent, childToAppend) {
    enqueuedOperations.push({data: [parent, childToAppend], operation: 'appendChild'});
  };

  DOMBuffer.insertBefore = function (parent, childBefore, childToInsert) {
    enqueuedOperations.push({data: [parent, childBefore, childToInsert], operation: 'insertBefore'});
  };

  DOMBuffer.flushUpdates = function () {
    for(var index = 0; index < enqueuedOperations.length ; index++){
      var enqueuedOperation = enqueuedOperations[index];
      var operationName = enqueuedOperation.operation;
      var data = enqueuedOperation.data;
      switch (operationName){
        case 'appendChild':
          data[0].appendChild(data[1]);
          break;
        case 'insertBefore':
          data[0].insertBefore(data[1], data[2]);
          break;
        case 'setAttribute':
          data[0].setAttribute(data[1], data[2]);
          break;
        case 'removeChild':
          if(data[0].childNodes.length && data[0].contains(data[1])){
            data[0].removeChild(data[1]);
          }
          break;
        case 'removeAttribute':
          data[0].removeAttribute(data[1]);
          break;
        case 'addToObject':
          data[0].add(data[1]);
          break;
        case 'removeFromObject':
          data[0].remove(data[1]);
          break;
        case 'assignProperty':
          data[0][data[1]] = data[2];
          break;
      }
    }
    enqueuedOperations = [];
    };

  module.exports = DOMBuffer;
});

