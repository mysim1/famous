/**
 * Created by lundfall on 16/02/2017.
 */

/**
 * Used internally as a return from with() statements that data bind the contents
 */
export class RenderablePrototype {
  constructor(type, options){
    this.type = type;
    this.options = options;
  }
}
