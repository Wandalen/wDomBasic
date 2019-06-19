(function _DomBase_js_() {

'use strict';

/**
  Collection of routines for a browser to operate DOM elements and its events. No matter whatever problem in a browser you are trying to solve several routines of DomBase would help you to solve it faster. It has something in common with Jquery, but no significant overlap. Use the module to get access to shortcuts for a browser.
  @module Tools/base/DomBase
*/

/**
 * @file DomBase.js.
 */

/**
 * Collection of routines for a browser to operate DOM elements and its events.
 * @namespace Tools( module::DomBase )
 * @memberof module:Tools/base/DomBase
 */ 

var _ = wTools;
var $ = jQuery;
var isApple = navigator.platform.match( /(Mac|iPhone|iPod|iPad)/i );

//
// dom
//

/**
 * @param {} dom
 * @param {} selection
 * @function domCaretSelect
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */ 

function domCaretSelect( dom, selection )
{

  if( _.jqueryIs( dom ) )
  dom = dom[ 0 ];

  if( selection !== undefined )
  {
    if( !_.arrayIs( selection ) ) selection = [ selection ];
    dom.focus();
    if( dom.setSelectionRange )
    {
      dom.setSelectionRange( selection[ 0 ],selection[ 1 ],selection[ 2 ] );
    }
    else if( dom.selectionStart !== undefined )
    {
      dom.selectionEnd = selection[ 0 ];
      dom.selectionStart = selection[ 1 ];
      // dom.focus();
    }
    else if( dom.createTextRange )
    {
      var range = dom.createTextRange();
      range.collapse( true );
      range.moveEnd( 'character',selection[ 1 ] );
      range.moveStart( 'character',selection[ 0 ] );
      range.select();
      // dom.focus();
    }
    dom.focus();
  }
  else
  {

    if( dom.selectionStart !== undefined ){
      return [ dom.selectionStart,dom.selectionEnd,dom.selectionDirection ];
    }
    else if( dom.getSelectionRange )
    {
      return [ dom.getSelectionRange().x,dom.getSelectionRange().y ];
    }
    else if( dom.createTextRange )
    {
      var range = dom.createTextRange();
      return [ range.startOffset,range.endOffset ];
    }
  }

}

//

/**
 * @summary Getter/setter for a `dom` object. 
 * @description 
 * Single argument call: 
 *  Returns value of the element depending on type. If its input field returns it value, otherwise returns text content of the element.
 * Two arguments call:
 *  Changes value of the element depending on type. If elements is a input field changes it value to `val`, otherwise changes text content of the element.
 *  Returns previous value of element `dom`.
 * @param {String|Object} dom Target dom
 * @param {} val Value to set.
 * @function domVal
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domVal( dom,val )
{

  var result;
  var dom = $( dom );

  _.assert( arguments.length === 1 || arguments.length === 2 );

  if( val !== undefined )
  {

    var caretSelected;
    if( document.activeElement == dom[ 0 ] )
    caretSelected = domCaretSelect( dom[ 0 ] );

    if( dom.is( 'input[ type=checkbox ]' ) )
    {
      result = dom[ 0 ].checked ? true : false;
      dom[ 0 ].checked = val ? true : false;
    }
    else if( dom.is( 'input' ) )
    {
      result = dom[ 0 ].value;
      dom[ 0 ].value = val;
    }
    else
    {
      result = dom.text();
      dom.text( val );
    }

    if( caretSelected )
    domCaretSelect( dom,caretSelected );

  }
  else
  {

    if( dom.is( 'input[ type=checkbox ]' ) )
    {
      result = dom[ 0 ].checked ? true : false;
    }
    else if( dom.is( 'input' ) )
    {

      result = dom[ 0 ].value;

      if( result === '' || result === undefined )
      result = dom[ 0 ].defaultFieldsMap;

      if( result === '' || result === undefined )
      result = dom[ 0 ].placeholder;

    }
/*
    else
    {
      result = dom.text();
    }
*/
  }

  return result;
}

//

function domsVal( dom,vals )
{
  var result;

  _.assert( arguments.length <= 2 );

  if( !dom )
  dom = document.body;

  /* */

  if( arguments.length === 2  )
  result = _.domEach
  ({
    recursive : true,
    dom : dom,
    onUp : function( dom )
    {

      var selector = dom.name;

      if( !_.strIsNotEmpty( selector ) )
      return;

      var val = _.entitySelect( vals,selector );

      if( val === undefined )
      return;

      _.domVal( dom,val );

    },
  });
  else
  result = _.domEach
  ({
    recursive : true,
    result : Object.create( null ),
    dom : dom,
    onUp : function( dom,result )
    {

      var text = '';
      var val = _.domVal( dom );

      if( val === undefined )
      return;
      // return result;

      var val = _.domVal( dom );

      if( !isNaN( val ) )
      val = Number( val );

      var selector = dom.name;

      _.entitySelectSet( result,selector,val );

      // return result;
    },
  });

  /* */

  return result;
}

//

