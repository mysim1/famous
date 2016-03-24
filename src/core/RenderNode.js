/* */
var Entity = require('./Entity');
var SpecParser = require('./SpecParser');


function RenderNode(object) {
  this._object = null;
  this._child = null;
  this._hasMultipleChildren = false;
  this._isRenderable = false;
  this._isModifier = false;
  this._resultCache = {};
  this._cleanUpFlags = {};
  this._childResult = null;
  if (object)
    this.set(object);
}
RenderNode.prototype.add = function add(child) {
  var childNode = child instanceof RenderNode ? child : new RenderNode(child);
  if (this._child instanceof Array)
    this._child.push(childNode);
  else if (this._child) {
    this._child = [this._child, childNode];
    this._hasMultipleChildren = true;
    this._childResult = [];
  } else
    this._child = childNode;
  return childNode;
};
RenderNode.prototype.get = function get() {
  return this._object || (this._hasMultipleChildren ? null : this._child ? this._child.get() : null);
};
RenderNode.prototype.set = function set(child) {
  this._childResult = null;
  this._hasMultipleChildren = false;
  this._isRenderable = child.render ? true : false;
  this._isModifier = child.modify ? true : false;
  this._object = child;
  this._child = null;
  if (child instanceof RenderNode)
    return child;
  else
    return this;
};
RenderNode.prototype.getSize = function getSize() {
  var result = null;
  var target = this.get();
  if (target && target.getSize)
    result = target.getSize();
  if (!result && this._child && this._child.getSize)
    result = this._child.getSize();
  return result;
};
function _applyCommit(spec, context, cacheStorage, cleanUpFlags) {
  var result = SpecParser.parse(spec, context);
  var keys = Object.keys(result);
  for(let id in cacheStorage){
    if(!(result[id]) && cleanUpFlags[id] !== false){
      _markCleanUpFlags(id, cacheStorage[id], cleanUpFlags);
      delete cacheStorage[id];
    }
  }
  for (var i = 0; i < keys.length; i++) {
    var id = keys[i];
    var childNode = Entity.get(id);
    var commitParams = result[id];
    commitParams.allocator = context.allocator;
    var commitResult = childNode.commit(commitParams);

    cacheStorage[id] = cacheStorage[id] || {};

    if (commitResult) {
      _applyCommit(commitResult, context, cacheStorage[id], cleanUpFlags);
    } else {
      cleanUpFlags[id] = false;
    }
  }
}
function _markCleanUpFlags(rootId, tree, cleanUpFlags){
  cleanUpFlags[rootId] = cleanUpFlags[rootId] === undefined;
  for(let childId in tree){
    _markCleanUpFlags(childId, tree[childId], cleanUpFlags);
    delete tree[childId];
  }
}
RenderNode.prototype.commit = function commit(context) {
  for(let id in this._cleanUpFlags){
    if(this._cleanUpFlags[id]){
      let object = Entity.get(id);
      if (object.cleanup)
        object.cleanup(context.allocator);
    }
  }
  this._cleanUpFlags = {};
  _applyCommit(this.render(), context, this._resultCache, this._cleanUpFlags);
};
RenderNode.prototype.render = function render() {
  if (this._isRenderable)
    return this._object.render();
  var result = null;
  if (this._hasMultipleChildren) {
    result = this._childResult;
    var children = this._child;
    for (var i = 0; i < children.length; i++) {
      result[i] = children[i].render();
    }
  } else if (this._child)
    result = this._child.render();
  return this._isModifier ? this._object.modify(result) : result;
};
module.exports = RenderNode;
