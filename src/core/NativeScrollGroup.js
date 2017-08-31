/**
 * Created by lundfall on 10/4/16.
 */
define(function (require, exports, module) {
  var Group = require('./Group.js');
  var DOMBuffer = require('./DOMBuffer.js');
  var staticInherits = require('../utilities/StaticInherit.js').staticInherits;


  /**
   * A Context designed to contain surfaces and set properties
   *   to be applied to all of them at once with native scrolling.
   *   This is primarily used for specific performance improvements in the rendering {{.
     *   Private.
     *
   * @private
   * @class NativeScorllGroup
   * @extends Group
   * @constructor
   * @param {Object} [options] Surface options array (see Surface})
   */
  function NativeScrollGroup(options) {
    Group.call(this, options);
  }

  staticInherits(NativeScrollGroup, Group);

  NativeScrollGroup.prototype.commit = function commit(context) {
    this._surfaceSize = context.size;
    this.on('deploy', function () {
      if(this._cachedScrollOffset){
        this.setScrollOffset();
      }
    }.bind(this));
    Group.prototype.commit.apply(this, arguments);
  };

  /**
   * Sets the scroll offset
   * @param offset. Defaults to the old scroll offset that was set when there wasn't any element.
   */

  NativeScrollGroup.prototype.setScrollOffset = function setScrollOffset(offset) {

    var element = this._element;
    if (element) {
      DOMBuffer.assignProperty(element, 'scrollTop', offset || this._cachedScrollOffset);
      this._cachedScrollOffset = undefined;
    } else {
      /* Save to cache and set on deploy instead */
      this._cachedScrollOffset = offset;
    }
  };

  /**
   * Hack to force an element redraw that fixes certain bug for elements getting stuck on their current scrollOffset
   */
  NativeScrollGroup.prototype.forceScrollOffsetInvalidation = function forceScrollOffsetInvalidation() {
    var element = this._element;
    if (element) {
      var disp = element.style.display;
      element.style.display = 'none';
      var trick = element.offsetHeight;
      element.style.display = disp;
    }
  };


  NativeScrollGroup.prototype.getScrollOffset = function getScrollOffset() {
    var element = this._element;
    if (element) {
      return element.scrollTop;
    }
    return 0;
  };

  NativeScrollGroup.prototype.getMaxScrollOffset = function getScrollOffset() {
    var element = this._element;
    if (element) {
      return element.scrollHeight - this._surfaceSize[1];
    }
    return 0;
  };

  NativeScrollGroup.prototype.getScrollHeight = function getScrollHeight() {
    return this._element &&  this._element.scrollHeight || 0;
  };

  NativeScrollGroup.prototype.scrollToBottom = function getScrollOffset() {
    var element = this._element;
    if (element) {
      this.setScrollOffset(element.scrollHeight);
    }
    return 0;
  };/**/


  NativeScrollGroup.prototype.elementClass = 'famous-native-scroller';
  module.exports = NativeScrollGroup;
});