/**
 * @summary Changes className property of `dom` element. 
 * @description 
 * If `adding` is `true` routine adds class `className` to the element.
 * If `adding` is `false` routine removes class `className` from the element.
 * If `adding` is not provided, routine removes class if it exists, otherwise adds it.
 * 
 * @param {String|Object} dom Target dom.
 * @param {String} cssClass Name of class.
 * @param {Boolean} adding Controls adding/removing of the class.
 * @function domClass
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domClass( dom,cssClass,adding )
{

  _.assert( arguments.length === 2 || arguments.length === 3 );
  _.assert( _.domableIs( dom ) );
  _.assert( _.strIs( cssClass ) );

  dom = $( dom );

  if( adding === undefined )
  adding = !dom.hasClass( cssClass );

  if( adding )
  dom.addClass( cssClass );
  else
  dom.removeClass( cssClass );

}

//

function domClasses( dom,classes,adding )
{

  _.assert( arguments.length === 1 || arguments.length === 3 );
  _.assert( _.domableIs( dom ) );

  dom = $( dom );

  if( arguments.length === 1 )
  {

    _.assert( dom.length === 1 );

    return dom[ 0 ].className.split( /\s+/ );

  }
  else
  {

    _.assert( dom.length >= 1 );
    _.assert( _.arrayIs( classes ) || _.strIs( classes ) );

    if( _.strIs( classes ) )
    {
      if( adding )
      dom.addClass( classes );
      else
      dom.removeClass( classes );
    }
    else for( var c = 0 ; c < classes.length ; c++ )
    {
      if( adding )
      dom.addClass( classes[ c ] );
      else
      dom.removeClass( classes[ c ] );
    }

  }

}

//

/**
 * @summary Manipulates the attributes of `dom` element. 
 * @description 
 * If `adding` is `true` routine adds attributes `attrs` to the element.
 * If `adding` is `false` routine removes attributes `attrs` from the element.
 * If single `dom` argument is provided routine returns attributes of the element.
 * @param {String|Object} dom Target dom.
 * @param {String|Object} attrs Source attributes.
 * @param {Boolean} adding Controls adding/removing of the attributes.
 * @function domAttrs
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domAttrs( dom,attrs,adding )
{

  _.assert( arguments.length === 1 || arguments.length === 2 || arguments.length === 3 );
  _.assert( _.domableIs( dom ) );

  if( adding === undefined )
  adding = 1;

  dom = $( dom );

  if( arguments.length === 1 )
  {

    _.assert( dom.length === 1 );

    var result = Object.create( null );
    for( var a = 0 ; a < dom[ 0 ].attributes.length ; a++ )
    {
      if( dom[ 0 ].attributes[ a ].name === 'class' )
      continue;
      result[ dom[ 0 ].attributes[ a ].name ] = dom[ 0 ].attributes[ a ].value;
    }

    return result;
  }
  else
  {

    _.assert( dom.length >= 1 );
    _.assert( _.objectIs( attrs ) || _.strIs( attrs ) );

    // if( !adding )
    // debugger;

    if( _.strIs( attrs ) )
    {
      // if( !adding )
      // debugger;
      if( adding )
      dom.attr( attrs,1 );
      else
      dom.removeAttr( attrs );
    }
    else for( var c in attrs )
    {
      _.assert( _.atomicIs( attrs[ c ] ) );
      if( adding )
      dom.attr( c,attrs[ c ] );
      else
      dom.removeAttr( c,attrs[ c ] );
    }

  }

}

//

/**
 * @summary Returns true if `dom` element has at least one attribute from `attrs`. 
 * @param {String|Object} dom Target dom.
 * @param {Array} attrs Source attributes.
 * @function domAttrHasAny
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domAttrHasAny( dom,attrs )
{
  var has = _.mapKeys( _.domAttrs( dom ) );
  return _.arrayHasAny( has,attrs );
}

//

/**
 * @summary Returns true if `dom` element has all attribute from `attrs`. 
 * @param {String|Object} dom Target dom.
 * @param {Array} attrs Source attributes.
 * @function domAttrHasAny
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domAttrHasAll( dom,attrs )
{
  var has = _.mapKeys( _.domAttrs( dom ) );
  debugger;
  return _.arrayHasAll( has,attrs );
}

//

/**
 * @summary Returns true if `dom` element doesn't have any attribute from `attrs`. 
 * @param {String|Object} dom Target dom.
 * @param {Array} attrs Source attributes.
 * @function domAttrHasAny
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domAttrHasNone( dom,attrs )
{
  var has = _.mapKeys( _.domAttrs( dom ) );
  debugger;
  return _.arrayHasNone( has,attrs );
}

//

/**
 * @summary Recursively collects text content of the `dom` element.
 * @param {Object} o Options object.
 * @param {Object|String} o.targetDom Dom element.
 * @param {Object} o.strippingEmptyLines Removes empty lines from text.
 * @param {Object} o.strippingEnds Removes empty whitespaces from the beginning/ending of the string.
 * @function domTextGet
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domTextGet( o )
{

  if( _.domableIs( o ) )
  o = { targetDom : o }
  _.routineOptions( domTextGet,o );

  var result = _.domEach
  ({
    recursive : true,
    result : '',
    dom : o.targetDom,
    onUp : function( dom,iterator )
    {
      var text = '';

      if( dom.nodeType === Node.TEXT_NODE )
      text = dom.nodeValue;
      else if( dom.value )
      text = dom.value;
      else if( dom.placeholder )
      text = dom.placeholder;

      if( o.strippingEnds )
      iterator.result += _.strStrip({ src : text, stripper : ' ' });
      else
      iterator.result += text;

    },
  });

  // debugger;
  if( o.strippingEmptyLines )
  result = _.strStripEmptyLines( result );

  return result;
}

domTextGet.defaults =
{
  targetDom : null,
  strippingEmptyLines : 1,
  strippingEnds : 1,
}

//

/**
 * @summary Looks for attribute `attrName` on `dom` element and it parents.
 * @description Returns value of attribute of undefined if nothing found.
 * @param {Object|String} dom Dom element.
 * @param {String} attrName Attributes to find.
 * @function domAttrInherited
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domAttrInherited( dom,attrName )
{
  var result;

  if( _.jqueryIs( dom ) )
  dom = dom[ 0 ];

  _.assert( arguments.length === 2 );
  _.assert( _.domIs( dom ) );
  _.assert( _.strIs( attrName ) );

  var p = dom;
  do
  {
    result = p.getAttribute( attrName );
    p = p.parentNode;
  }
  while( p && p !== document && _.strTypeOf( p ) !== 'DocumentFragment' && ( result === null || result === undefined ) );

  return result;
}

//

/**
 * @summary Generates selector for `dom` element using it properties.
 * @param {Object|String} dom Dom element.
 * @param {String} attrName Attributes to find.
 * @function domNickname
 * @memberof module:Tools/base/DomBase.Tools( module::DomBase )
 */

