/**
 * Created by lundfall on 10/4/16.
 */
define(function(require, exports, module) {
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
        this._size = context.size;
        Group.prototype.commit.apply(this, arguments);
    };


    NativeScrollGroup.prototype.elementClass = 'famous-native-scroller';
    module.exports = NativeScrollGroup;
});