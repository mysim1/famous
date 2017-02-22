/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2015
 */

define(function (require, exports, module) {
  var Context = require('./Context.js');

  /**
   * Internal helper object to Context that handles the process of
   *   creating and allocating DOM elements within a managed div.
   *   Private.
   *
   * @class ElementAllocator
   * @constructor
   * @private
   * @param {Node} container document element in which Famo.us content will be inserted
   */
  function ElementAllocator(container) {
    if (!container) container = document.createDocumentFragment();
    this.container = container;
    this.detachedElementOutputs = {};
    this.detachedContexts = {};

  }

  /**
   * Move the document elements from their original container to a new one.
   *
   * @private
   * @method migrate
   *
   * @param {Node} container document element to which Famo.us content will be migrated
   */
  ElementAllocator.prototype.migrate = function migrate(container) {
    throw new Error('not supported');
    var oldContainer = this.container;
    if (container === oldContainer) return;

    if (oldContainer instanceof DocumentFragment) {
      container.appendChild(oldContainer);
    }
    else {
      while (oldContainer.hasChildNodes()) {
        container.appendChild(oldContainer.firstChild);
      }
    }

    this.container = container;
  };

  /**
   * Allocate an element of specified type from the pool.
   *
   * @private
   * @method allocate
   *
   * @param {String} options.type type of element, e.g. 'div'
   * @param {Boolean} options.insertFirst Whether it should be allocated from the top instead of the bottom
   * or at the end. Defaults to false (at the bottom).
   * @param {Boolean} options.isNested Whether it should allocate a node that already is nested (treated separately)
   * @return {Node} allocated document element
   */
  ElementAllocator.prototype.allocate = function allocate(options) {
    var type = options.type.toLocaleLowerCase();
    var insertFirst = !!options.insertFirst;
    var isNested = !!options.isNested;
    type = type.toLowerCase();
    var detachedList = isNested ? this.detachedContexts : this.detachedElementOutputs;
    if (!(type in detachedList)) detachedList[type] = [];
    var nodeStore = detachedList[type];
    var result;
    if (nodeStore.length > 0 && !insertFirst) {
      result = nodeStore.pop();
    }
    else {
      result = this._allocateNewElementOutput(type, insertFirst);
      if (isNested) {
        result = this._allocateNewAllocator(result);
      }
    }
    return result;
  };

  ElementAllocator.prototype._allocateNewAllocator = function _allocateNewContext(container) {
    return new ElementAllocator(container);
  };

  ElementAllocator.prototype._allocateNewElementOutput = function _allocateNewElementOutput(type, insertFirst) {
    var result = document.createElement(type);
    if (insertFirst) {
      this.container.insertBefore(result, this.container.firstChild);
    } else {
      this.container.appendChild(result);
    }
    return result;
  };

  ElementAllocator.prototype.deallocateAllocator = function deallocateAllocator(allocator) {
    var elementToDeallocate = allocator.container;
    var nodeType = elementToDeallocate.nodeName.toLocaleLowerCase();
    var nodeStore = this.detachedContexts[nodeType];
    nodeStore.push(allocator);
    // this._deallocateElementOfType(elementToDeallocate, nodeType);
  };
  /**
   * De-allocate an element of specified type to the pool.
   *
   * @private
   * @method deallocate
   *
   * @param {Node} element document element to deallocate
   */

  ElementAllocator.prototype.deallocate = function deallocate(element) {
    var nodeType = element.nodeName.toLowerCase();
    var nodeStore = this.detachedElementOutputs[nodeType];
    nodeStore.push(element);
  };

  


  module.exports = ElementAllocator;
});