function domNickname( dom,attrName )
{

  if( _.jqueryIs( dom ) )
  dom = dom[ 0 ];

  _.assert( arguments.length <= 2 );
  _.assert( _.domIs( dom ) );

  var name = dom.tagName.toLowerCase();

  if( dom.id )
  name += '#' + dom.id;

  if( dom.className )
  name += '.' + dom.className.split( ' ' ).join( '.' );

  if( attrName && dom.getAttribute( attrName ) )
  name += '[ ' + attrName + '=' + dom.getAttribute( attrName ) + ' ]';

  return name;
}

//

function domOf( parent,children )
{

  _.assert( arguments.length === 2 );
  _.assert( _.domableIs( parent ) );
  _.assert( _.domableIs( children ) );

  // if( !children )
  // return children;

  parent = $( parent );

  if( _.strIs( children ) )
  children = parent.find( children );

  return children;
}

//

function domLeftTopGet( dom )
{

  _.assert( _.domableIs( dom ) );
  _.assert( arguments.length === 1 );

  var dom = $( dom );
  var result = [];

  result[ 0 ] = dom.css( 'left' );
  result[ 1 ] = dom.css( 'top' );

  for( var i = 0 ; i < 2 ; i++ )
  if( _.strIs( result[ i ] ) )
  result[ i ] = _.strBeginOf( result[ i ],'px' );

  result = _.numbersFrom( result );

  return result;
}

//

function domLeftTopSet( dom,pos )
{

  _.assert( _.domableIs( dom ) );
  _.assert( pos.length === 2 );
  _.assert( arguments.length === 2 );

  var dom = $( dom );

  dom.css
  ({
    left : pos[ 0 ],
    top : pos[ 1 ],
  });

}

//

function domCenterSet( dom,pos )
{

  _.assert( _.domableIs( dom ) );
  _.assert( pos.length === 2 );
  _.assert( arguments.length === 2 );

  var dom = $( dom );
  var size = _.domSizeFastGet( dom );

  _.assert( dom.length === 1 );

  //logger.log( 'size',size );

  dom.css
  ({
    left : pos[ 0 ] - size[ 0 ] / 2,
    top : pos[ 1 ] - size[ 1 ] / 2,
  });

}

//

function domPositionGet( dom )
{
  var dom = $( dom );

  _.assert( dom.length === 1 );

  var result = dom.position();

  result = [ result.left,result.top ];

  dom[ 0 ]._domPositionGet = result;

  return result;
}

//

function domBoundingBoxGet( dom )
{
  var dom = $( dom );

  _.assert( dom.length === 1 );

  var child = dom[ 0 ].getBoundingClientRect();
  var parent = dom[ 0 ].parentNode.getBoundingClientRect();

  var result = [ child.left-parent.left,child.top-parent.top,child.right-parent.left,child.bottom-parent.top ];

  return result;
}

//

function domBoundingBoxGlobalGet( dom )
{
  var dom = $( dom );

  _.assert( dom.length === 1 );

  var child = dom[ 0 ].getBoundingClientRect();
  var result = [ child.left,child.top,child.right,child.bottom ];

  dom[ 0 ]._domBondingBoxGet = result;

  return result;
}

//

function domSizeGet( dom )
{
  var result = [];
  var dom = $( dom );

  _.assert( dom.length === 1 );

  result = [ dom.outerWidth(),dom.outerHeight() ];
  dom[ 0 ]._domSizeGet = result;

  return result;
}

//

function domSizeFastGet( dom )
{
  var dom = $( dom );

  if( dom[ 0 ]._domSizeGet )
  return dom[ 0 ]._domSizeGet;

  return domSizeGet( dom );

}

//

function domsSizeGet( dom )
{
  var result = [];
  var dom = $( dom );

  for( var i = 0 ; i < dom.length ; i++ )
  result[ i ] = domSizeGet( dom[ i ] );

  return result;
}

//

function domsSizeFastGet( dom )
{
  var result = [];
  var dom = $( dom );

  for( var i = 0 ; i < dom.length ; i++ )
  result[ i ] = domSizeFastGet( dom[ i ] );

  return result;
}

//

function domRadiusGet( dom )
{
  var result;
  var dom = $( dom );

  result = Math.min( dom.outerWidth(),dom.outerHeight() );
  dom[ 0 ]._domRadiusGet = result;

  return result;
}

//

function domRadiusFastGet( dom )
{
  var dom = $( dom );

  if( dom[ 0 ]._domRadiusGet )
  return dom[ 0 ]._domRadiusGet;

  return domSizeGet( dom );

}

//

function domsRadiusGet( dom )
{
  var result = [];
  var dom = $( dom );

  for( var i = 0 ; i < dom.length ; i++ )
  result[ i ] = domRadiusGet( dom[ i ] );

  return result;
}

//

