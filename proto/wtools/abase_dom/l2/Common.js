(function _Common_js_()
{

'use strict';

const _global = _global_;
const _ = _global.wTools;
_.assert( !!_.dom );
let Parent = _.dom;
const Self = _.dom.s = _.dom.s || Object.create( Parent );

// --
//
// --

function _vectorize( routine, select )
{
  _.assert( arguments.length === 1 || arguments.length === 2 );
  _.assert( _.strIs( routine ) );
  select = select || 1;
  return _.routineVectorize_functor
  ({
    routine : [ 'single', routine ],
    vectorizingArray : 1,
    vectorizingMapVals : 0,
    vectorizingMapKeys : 1,
    select,
  });
}

//

let OriginalInit = Parent.Init;
Parent.Init = function Init()
{
  let result = OriginalInit.apply( this, arguments );

  _.assert( _.objectIs( this.s ) );
  _.assert( this.s.single !== undefined );
  this.s = Object.create( this.s );
  this.s.single = this;

  return result;
}

// --
// prototype
// --

let DomsExtension =
{

  _vectorize,

  remove : _vectorize( 'remove', Infinity ),

  dom : Parent
}

_.mapExtendDstNotOwn( Self, DomsExtension );

Self.Init();

})();
