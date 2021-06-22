(function _Common_js_()
{

'use strict';

const _global = _global_;
const _ = _global.wTools;
_.assert( !!_.dom );
const Parent = _.dom;
_.doms = _.dom.s = _.doms || _.dom.s || Object.create( Parent );

// --
//
// --

let OriginalInit = Parent.Init;
Parent.Init = function Init()
{
  let result = OriginalInit.apply( this, arguments );

  _.assert( _.object.isBasic( this.s ) );
  _.assert( this.s.single !== undefined );
  this.s = Object.create( this.s );
  this.s.single = this;

  return result;
}

//

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

// --
// prototype
// --

let DomsExtension =
{
  _vectorize,

  remove : _vectorize( 'remove', Infinity ),

  dom : Parent,
}

_.mapExtendDstNotOwn( _.doms, DomsExtension );

_.doms.Init();

})();