function domsRadiusFastGet( dom )
{
  var result = [];
  var dom = $( dom );

  for( var i = 0 ; i < dom.length ; i++ )
  result[ i ] = domRadiusFastGet( dom[ i ] );

  return result;
}

//

function domFirst()
{

  for( var a = 0 ; a < arguments.length ; a++ )
  {

    var src = arguments[ a ];
    if( !_.domableIs( src ) )
    continue;

    src = $( src );
    if( !src.length )
    continue;

    return src[ 0 ];
  }

  return;
}

//

function domFirstOf( src,selector )
{

  _.assert( _.domableIs( src ) );
  _.assert( _.strIs( selector ) );
  _.assert( arguments.length === 2 );

  selector += ':first';
  src = $( src );

  var result = src.filter( selector );

  if( result.length )
  return result[ 0 ];

  result = src.find( selector );

  return result[ 0 ];
}

//

function domOwnIdentity( dom,identity )
{

  dom = $( dom );

  _.assert( dom.length === 1 );
  _.assert( arguments.length === 1 || arguments.length === 2 );
  _.assert( identity === undefined || _.strIs( identity ) );

  if( identity === undefined )
  {

    var cssClasses = dom[ 0 ].className.split( /\s+/ );
    var result = '';

    if( cssClasses.length )
    result += '.' + cssClasses.join( '.' );

    if( dom[ 0 ].id )
    debugger;

    if( dom[ 0 ].id )
    result = '#' + dom[ 0 ].id + result;

    _.assert( result );

    return result;
  }

  identity = _.strCutOffAllLeft( identity,' ' )[ 2 ];

  _.assert( identity.indexOf( ' ' ) === -1 );

  identity = _.strSplit({ src : identity, preservingDelimeters : 1, delimeter : [ '.','#' ] })

  for( var i = 1 ; i < identity.length ; i+=1 )
  if( identity[ i-1 ] === '.' )
  dom.addClass( identity[ i ] );
  else if( identity[ i-1 ] === '#' )
  dom.attr( identity[ i ] );
  else throw _.err( 'unknown prefix',identity[ i-1 ] );

}

//

function domCssGet( dom,fields )
{
  var result = Object.create( null );

  dom = $( dom )

  _.assert( arguments.length === 2 );
  _.assert( dom.length === 1 );
  _.assert( _.strIs( fields ) || _.arrayIs( fields ) || _.mapIs( fields ) );

  if( _.strIs( fields ) )
  {
    debugger;
    result[ fields ] = dom.css( fields );
  }
  else if( _.arrayIs( fields ) )
  {
    for( var f = 0 ; f < fields.length ; f++ )
    result[ fields[ f ] ] = dom.css( fields[ f ] );
  }
  else if( _.mapIs( fields ) )
  {
    debugger;
    for( var f in fields.length )
    result[ fields[ f ] ] = dom.css( fields[ f ] );
  }

  return result;
}

//

function domCssSet( dom,fields )
{

  dom = $( dom )

  _.assert( arguments.length === 2 );
  _.assert( dom.length === 1 );
  _.assert( _.mapIs( fields ) );

  dom.css( fields );

  return dom;
}

//

function domEmToPx( dom,em )
{
  var emSize = parseFloat( dom.css( 'font-size' ) );
  return( emSize * em );
}

//

function domEach( o )
{

  _.routineOptions( domEach,o );
  _.assert( _.domableIs( o.dom ) );

  o.dom = $( o.dom );

  for( var d = 0 ; d < o.dom.length ; d++ )
  {
    _domEach( o.dom[ d ],o );
  }

  return o.result;
}

domEach.defaults =
{
  dom : null,
  result : null,
  recursive : true,
  usingNodeTypeElement : true,
  usingNodeTypeText : true,
  usingNodeTypesAll : false,
  onUp : function( dom,o ){},
  onDown : function( dom,o ){},
}

//

function _domEach( dom,o )
{

  _.assert( _.domIs( dom ) );

  if( dom.nodeType === Node.ELEMENT_NODE )
  {
    if( !o.usingNodeTypeElement )
    return;
  }
  else if( dom.nodeType === Node.TEXT_NODE )
  {
    if( !o.usingNodeTypeText )
    return;
  }
  else
  {
    if( !o.usingNodeTypesAll )
    return;
  }

  /* */

  var r = o.onUp( dom,o );
  _.assert( r === undefined );

  var children = dom.childNodes;
  for( var d = 0 ; d < children.length ; d++ )
  {
    var dom = children[ d ];
    _domEach( dom,o );
  }

  var r = o.onDown( dom,o );
  _.assert( r === undefined );

  return o.context;
}

//

var _domGlobalCssKeysArray = [];
function domCssGlobal( o )
{

  if( _.strIs( o ) )
  o = { css : o }

  _.routineOptions( domCssGlobal,o );
  _.assert( o.document.head );
  _.assert( _.strIs( o.css ) );
  _.assert( arguments.length === 1 );

  if( o.once )
  {

    if( o.key === null )
    o.key = o.css;
    if( _.arrayHas( _domGlobalCssKeysArray , [ o.key,o.document ] , _.arrayIdentical ) )
    return;
    _domGlobalCssKeysArray.push([ o.key,o.document ]);

  }

  var result = $( '<style>' + o.css + '<style>' ).appendTo( o.document.head );

  return result;
}

domCssGlobal.defaults =
{
  document : document,
  css : null,
  once : 1,
  key : null,
}

//

