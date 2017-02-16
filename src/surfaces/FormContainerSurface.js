define(function(require, exports, module) {
    var ContainerSurface = require('./ContainerSurface');
    var staticInherits = require('../utilities/StaticInherit.js').staticInherits;

    function FormContainerSurface(options) {
        if (options) this._method = options.method || '';
        ContainerSurface.apply(this, arguments);
    }

    staticInherits(FormContainerSurface, ContainerSurface);
    FormContainerSurface.prototype.constructor = FormContainerSurface;

    FormContainerSurface.prototype.elementType = 'form';

    FormContainerSurface.prototype.deploy = function deploy(target) {
        if (this._method) target.method = this._method;
        return ContainerSurface.prototype.deploy.apply(this, arguments);
    };

    module.exports = FormContainerSurface;
});
