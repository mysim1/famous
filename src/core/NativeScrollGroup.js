/**
 * Created by lundfall on 10/4/16.
 */
define(function (require, exports, module) {
  var Group = require('./Group.js');

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

  NativeScrollGroup.prototype = Object.create(Group.prototype);

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
      element.scrollTop = offset || this._cachedScrollOffset;
      this._cachedScrollOffset = undefined;
    } else {
      /* Save to cache and set on deploy instead */
      this._cachedScrollOffset = offset;
    }
  };

  NativeScrollGroup.prototype.getScrollOffset = function getScrollOffset() {
    var element = this._element;
    if (element) {
      return element.scrollTop;
    }
    return 0;
  };




  NativeScrollGroup.prototype.elementClass = 'famous-native-scroller';
  module.exports = NativeScrollGroup;
});