function domCssExport( o )
{
  if( o instanceof Document )
  o = { dstDocument : o }

  _.routineOptions( domCssExport,o );
  _.assert( o.srcDocument.head );
  _.assert( o.dstDocument.head );
  _.assert( arguments.length === 1 );

  var styles = o.srcDocument.getElementsByTagName( 'style' );

  for( var s = 0 ; s < styles.length ; s++ )
  {
    var style = styles[ s ];
    var css = style.textContent;

    // console.log( 'css',css.length );
    // if( !css )
    // debugger;

    _.domCssGlobal
    ({
      document : o.dstDocument,
      css : css,
      once : 0,
    });

  }

}

domCssExport.defaults =
{
  dstDocument : null,
  srcDocument : document,
}

//

function domClipboardCopy( text )
{
  var result = false;
  var textArea = document.createElement( 'textarea' );

  textArea.style.position = 'fixed';
  textArea.style.padding = 0;
  textArea.style.margin = 0;
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.fontSize = '6px';

  textArea.style.width = '100%';
  textArea.style.height = '100%';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild( textArea );

  textArea.focus();
  textArea.setSelectionRange( 0, textArea.value.length );
  /*textArea.select();*/

  try
  {

    result = document.execCommand( 'copy' );
    if( !result )
    _.errLog( 'Failed to copy into clipboard' );

  }
  catch(err )
  {
    _.errLog( 'Failed to copy into clipboard',err );
  }

  document.body.removeChild( textArea );
  return result;
}

//

var domFullScreen = ( function domFullScreen()
{

  var inFullscreen = 0;
  var requestFullScreen = null;
  var cancelFullScreen = null;

  /* */

  function initFullScreen()
  {
    if( 'requestFullScreen' in document )
    {
      requestFullScreen = 'requestFullScreen';
      cancelFullScreen = 'cancelFullScreen';
    }
    else if( 'webkitCancelFullScreen' in document )
    {
      requestFullScreen = 'webkitRequestFullScreen';
      cancelFullScreen = 'webkitCancelFullScreen';
    }
    else if( 'mozCancelFullScreen' in document )
    {
      requestFullScreen = 'mozRequestFullScreen';
      cancelFullScreen = 'mozCancelFullScreen';
    }
    else if( 'msCancelFullScreen' in document )
    {
      requestFullScreen = 'msRequestFullScreen';
      cancelFullScreen = 'msCancelFullScreen';
    }
    else
    {
      requestFullScreen = NaN;
      cancelFullScreen = NaN;
    }
  }

  return function domFullScreen( src )
  {

    _.assert( arguments.length === 0 || arguments.length === 1 );

    if( requestFullScreen === null )
    initFullScreen();

    if( src )
    {
      if( requestFullScreen )
      {
        document.body[ requestFullScreen ]();
        inFullscreen = true;
      }
      else
      {
        inFullscreen = false;
        alert( 'Fullscreen is not supported.' );
      }
    }
    else
    {
      inFullscreen = false;
      if( cancelFullScreen )
      {
        document[ cancelFullScreen ]();
      }
      else
      {
        alert( 'Fullscreen is not supported.' );
      }

    }

  }

})();

//

function domLoad( o )
{

  _.routineOptions( domLoad,o );

  o.once = new wConsequence();
  o.ready = new wConsequence();

  // var consequence = new wConsequence();
  o.parentDom = $( o.parentDom );
  var targetDom = o.parentDom;
  if( o.targetClass )
  targetDom = o.parentDom.find( '.' + o.targetClass ).addBack( '.' + o.targetClass );

  if( !targetDom.length )
  if( o.replacing )
  targetDom = o.parentDom;
  else
  targetDom = $( '<div>' ).prependTo( o.parentDom );

  /* */

  function show()
  {

    if( o.showing )
    {
      o.parentDom.show();
      targetDom.show();
    }

  }

  /* */

  if( o.targetClass )
  if( targetDom.hasClass( o.targetClass ) )
  {
    show();
    o.ready.give( targetDom );
    return o;
  }

  if( o.targetClass )
  _.domClasses( targetDom,o.targetClass,1 );

  /* */

  _.assert( _.mapIs( o ) );
  _.assert( arguments.length === 1 );
  // _.assert( _.strIs( o.targetClass ) || o.replacing );
  _.assert( _.strIsNotEmpty( o.url ), 'expects ( o.url )' );
  _.assert( o.parentDom.length,'expects { o.parentDom }' );
  _.assert( targetDom.length,'expects { targetDom }' );

  /* */

  function handleLoaded( responseData, status, xhr )
  {

    _.assert( arguments.length === 3 );

    if( status != 'error' && o.replacing ) try
    {
      _.assert( _.strIs( responseData ) );
      responseData = $( responseData );
    }
    catch( err )
    {
      status = 'error';
      reason = _.err( err );
    }

    if( status === 'error' )
    {
      var reason ;
      if( _.objectIs( xhr ) )
      reason = xhr.status + ' : ' + xhr.statusText;
      else
      reason = responseData.status + ' : ' + responseData.statusText;
      reason += ' : ' + o.url;
      var html = 'Error ' + reason;
      targetDom.html( html );
      var err = _.errLogOnce( reason );
      o.ready.error( err );
      o.once.error( err );
      return;
    }

    if( o.replacing )
    {
      var classes = _.domClasses( targetDom );
      var attrs = _.domAttrs( targetDom );
      targetDom = targetDom.replaceWith( responseData );
      targetDom = responseData;

      if( o.targetClass )
      _.domClasses( targetDom,o.targetClass,1 );

      if( o.preservingAttributes )
      _.domAttrs( targetDom,attrs,1 );
      if( o.preservingClasses )
      _.domClasses( targetDom,classes,1 );
    }

    o.parentDom.attr( 'dom-loaded',1 );

    show();

    o.ready.give( targetDom );
    o.once.give( targetDom );

  }

  /* */

  if( o.replacing )
  $
  .get( o.url )
  .always( handleLoaded );
  else
  targetDom.load( o.url,handleLoaded );

  return o;
}

