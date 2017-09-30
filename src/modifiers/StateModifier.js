/* We respect the original MPL-2.0 open-source license with regards to most of this file source-code.
 * any variations, changes and additions are NPOSL-3 licensed.
 *
 * @author Hans van den Akker
 * @license NPOSL-3.0
 * @copyright Famous Industries, Inc. 2015, Arva 2015-2017
 * This class originated from the Famous 3.5 Async Render Engine built by Famous Industries. We've ported
 * this class to ES6 for purpose of unifying Arva's development environment.
 */

 import Modifier from '../core/Modifier.js';
 import Transform from '../core/Transform.js';
 import Transitionable from '../transitions/Transitionable.js';
 import TransitionableTransform from '../transitions/TransitionableTransform.js';

export default class StateModifier {

    /**
     *  A collection of visual changes to be
     *    applied to another renderable component, strongly coupled with the state that defines
     *    those changes. This collection includes a
     *    transform matrix, an opacity constant, a size, an origin specifier, and an alignment specifier.
     *    StateModifier objects can be added to any RenderNode or object
     *    capable of displaying renderables.  The StateModifier's children and descendants
     *    are transformed by the amounts specified in the modifier's properties.
     *
     * @class StateModifier
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {Transform} [options.transform] affine transformation matrix
     * @param {Number} [options.opacity]
     * @param {Array.Number} [options.origin] origin adjustment
     * @param {Array.Number} [options.align] align adjustment
     * @param {Array.Number} [options.size] size to apply to descendants
     * @param {Array.Number} [options.propportions] proportions to apply to descendants
     */
    constructor(options) {
        this._transformState = new TransitionableTransform(Transform.identity);
        this._opacityState = new Transitionable(1);
        this._originState = new Transitionable([0, 0]);
        this._alignState = new Transitionable([0, 0]);
        this._sizeState = new Transitionable([0, 0]);
        this._proportionsState = new Transitionable([0, 0]);

        this._modifier = new Modifier({
            transform: this._transformState,
            opacity: this._opacityState,
            origin: null,
            align: null,
            size: null,
            proportions: null
        });

        this._hasOrigin = false;
        this._hasAlign = false;
        this._hasSize = false;
        this._hasProportions = false;

        if (options) {
            if (options.transform) this.setTransform(options.transform);
            if (options.opacity !== undefined) this.setOpacity(options.opacity);
            if (options.origin) this.setOrigin(options.origin);
            if (options.align) this.setAlign(options.align);
            if (options.size) this.setSize(options.size);
            if (options.proportions) this.setProportions(options.proportions);
        }
    }

    /**
     * Set the transform matrix of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setTransform
     *
     * @param {Transform} transform Transform to transition to.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} [callback] callback to call after transition completes
     * @return {StateModifier} this
     */
    setTransform(transform, transition, callback) {
        this._transformState.set(transform, transition, callback);
        return this;
    }

    /**
     * Set the opacity of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOpacity
     *
     * @param {Number} opacity Opacity value to transition to.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    setOpacity(opacity, transition, callback) {
        this._opacityState.set(opacity, transition, callback);
        return this;
    }

    /**
     * Set the origin of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setOrigin
     *
     * @param {Array.Number} origin two element array with values between 0 and 1.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    setOrigin(origin, transition, callback) {
        if (origin === null) {
            if (this._hasOrigin) {
                this._modifier.originFrom(null);
                this._hasOrigin = false;
            }
            return this;
        }
        else if (!this._hasOrigin) {
            this._hasOrigin = true;
            this._modifier.originFrom(this._originState);
        }
        this._originState.set(origin, transition, callback);
        return this;
    }

    /**
     * Set the alignment of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setAlign
     *
     * @param {Array.Number} align two element array with values between 0 and 1.
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    setOrigin(align, transition, callback) {
        if (align === null) {
            if (this._hasAlign) {
                this._modifier.alignFrom(null);
                this._hasAlign = false;
            }
            return this;
        }
        else if (!this._hasAlign) {
            this._hasAlign = true;
            this._modifier.alignFrom(this._alignState);
        }
        this._alignState.set(align, transition, callback);
        return this;
    }

    /**
     * Set the size of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setSize
     *
     * @param {Array.Number} size two element array of [width, height]
     * @param {Transitionable} transition object of type {duration: number, curve:
     *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
     *    instantaneous.
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    setSize(size, transition, callback) {
        if (size === null) {
            if (this._hasSize) {
                this._modifier.sizeFrom(null);
                this._hasSize = false;
            }
            return this;
        }
        else if (!this._hasSize) {
            this._hasSize = true;
            this._modifier.sizeFrom(this._sizeState);
        }
        this._sizeState.set(size, transition, callback);
        return this;
    }

    /**
     * Set the proportions of this modifier, either statically or
     *   through a provided Transitionable.
     *
     * @method setProportions
     *
     * @param {Array.Number} proportions two element array with values between 0 and 1.
     * @param {Transitionable} transition Valid transitionable object
     * @param {Function} callback callback to call after transition completes
     * @return {StateModifier} this
     */
    setProportions(proportions, transition, callback) {
        if (proportions === null) {
            if (this._hasProportions) {
                this._modifier.proportionsFrom(null);
                this._hasProportions = false;
            }
            return this;
        }
        else if (!this._hasProportions) {
            this._hasProportions = true;
            this._modifier.proportionsFrom(this._proportionsState);
        }
        this._proportionsState.set(proportions, transition, callback);
        return this;
    }

    /**
     * Stop the transition.
     *
     * @method halt
     */
    halt() {
        this._transformState.halt();
        this._opacityState.halt();
        this._originState.halt();
        this._alignState.halt();
        this._sizeState.halt();
        this._proportionsState.halt();
    }

    /**
     * Get the current state of the transform matrix component.
     *
     * @method getTransform
     * @return {Object} transform provider object
     */
    getTransform() {
        return this._transformState.get();
    }

    /**
     * Get the destination state of the transform component.
     *
     * @method getFinalTransform
     * @return {Transform} transform matrix
     */
    StateModifier.prototype.getFinalTransform = function getFinalTransform() {
        return this._transformState.getFinal();
    }

    /**
     * Get the current state of the opacity component.
     *
     * @method getOpacity
     * @return {Object} opacity provider object
     */
    getOpacity() {
        return this._opacityState.get();
    }

    /**
     * Get the current state of the origin component.
     *
     * @method getOrigin
     * @return {Object} origin provider object
     */
    getOrigin() {
        return this._hasOrigin ? this._originState.get() : null;
    }

    /**
     * Get the current state of the align component.
     *
     * @method getAlign
     * @return {Object} align provider object
     */
    getAlign() {
        return this._hasAlign ? this._alignState.get() : null;
    }

    /**
     * Get the current state of the size component.
     *
     * @method getSize
     * @return {Object} size provider object
     */
    getSize() {
        return this._hasSize ? this._sizeState.get() : null;
    }

    /**
     * Get the current state of the propportions component.
     *
     * @method getProportions
     * @return {Object} size provider object
     */
    getProportions() {
        return this._hasProportions ? this._proportionsState.get() : null;
    }

    /**
     * Return render spec for this StateModifier, applying to the provided
     *    target component.  This is similar to render() for Surfaces.
     *
     * @private
     * @method modify
     *
     * @param {Object} target (already rendered) render spec to
     *    which to apply the transform.
     * @return {Object} render spec for this StateModifier, including the
     *    provided target
     */
    modify(target) {
        return this._modifier.modify(target);
    }
}
