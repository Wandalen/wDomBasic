(function _Common_js_()
{

'use strict';

/**
  Collection of cross-platform routines for a browser to operate DOM elements and its events. No matter whatever problem in a browser you are trying to solve several routines of DomBase would help you to solve it faster. It has something in common with Jquery, but no significant overlap. Use the module to get access to shortcuts for a browser.
  @module Tools/base/DomBasic
*/

/**
 * Collection of cross-platform routines for a browser to operate DOM elements and its events.
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

const _global = _global_;
const _ = _global.wTools;
_.dom = _.dom || Object.create( null );

function Init()
{
  let self = this;
}

// --
// dichotomys
// --

function is( src )
{
  if( !_global.Node )
  return false;
  return src instanceof Node;
}

//

function like( src )
{
  if( !_global.Node )
  return false;
  if( src instanceof Node )
  return true;
  if( src instanceof Window )
  return true;
  return jqueryIs( src );
}

function eventIs( src )
{
  if( src instanceof Event )
  return true;
  if( typeof jQuery === 'undefined' )
  return false;
  if( src instanceof jQuery.Event )
  return true;
  return false;
}

//

function htmlIs( src )
{
  return _ObjectToString.call( src ).indexOf( '[object HTML' ) !== -1;
}

//

function jqueryIs( src )
{
  if( typeof jQuery === 'undefined' )
  return;
  return src instanceof jQuery;
}

//

function canvasIs( src )
{
  if( _.dom.jqueryIs( src ) )
  src = src[ 0 ];
  if( src instanceof HTMLCanvasElement )
  return true;
  return false;
}

//

function imageIs( src )
{
  if( _.dom.jqueryIs( src ) )
  src = src[ 0 ];
  if( src instanceof HTMLImageElement )
  return true;
  return false;
}

//

function imageLike( src )
{
  if( _.dom.jqueryIs( src ) )
  src = src[ 0 ];
  if( src instanceof HTMLCanvasElement )
  return true;
  if( src instanceof HTMLImageElement )
  return true;
  return false;
}

//

function domableIs( src )
{
  return _.strIs( src ) || _.dom.is( src ) || _.dom.jqueryIs( src );
}

//
// dom
//

function headIs( src )
{
  return _.entity.strType( src ) === 'HTMLHeadElement';
}

//

function headIs( src )
{
  return _.entity.strType( src ) === 'HTMLHeadElement';
}

//

function from( src )
{
  _.assert( arguments.length === 1 );

  if( _.dom.jqueryIs( src ) )//xxx:remove later
  {
    _.assert( src.length === 1 );
    return src[ 0 ]
  }

  if( _.dom.like( src ) )
  return src;

  if( _.arrayIs( src ) )
  src = '.' + src.join( '.' );

  _.assert( _.strIs( src ) );

  return document.querySelector( src );
}

//

function make( o )
{
  _.assert( arguments.length === 1 );
  _.routine.options_( make, o );
  _.assert( _.strDefined( o.html ) );
  _.assert( o.class === null || _.strDefined( o.class ) || _.arrayIs( o.class ) );
  _.assert( o.class === null || _.strDefined( o.class ) );
  _.assert( o.targetDom === null || _.strDefined( o.targetDom ) || _.dom.is( o.targetDom ) );

  let result = document.createElement( 'div' );
  result.innerHTML = o.html.trim();
  result = result.firstChild;

  if( o.class )
  _.dom.addClass( result, o.class );

  if( o.id )
  result.id = o.id;

  if( o.targetDom === null )
  return result;

  o.targetDom = _.dom.from( o.targetDom );

  _.assert( _.dom.is( o.targetDom ) );

  if( o.empty )
  _.dom.empty( o.targetDom );

  o.targetDom.appendChild( result );

  return result;
}

make.defaults =
{
  targetDom : null,
  html : null,
  class : null,
  id : null,
  empty : 0
}

//

function empty( targetDom )
{
  _.assert( arguments.length === 1 );
  targetDom = _.dom.from( targetDom );

  while( targetDom.firstChild )
  targetDom.removeChild( targetDom.firstChild );
}

//

function parse( src )
{
  _.assert( _.strDefined( src ) );

  let tmp = document.implementation.createHTMLDocument();
  tmp.body.innerHTML = src;

  if( !tmp.body.children.length )
  return [ document.createTextNode( src ) ];

  return [].slice.call( tmp.body.children );
}

//

function remove( src )
{
  let dom = _.dom.from( src );
  _.assert( _.dom.is( dom ) );
  dom.parentNode.removeChild( dom );
}

//

function after( dst, src )
{
  _.assert( arguments.length === 2 );

  let targetDom = _.dom.from( dst );
  let srcDom = _.dom.from( src );

  _.assert( _.dom.is( targetDom ) );
  _.assert( _.dom.is( srcDom ) );

  targetDom.insertAdjacentElement( 'afterend', srcDom );
}

//

function append( dst, src )
{
  _.assert( arguments.length === 2 );

  let targetDom = _.dom.from( dst );
  let srcDom = _.dom.from( src );

  _.assert( _.dom.is( targetDom ) );
  _.assert( _.dom.is( srcDom ) );

  targetDom.appendChild( srcDom );
}

//

function preppend( dst, src )
{
  _.assert( arguments.length === 2 );

  let targetDom = _.dom.from( dst );
  let srcDom = _.dom.from( src );

  _.assert( _.dom.is( targetDom ) );
  _.assert( _.dom.is( srcDom ) );

  targetDom.insertBefore( srcDom, targetDom.firstChild );
}

//

function find( src, selector )
{
  _.assert( arguments.length === 2 );
  let targetDom = _.dom.from( src );

  if( _.arrayIs( selector ) )
  selector = '.' + selector.join( '.' );

  _.assert( _.strIs( selector ) );

  let result = targetDom.querySelectorAll( selector );

  if( result.length === 1 )
  return result[ 0 ];

  return result;
}

//

function include( filePath )
{

  let ext = _.uri.ext( filePath );

  if( _.longHas( [ 'css', 'less' ], ext ) )
  {
    let link = document.createElement( 'link' );
    link.href = filePath;
    link.type = 'text/' + ext;
    link.rel = 'stylesheet';
    link.media = 'screen,print';
    document.head.appendChild( link );
  }
  else
  {
    let script = document.createElement( 'script' );
    script.src = filePath;
    document.head.appendChild( script );
  }

}

//

function closest( targetDom, src )
{
  _.assert( arguments.length === 2 );

  targetDom = _.dom.from( targetDom );

  if( _.strIs( src ) )
  return targetDom.closest( src );

  if( targetDom === src )
  return targetDom;

  if( !targetDom.parentNode )
  return null;

  if( targetDom.parentNode === src )
  return targetDom.parentNode;

  return this.closest( targetDom.parentNode, src );
}

// --
// prototype
// --

let Extension =
{
  Init,

  // dichotomys

  is,
  like,

  eventIs,
  htmlIs,
  jqueryIs,
  canvasIs,
  imageIs,
  imageLike,
  domableIs,
  headIs,

  // dom

  from,
  make,
  empty,
  parse,
  remove,
  after,
  append,
  preppend,
  find,
  closest,

  include,

  // fields

  _domBaselayer1Loaded : true,

  dom : _.dom,
  single : _.dom,
  s : null,

}

/* _.props.extend */Object.assign( _.dom, Extension );

_.dom.Init();

})();