domLoad.defaults =
{
  url : null,
  targetClass : null,
  parentDom : 'body',
  showing : 0,
  replacing : 1,
  preservingClasses : 1,
  preservingAttributes : 1,
}

// --
// event
// --

var eventName = ( function eventName()
{
  var _eventMap = null;

  return function( name )
  {

    if( _.arrayIs( name ) )
    {
      var result = [ ];

      for( var n = 0 ; n < name.length ; n++ )
      result[ n ] = this.eventName( name[ n ] );

      return result;
    }
    else if( !_.strIs( name ) )
    throw _.err( 'eventName :','expect string or array as argument' );

    var touchSupported = ( 'ontouchstart' in window ) || ( 'onmsgesturechange' in window );
    if( !_eventMap )
    {
      _eventMap = Object.create( null );
      if( touchSupported )
      {
        _eventMap[ 'mousedown' ] = 'touchstart';
        _eventMap[ 'mouseup' ] = 'touchend';
        _eventMap[ 'mousemove' ] = 'touchmove';
        _eventMap[ 'mouseenter' ] = 'touchenter';
        _eventMap[ 'mouseleave' ] = 'touchleave';
        _eventMap[ 'dblclick' ] = 'taphold';

        if( 'ontouch' in window )
        _eventMap[ 'click' ] = 'touch';
        else if( !( 'onclick' in window ) )
        _eventMap[ 'click' ] = 'click';
        else
        _eventMap[ 'click' ] = 'touchend';

        //if( !( 'onclick' in window ) )
        //_eventMap[ 'click' ] = 'touchend'; // xxx
        //xxx

      }
      else
      {
        _eventMap[ 'mousedown' ] = 'mousedown';
        _eventMap[ 'mouseup' ] = 'mouseup';
        _eventMap[ 'mousemove' ] = 'mousemove';
        _eventMap[ 'mouseenter' ] = 'mouseenter';
        _eventMap[ 'mouseleave' ] = 'mouseleave';
        _eventMap[ 'dblclick' ] = 'dblclick';
        _eventMap[ 'click' ] = 'click';
      }
    }

    if( _eventMap[ name ] ) return _eventMap[ name ];
    else return name;

  }

})();

//

function eventClientPosition( o )
{
  var result;

  if( _.eventIs( o ) )
  o = { event : o };

  var event = o.event;
  var relative = o.relative;

  _.assert( arguments.length === 1 );
  _.assert( _.eventIs( event ) );
  _.assert( !o.flip || _.arrayIs( o.flip ) );
  _.assertMapHasOnly( o,eventClientPosition.defaults );

  if( _.numberIs( event.clientX ) )
  result = [ event.clientX,event.clientY ];

  if( event.originalEvent )
  event = event.originalEvent;

  if( event.targetTouches && event.targetTouches.length )
  result = [ event.targetTouches[ 0 ].clientX,event.targetTouches[ 0 ].clientY ];

  if( event.changedTouches && event.changedTouches.length )
  result = [ event.changedTouches[ 0 ].clientX,event.changedTouches[ 0 ].clientY ];

  _.assert( !relative || _.jqueryIs( relative ),'eventClientPosition :','relative must be jQuery object if defined' );

  if( relative && result )
  {
    var offset = relative.offset();
    result[ 0 ] -= offset.left;
    result[ 1 ] -= offset.top;
  }

  if( o.flip )
  {

    if( !relative )
    throw _.err( 'not implemented' );

    var size = _.domSizeGet( relative );

    if( o.flip[ 0 ] )
    result[ 0 ] = size[ 0 ] - result[ 0 ] - 1;

    if( o.flip[ 1 ] )
    result[ 1 ] = size[ 1 ] - result[ 1 ] - 1;

  }

  return result;
}

eventClientPosition.defaults =
{
  event : null,
  relative : null,
  flip : null,
}

//

function eventRedirect( dst,src )
{

  src = $( src );
  dst = $( dst );

  function handleRedirect( event ){
    if( event.originalEvent && !event.originalEvent.doNotRedirect ) dst.trigger( event );
    return true;
  }

  function handleMark( event ){
    if( event.originalEvent ) event.originalEvent.doNotRedirect = 1;
  }

  function handleStop( event ){
    return false;
  }

  src.children()
  .on( "blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu mousewheel", handleMark );

  //src.on( "mousemove", handleRedirect );

  //src.on( "mousedown mouseup mousemove", handleRedirect );

  //src.on( "blur focus focusin focusout click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave mousewheel", handleRedirect );

  src.on( "blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu mousewheel", handleRedirect );

}

//

function eventMouse( type, cx, cy )
{

  if( cx === undefined ) cx = 0;
  if( cy === undefined ) cy = 0;

  var sx = cx + window.screenX;
  var sy = cy + window.screenY;

  var event;
  var e = {
    bubbles : true,
    cancelable : ( type != "mousemove" ),
    view : window,
    detail : 0,
    screenX : sx,
    screenY : sy,
    clientX : cx,
    clientY : cy,
    ctrlKey : false,
    altKey : false,
    shiftKey : false,
    metaKey : false,
    button : 0,
    relatedTarget : undefined
  };

  if ( typeof( document.createEvent ) == "function" ) {
    event = document.createEvent( "MouseEvents" );
    event.initMouseEvent( type,
      e.bubbles, e.cancelable, e.view, e.detail,
      e.screenX, e.screenY, e.clientX, e.clientY,
      e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
      e.button, null );
      //e.button, document.body.parentNode );
  } else if ( document.createEventObject ) {
    event = document.createEventObject();
    for ( prop in e ) {
      event[ prop ] = e[ prop ];
    }
    event.button = { 0 :1, 1 :4, 2 :2 }[ event.button ] || event.button;
  }

  //event.fromElement = null;

  return event;
}

//
/*
function eventWheelZero( event,x,y )
{
  _.assert( arguments.length === 3 );
  var wrap;
  var o = Object.create( null );

  if( event.originalEvent )
  {
    wrap = event;
    if( x )
    if( _.numberIs( event.deltaX ) )
    event.deltaX = 0;
    if( y )
    if( _.numberIs( event.deltaY ) )
    event.deltaY = 0;
    event = event.originalEvent;
  }

  {
    if( _.numberIs( event.wheelDeltaX ) )
    o.wheelDeltaX = y ? 0 : event.wheelDeltaX;
    if( _.numberIs( event.deltaX ) )
    o.deltaX = y ? 0 : event.deltaX;
  }

  {
    if( _.numberIs( event.wheelDeltaY ) )
    o.wheelDeltaY = y ? 0 : event.wheelDeltaY;
    if( _.numberIs( event.deltaY ) )
    o.deltaY = y ? 0 : event.deltaY;
    if( _.numberIs( event.wheelDelta ) )
    o.wheelDelta = y ? 0 : event.wheelDelta;
    if( _.numberIs( event.delta ) )
    o.delta = y ? 0 : event.delta;
    if( _.numberIs( event.detail ) )
    o.detail = y ? 0 : event.detail;
  }

  var result = new event.constructor( o );

  if( wrap )
  {
    var o = Object.create( null );
    if( _.numberIs( event.deltaX ) )
    o.deltaX = y ? 0 : event.deltaX;
    if( _.numberIs( event.deltaY ) )
    o.deltaY = y ? 0 : event.deltaY;
    o.originalEvent = result;
    result = new wrap.constructor( o );
  }

  return result;
}
*/
//

function eventWheelDelta( event,usingOne )
{
  var deltaX;
  var deltaY;

  if( event.originalEvent )
  event = event.originalEvent;

  // debugger;

  if( _.numberIs( event.wheelDeltaX ) )
  deltaX = event.wheelDeltaX;
  else if( _.numberIs( event.deltaX ) )
  deltaX = -event.deltaX;

  if( _.numberIs( event.wheelDeltaY ) )
  deltaY = event.wheelDeltaY;
  else if( _.numberIs( event.deltaY ) )
  deltaY = -event.deltaY;
  else if( _.numberIs( event.wheelDelta ) )
  deltaY = event.wheelDelta;
  else if( _.numberIs( event.delta ) )
  deltaY = -event.delta;
  else if( _.numberIs( event.detail ) )
  deltaY = event.detail;

  if( usingOne )
  {

    if( deltaX > +1 ) deltaX = +1;
    else if( deltaX < -1 ) deltaX = -1;
    else deltaX = 0;

    if( deltaY > +1 ) deltaY = +1;
    else if( deltaY < -1 ) deltaY = -1;
    else deltaY = 0;

  }

  return [ +deltaX,+deltaY ];
}

//

var eventWheelDeltaScreen = ( function eventWheelDeltaScreen()
{

  var screenSize;

  return function( event )
  {
    if( !screenSize ) screenSize = [ screen.width / 250 , screen.height / 250 ];
    var result = eventWheelDelta( event );
    result[ 0 ] *= screenSize[ 0 ];
    result[ 1 ] *= screenSize[ 1 ];
    return result;
  }

})();

//

function eventSpecialMake( o )
{

  _.assert( arguments.length === 1 );

  if( _.strIs( o ) )
  o = { name : o };

  _.assertMapHasOnly( o,eventSpecialMake.defaults );

  var event = new CustomEvent
  (
    'resize',
    {
      detail :
      {
        time : new Date(),
      },
      bubbles : true,
      cancelable : true,
    }
  );

  /* document.dispatchEvent( event ); */

  return event;
}

eventSpecialMake.defaults =
{
  name : null,
}

//

function eventsObserver( o )
{

  if( !_.objectIs( o ) )
  o = { targetDom : o };

  _.assert( _.domIs( o.targetDom ) );
  _.assert( arguments.length === 1 );
  _.routineOptions( eventsObserver,o );

  var observer = new MutationObserver( function( mutations )
  {
    mutations.forEach( function( mutation )
    {
      if( o.verbosity )
      console.log( mutation.type );
      if( o.onMutation )
      o.onMutation.call( o,mutation );
    });
  });

  var config =
  {
    childList : true,
    attributes : true,
    characterData : true,
    subtree : true,
    // attributeOldValue : true,
    // characterDataOldValue : true,
    // attributeFilter : true,
  };

  observer.observe( o.targetDom,config );

  // observer.disconnect();

}

eventsObserver.defaults =
{
  verbosity : 1,
  targetDom : null,
  onMutation : null,
}

//

function eventsBindAll( o )
{
  if( !_.mapIs( o ) )
  o = { targetDom : o }

  if( !o.onEvent )
  o.onEvent = function( e )
  {
    if( e.type === 'pointermove' )
    return;
    if( e.type === 'mousemove' )
    return;
    console.log( e.type );
  }

  _.assert( _.domableIs( o.targetDom ) );
  _.assert( arguments.length === 1 );
  _.routineOptions( eventsBindAll,o );

  o.targetDom = $( o.targetDom );
  _.assert( o.targetDom.length === 1 );
  o.targetDom = o.targetDom[ 0 ];

  for( var e in o.targetDom )
  {
    if( !_.strBegins( e,'on' ) || e.length < 3 )
    continue;

    var name = _.strEndOf( e,'on' );

    o.targetDom.addEventListener( name,o.onEvent );

  }

}

eventsBindAll.defaults =
{
  targetDom : null,
  onEvent : null,
}

//

var _jqueryOriginalOn = jQuery.fn.on;
function eventsBindWatcher( o )
{
  o = _.routineOptions( eventsBindWatcher,o )

  _.assert( _jqueryOriginalOn === jQuery.fn.on,'on of jQuery is already overwritten' );

  o.result = o.result || [];
  o.close = function close()
  {
    jQuery.fn.on = _jqueryOriginalOn;
    return o.result;
  }

  jQuery.fn.on = function on( eventName,handler )
  {
    var dom = $( this );
    var selector;
    var data;

    var argumentsLength = arguments.length;
    if( arguments[ argumentsLength-1 ] === undefined )
    argumentsLength -= 1;
    if( arguments[ argumentsLength-1 ] === undefined )
    argumentsLength -= 1;

    if( argumentsLength === 3 )
    {
      if( _.strIs( arguments[ 1 ] ) )
      selector = arguments[ 1 ];
      else
      data = arguments[ 1 ];
      handler = arguments[ 2 ];
    }

    if( argumentsLength === 4 )
    {
      selector = arguments[ 1 ];
      data = arguments[ 2 ];
      handler = arguments[ 3 ];
    }

    _.assert( dom !== this );
    _.assert( arguments.length === 2 || arguments.length === 3 || arguments.length === 4 );
    _.assert( _.routineIs( handler ) );

    var e = Object.create( null )
    e.dom = dom;
    e.eventName = eventName;
    e.selector = selector;
    e.data = data;
    e.handler = handler;

    o.result.push( e );

    var result = _jqueryOriginalOn.call( this,eventName,handler );
    return result;
  }

  return o;
}

eventsBindWatcher.defaults =
{
  result : null,
}

//

function eventFire( o )
{
  _.routineOptions( eventFire,o );
  _.assert( _.domableIs( o.targetDom ) );

  o.targetDom = $( o.targetDom );

  var event = new Event( o.kind,
  {
    // 'bubbles' : true,
    'cancelable' : true,
  });

  if( o.extendingByOptions )
  _.mapExtend( event,o );

  if( o.extendMap )
  _.mapExtend( event,o.extendMap );

  if( !o.informingDescandants )
  o.targetDom.each( function( k,dom )
  {
    dom.dispatchEvent( event );
  });
  else
  o.targetDom.find( '*' ).addBack().each( function( k,dom )
  {
    dom.dispatchEvent( event );
  });

}

eventFire.defaults =
{
  targetDom : null,
  kind : null,
  extendMap : null,
  extendingByOptions : 1,
  informingDescandants : 0,
}

//

function eventFire2( targetDom, event )
{

  _.assert( _.domIs( targetDom ) );

  if ( targetDom.dispatchEvent )
  {
    targetDom.dispatchEvent( event );
  }
  else if( targetDom.fireEvent )
  {
    targetDom.fireEvent( 'on' + type, event );
  }

  return event;
}

// --
// prototype
// --

var Proto =
{

  // dom

  domCaretSelect : domCaretSelect,
  domVal : domVal,

  domsVal : domsVal,

  domClass : domClass,
  domClasses : domClasses,
  domAttrs : domAttrs,

  domAttrHasAny : domAttrHasAny,
  domAttrHasAll : domAttrHasAll,
  domAttrHasNone : domAttrHasNone,

  domTextGet : domTextGet,
  domAttrInherited : domAttrInherited,

  domNickname : domNickname,
  domOf : domOf,

  domLeftTopGet : domLeftTopGet,
  domLeftTopSet : domLeftTopSet,
  domCenterSet : domCenterSet,

  domPositionGet : domPositionGet,
  domBoundingBoxGet : domBoundingBoxGet,
  domBoundingBoxGlobalGet : domBoundingBoxGlobalGet,

  domSizeGet : domSizeGet,
  domSizeFastGet : domSizeFastGet,
  domsSizeGet : domsSizeGet,
  domsSizeFastGet : domsSizeFastGet,

  domRadiusGet : domRadiusGet,
  domRadiusFastGet : domRadiusFastGet,
  domsRadiusGet : domsRadiusGet,
  domsRadiusFastGet : domsRadiusFastGet,

  domFirst : domFirst,
  domFirstOf : domFirstOf,

  domOwnIdentity : domOwnIdentity,

  domCssGet : domCssGet,
  domCssSet : domCssSet,
  domCssGlobal : domCssGlobal,
  domCssExport : domCssExport,

  domEmToPx : domEmToPx,

  domEach : domEach,
  _domEach : _domEach,

  domClipboardCopy : domClipboardCopy,
  domFullScreen : domFullScreen,

  domLoad : domLoad,

  // event

  eventName : eventName,
  eventClientPosition : eventClientPosition,
  eventRedirect : eventRedirect,
  eventMouse : eventMouse,

  /*eventWheelZero : eventWheelZero,*/
  eventWheelDelta : eventWheelDelta,
  eventWheelDeltaScreen : eventWheelDeltaScreen,
  eventSpecialMake : eventSpecialMake,

  eventsObserver : eventsObserver,
  eventsBindAll : eventsBindAll,
  eventsBindWatcher : eventsBindWatcher,
  eventFire : eventFire,
  eventFire2 : eventFire2,

  // on

};

_.mapExtend( wTools,Proto );

})();
