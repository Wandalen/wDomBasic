( function _Common_js_()
{

'use strict';

const _ = _global_.wTools;
let $ = typeof jQuery === 'undefined' ? null : jQuery;
// let $ = typeof jQuery !== 'undefined' ? jQuery : null;
const Self = _.dom = _.dom || Object.create( null );
let isApple = navigator.platform.match( /(Mac|iPhone|iPod|iPad)/i );

//
// dom
//

// function strToDom( xmlStr )
function fromStr( xmlStr )
{

  let xmlDoc = null;
  let isIEParser = window.ActiveXObject || 'ActiveXObject' in window;

  if( xmlStr === undefined )
  return xmlDoc;

  if( window.DOMParser )
  {

    let parser = new window.DOMParser();
    let parsererrorNS = null;

    if( !isIEParser )
    {
      try
      {
        parsererrorNS = parser.parseFromString( 'INVALID', 'text/xml' ).childNodes[ 0 ].namespaceURI;
      }
      catch( err )
      {
        parsererrorNS = null;
      }
    }

    try
    {
      xmlDoc = parser.parseFromString( xmlStr, 'text/xml' );
      if( parsererrorNS !== null && xmlDoc.getElementsByTagNameNS( parsererrorNS, 'parsererror' ).length > 0 )
      {
        throw Error( 'Error parsing XML' );
        xmlDoc = null;
      }
    }
    catch( err )
    {
      throw Error( 'Error parsing XML' );
      xmlDoc = null;
    }
  }
  else
  {
    if( xmlStr.indexOf( '<?' ) === 0 )
    {
      xmlStr = xmlStr.substr( xmlStr.indexOf( '?>' ) + 2 );
    }
    xmlDoc = new ActiveXObject( 'Microsoft.XMLDOM' );
    xmlDoc.async = 'false';
    xmlDoc.loadXML( xmlStr );
  }

  return xmlDoc;
}

//

/**
 * @param {} dom
 * @param {} selection
 * @function caretSelect
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function caretSelect( dom, selection )
{

  if( _.dom.jqueryIs( dom ) )
  dom = dom[ 0 ];

  if( selection === undefined )
  {
    if( dom.selectionStart !== undefined )
    {
      return [ dom.selectionStart, dom.selectionEnd, dom.selectionDirection ];
    }
    else if( dom.getSelectionRange )
    {
      return [ dom.getSelectionRange().x, dom.getSelectionRange().y ];
    }
    else if( dom.createTextRange )
    {
      let range = dom.createTextRange();
      return [ range.startOffset, range.endOffset ];
    }
  }
  else
  {
    if( !_.arrayIs( selection ) ) selection = [ selection ];
    dom.focus();
    if( dom.setSelectionRange )
    {
      dom.setSelectionRange( selection[ 0 ], selection[ 1 ], selection[ 2 ] );
    }
    else if( dom.selectionStart !== undefined )
    {
      dom.selectionEnd = selection[ 0 ];
      dom.selectionStart = selection[ 1 ];
      // dom.focus();
    }
    else if( dom.createTextRange )
    {
      let range = dom.createTextRange();
      range.collapse( true );
      range.moveEnd( 'character', selection[ 1 ] );
      range.moveStart( 'character', selection[ 0 ] );
      range.select();
      // dom.focus();
    }
    dom.focus();
  }

  // if( selection !== undefined )
  // {
  //   if( !_.arrayIs( selection ) ) selection = [ selection ];
  //   dom.focus();
  //   if( dom.setSelectionRange )
  //   {
  //     dom.setSelectionRange( selection[ 0 ], selection[ 1 ], selection[ 2 ] );
  //   }
  //   else if( dom.selectionStart !== undefined )
  //   {
  //     dom.selectionEnd = selection[ 0 ];
  //     dom.selectionStart = selection[ 1 ];
  //     // dom.focus();
  //   }
  //   else if( dom.createTextRange )
  //   {
  //     let range = dom.createTextRange();
  //     range.collapse( true );
  //     range.moveEnd( 'character', selection[ 1 ] );
  //     range.moveStart( 'character', selection[ 0 ] );
  //     range.select();
  //     // dom.focus();
  //   }
  //   dom.focus();
  // }
  // else
  // {
  //
  //   if( dom.selectionStart !== undefined )
  //   {
  //     return [ dom.selectionStart, dom.selectionEnd, dom.selectionDirection ];
  //   }
  //   else if( dom.getSelectionRange )
  //   {
  //     return [ dom.getSelectionRange().x, dom.getSelectionRange().y ];
  //   }
  //   else if( dom.createTextRange )
  //   {
  //     let range = dom.createTextRange();
  //     return [ range.startOffset, range.endOffset ];
  //   }
  // }

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
 * @function val
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function val( dom, val )
{

  var result;
  dom = $( dom );

  _.assert( arguments.length === 1 || arguments.length === 2 );

  if( val === undefined )
  {

    if( dom.is( 'input[ type=checkbox ]' ) )
    {
      result = !!dom[ 0 ].checked;
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
  else
  {

    var caretSelected;
    if( document.activeElement === dom[ 0 ] )
    caretSelected = caretSelect( dom[ 0 ] );

    if( dom.is( 'input[ type=checkbox ]' ) )
    {
      result = !!dom[ 0 ].checked;
      dom[ 0 ].checked = !!val;
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
    caretSelect( dom, caretSelected );

  }

  // if( val !== undefined )
  // {
  //
  //   var caretSelected;
  //   if( document.activeElement === dom[ 0 ] )
  //   caretSelected = caretSelect( dom[ 0 ] );
  //
  //   if( dom.is( 'input[ type=checkbox ]' ) )
  //   {
  //     result = !!dom[ 0 ].checked;
  //     dom[ 0 ].checked = !!val;
  //   }
  //   else if( dom.is( 'input' ) )
  //   {
  //     result = dom[ 0 ].value;
  //     dom[ 0 ].value = val;
  //   }
  //   else
  //   {
  //     result = dom.text();
  //     dom.text( val );
  //   }
  //
  //   if( caretSelected )
  //   caretSelect( dom, caretSelected );
  //
  // }
  // else
  // {
  //
  //   if( dom.is( 'input[ type=checkbox ]' ) )
  //   {
  //     result = !!dom[ 0 ].checked;
  //   }
  //   else if( dom.is( 'input' ) )
  //   {
  //
  //     result = dom[ 0 ].value;
  //
  //     if( result === '' || result === undefined )
  //     result = dom[ 0 ].defaultFieldsMap;
  //
  //     if( result === '' || result === undefined )
  //     result = dom[ 0 ].placeholder;
  //
  //   }
  //   /*
  //       else
  //       {
  //         result = dom.text();
  //       }
  //   */
  // }

  return result;
}

//

function attr( dom, attr, value )
{
  _.assert( arguments.length === 2 || arguments.length === 3, 'Expects two or three arguments' );
  _.assert( _.strDefined( attr ) );

  dom = _.dom.from( dom );

  if( arguments.length === 2 )
  return dom.getAttribute( attr );

  dom.setAttribute( attr, value );
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
 * @function class
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function _class( dom, cssClass, adding )
{

  _.assert( arguments.length === 2 || arguments.length === 3, 'Expects two or three arguments' );
  _.assert( _.dom.domableIs( dom ) );
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

function addClass( targetDom, cssClass )
{
  _.assert( arguments.length === 2, 'Expects two arguments' );
  _.assert( _.strDefined( cssClass ) || _.arrayIs( cssClass ) );

  targetDom = _.dom.from( targetDom );
  _.assert( _.dom.is( targetDom ) );

  if( _.strIs( cssClass ) );
  cssClass = _.strSplitNonPreserving( cssClass, /\s+/g );

  targetDom.classList.add.apply( targetDom.classList, cssClass );
}

//

function removeClass( targetDom, cssClass )
{
  _.assert( arguments.length === 2, 'Expects two arguments' );
  _.assert( _.strDefined( cssClass ) || _.arrayIs( cssClass ) );

  targetDom = _.dom.from( targetDom );
  _.assert( _.dom.is( targetDom ) );

  if( _.strIs( cssClass ) );
  cssClass = _.strSplitNonPreserving( cssClass, /\s+/g );

  targetDom.classList.remove.apply( targetDom.classList, cssClass );
}

//

function hasClass( targetDom, cssClass )
{
  _.assert( arguments.length === 2, 'Expects two arguments' );
  _.assert( _.strDefined( cssClass ) );

  targetDom = _.dom.from( targetDom );
  _.assert( _.dom.is( targetDom ) );

  return targetDom.classList.contains( cssClass );
}

//

/**
 * @summary Returns true if `dom` element has at least one attribute from `attrs`.
 * @param {String|Object} dom Target dom.
 * @param {Array} attrs Source attributes.
 * @function attrHasAny
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function attrHasAny( dom, attrs )
{
  let has = _.props.keys( _.dom.s.attr( dom ) );
  return _.longHasAny( has, attrs );
}

//

/**
 * @summary Returns true if `dom` element has all attribute from `attrs`.
 * @param {String|Object} dom Target dom.
 * @param {Array} attrs Source attributes.
 * @function attrHasAny
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function attrHasAll( dom, attrs )
{
  let has = _.props.keys( _.dom.s.attr( dom ) );
  return _.longHasAll( has, attrs );
}

//

/**
 * @summary Returns true if `dom` element doesn't have any attribute from `attrs`.
 * @param {String|Object} dom Target dom.
 * @param {Array} attrs Source attributes.
 * @function attrHasAny
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function attrHasNone( dom, attrs )
{
  let has = _.props.keys( _.dom.s.attr( dom ) );
  return _.longHasNone( has, attrs );
}

//

/**
 * @summary Recursively collects text content of the `dom` element.
 * @param {Object} o Options object.
 * @param {Object|String} o.targetDom Dom element.
 * @param {Object} o.strippingEmptyLines Removes empty lines from text.
 * @param {Object} o.strippingEnds Removes empty whitespaces from the beginning/ending of the string.
 * @function textGet
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function textGet( o )
{

  if( _.dom.domableIs( o ) )
  o = { targetDom : o }
  _.routine.options_( textGet, o );

  let result = _.dom.each
  ({
    recursive : true,
    result : '',
    dom : o.targetDom,
    onUp : function( dom, iterator )
    {
      let text = '';

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

  if( o.strippingEmptyLines )
  result = _.strStripEmptyLines( result );

  return result;
}

textGet.defaults =
{
  targetDom : null,
  strippingEmptyLines : 1,
  strippingEnds : 1,
}

//

function setText( dst, text )
{
  _.assert( arguments.length === 2 );

  let targetDom = _.dom.from( dst );

  _.assert( _.dom.is( targetDom ) );
  _.assert( _.strIs( text ) );

  targetDom.textContent = text;
}

//

/**
 * @summary Looks for attribute `attrName` on `dom` element and it parents.
 * @description Returns value of attribute of undefined if nothing found.
 * @param {Object|String} dom Dom element.
 * @param {String} attrName Attributes to find.
 * @function attrInherited
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function attrInherited( dom, attrName )
{
  var result;

  if( _.dom.jqueryIs( dom ) )
  dom = dom[ 0 ];

  _.assert( arguments.length === 2, 'Expects exactly two arguments' );
  _.assert( _.dom.is( dom ) );
  _.assert( _.strIs( attrName ) );

  let p = dom;
  do
  {
    result = p.getAttribute( attrName );
    p = p.parentNode;
  }
  while( p && p !== document && _.entity.strType( p ) !== 'DocumentFragment' && ( result === null || result === undefined ) );

  return result;
}

//

/**
 * @summary Generates selector for `dom` element using it properties.
 * @param {Object|String} dom Dom element.
 * @param {String} attrName Attributes to find.
 * @function nickname
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function nickname( dom, attrName )
{

  if( _.dom.jqueryIs( dom ) )
  dom = dom[ 0 ];

  _.assert( arguments.length <= 2 );
  _.assert( _.dom.is( dom ) );

  let name = dom.tagName.toLowerCase();

  if( dom.id )
  name += '#' + dom.id;

  if( dom.className )
  name += '.' + dom.className.split( ' ' ).join( '.' );

  if( attrName && dom.getAttribute( attrName ) )
  name += '[ ' + attrName + '=' + dom.getAttribute( attrName ) + ' ]';

  return name;
}

//

function of( parent, children )
{

  _.assert( arguments.length === 2, 'Expects exactly two arguments' );
  _.assert( _.dom.domableIs( parent ) );
  _.assert( _.dom.domableIs( children ) );

  // if( !children )
  // return children;

  parent = $( parent );

  if( _.strIs( children ) )
  children = parent.find( children );

  return children;
}

//

function leftTopGet( dom )
{

  _.assert( _.dom.domableIs( dom ) );
  _.assert( arguments.length === 1, 'Expects single argument' );

  dom = $( dom );
  let result = [];

  result[ 0 ] = dom.css( 'left' );
  result[ 1 ] = dom.css( 'top' );

  for( let i = 0 ; i < 2 ; i++ )
  if( _.strIs( result[ i ] ) )
  result[ i ] = _.strRemoveEnd( result[ i ], 'px' );

  result = _.numbersFrom( result );

  return result;
}

//

function leftTopSet( dom, pos )
{

  _.assert( _.dom.domableIs( dom ) );
  _.assert( pos.length === 2 );
  _.assert( arguments.length === 2, 'Expects exactly two arguments' );

  dom = $( dom );

  dom.css
  ({
    left : pos[ 0 ],
    top : pos[ 1 ],
  });

}

//

function centerSet( dom, pos )
{

  _.assert( _.dom.domableIs( dom ) );
  _.assert( pos.length === 2 );
  _.assert( arguments.length === 2, 'Expects exactly two arguments' );

  dom = $( dom );
  let size = _.dom.sizeFastGet( dom );

  _.assert( dom.length === 1 );

  //logger.log( 'size',size );

  dom.css
  ({
    left : pos[ 0 ] - size[ 0 ] / 2,
    top : pos[ 1 ] - size[ 1 ] / 2,
  });

}

//

function positionGet( dom )
{
  dom = $( dom );

  _.assert( dom.length === 1 );

  let result = dom.position();

  result = [ result.left, result.top ];

  dom[ 0 ]._positionGet = result;

  return result;
}

//

function boundingBoxGet( dom )
{
  dom = $( dom );

  _.assert( dom.length === 1 );

  let child = dom[ 0 ].getBoundingClientRect();
  let parent = dom[ 0 ].parentNode.getBoundingClientRect();

  let result = [ child.left-parent.left, child.top-parent.top, child.right-parent.left, child.bottom-parent.top ];

  return result;
}

//

function boundingBoxGlobalGet( dom )
{
  dom = $( dom );

  _.assert( dom.length === 1 );

  let child = dom[ 0 ].getBoundingClientRect();
  let result = [ child.left, child.top, child.right, child.bottom ];

  dom[ 0 ]._domBondingBoxGet = result;

  return result;
}

//

function sizeGet( dom )
{
  let result = [];
  dom = $( dom );

  _.assert( dom.length === 1 );

  result = [ dom.outerWidth(), dom.outerHeight() ];
  dom[ 0 ]._sizeGet = result;

  return result;
}

//

function size2( dom )
{
  dom = _.dom.from( dom );
  let style = window.getComputedStyle( dom, null );
  let result = [ 0, 0 ];

  result[ 0 ] = Number.parseFloat( style.width.replace( 'px', '' ) );
  result[ 1 ] = Number.parseFloat( style.height.replace( 'px', '' ) );

  return result;
}

//

function width( dom )
{
  dom = _.dom.from( dom );
  let style = window.getComputedStyle( dom, null );
  return Number.parseFloat( style.width.replace( 'px', '' ) );
}

//

function height( dom )
{
  dom = _.dom.from( dom );
  let style = window.getComputedStyle( dom, null );
  return Number.parseFloat( style.height.replace( 'px', '' ) );
}

//

function sizeFastGet( dom )
{
  dom = $( dom );

  if( dom[ 0 ]._sizeGet )
  return dom[ 0 ]._sizeGet;

  return sizeGet( dom );

}

//

function radiusGet( dom )
{
  var result;
  dom = $( dom );

  result = Math.min( dom.outerWidth(), dom.outerHeight() );
  dom[ 0 ]._radiusGet = result;

  return result;
}

//

function radiusFastGet( dom )
{
  dom = $( dom );

  if( dom[ 0 ]._radiusGet )
  return dom[ 0 ]._radiusGet;

  return sizeGet( dom );

}

//

function offset( dom )
{
  dom = _.dom.from( dom );

  if( !dom.getClientRects().length )return { top : 0, left : 0 };

  let rect = dom.getBoundingClientRect();
  let win = dom.ownerDocument.defaultView;
  let result =
  {
    top : rect.top + win.pageYOffset,
    left : rect.left + win.pageXOffset
  };
  return result;
}

//

function first()
{

  for( let a = 0 ; a < arguments.length ; a++ )
  {

    let src = arguments[ a ];
    if( !_.dom.domableIs( src ) )
    continue;

    src = $( src );
    if( !src.length )
    continue;

    return src[ 0 ];
  }

  return;
}

//

function firstOf( src, selector )
{

  _.assert( _.dom.domableIs( src ) );
  _.assert( _.strIs( selector ) );
  _.assert( arguments.length === 2, 'Expects exactly two arguments' );

  selector += ':first';
  src = $( src );

  let result = src.filter( selector );

  if( result.length )
  return result[ 0 ];

  result = src.find( selector );

  return result[ 0 ];
}

//

function ownIdentity( dom, identity )
{

  dom = $( dom );

  _.assert( dom.length === 1 );
  _.assert( arguments.length === 1 || arguments.length === 2 );
  _.assert( identity === undefined || _.strIs( identity ) );

  if( identity === undefined )
  {

    let cssClasses = dom[ 0 ].className;
    let result = '';

    if( cssClasses.length )
    {
      cssClasses = cssClasses.split( /\s+/ );
      result += '.' + cssClasses.join( '.' );
    }

    // if( dom[ 0 ].id )
    // debugger;

    if( dom[ 0 ].id )
    result = '#' + dom[ 0 ].id + result;

    _.assert( !!result );

    return result;
  }

  identity = _.strIsolateEndOrAll( identity, ' ' )[ 2 ];

  _.assert( identity.indexOf( ' ' ) === -1 );

  identity = _.strSplitFast
  ({
    src : identity,
    delimeter : [ '.', '#', '[', ']' ],
    preservingDelimeters : 1,
    preservingEmpty : 0,
  });

  for( let i = 1 ; i < identity.length ; i+=2 )
  {
    if( identity[ i-1 ] === '.' )
    {
      dom.addClass( identity[ i ] );
    }
    else if( identity[ i-1 ] === '#' )
    {
      dom.attr( 'id', identity[ i ] );
    }
    else if( identity[ i-1 ] === '[' && identity[ i+1 ] === ']' )
    {
      let attrStrSplitted = _.strSplitNonPreserving({ src : identity[ i ], delimeter : '=' });
      _.assert( attrStrSplitted.length === 2, 'ownIdentity expects attribute identity of format: attr=val, got:', identity[ i ] );
      dom.attr( attrStrSplitted[ 0 ], attrStrSplitted[ 1 ] );
      i += 1;
    }
    else
    {
      throw _.err( 'unknown prefix', identity[ i-1 ] );
    }
  }

}

//

function cssGet( dom, fields )
{
  let result = Object.create( null );

  dom = $( dom )

  _.assert( arguments.length === 2, 'Expects exactly two arguments' );
  _.assert( dom.length === 1 );
  _.assert( _.strIs( fields ) || _.arrayIs( fields ) || _.mapIs( fields ) );

  if( _.strIs( fields ) )
  {
    result[ fields ] = dom.css( fields );
  }
  else if( _.arrayIs( fields ) )
  {
    for( let f = 0 ; f < fields.length ; f++ )
    result[ fields[ f ] ] = dom.css( fields[ f ] );
  }
  else if( _.mapIs( fields ) )
  {
    for( var f in fields.length )
    result[ fields[ f ] ] = dom.css( fields[ f ] );
  }

  return result;
}

//

function cssSet( dom, fields )
{

  dom = $( dom )

  _.assert( arguments.length === 2, 'Expects exactly two arguments' );
  _.assert( dom.length === 1 );
  _.assert( _.mapIs( fields ) );

  dom.css( fields );

  return dom;
}

//

function emToPx( dom, em )
{
  let emSize = parseFloat( dom.css( 'font-size' ) );
  return ( emSize * em );
}

//

function each( o )
{

  _.routine.options_( each, o );
  _.assert( _.dom.domableIs( o.dom ) );

  o.dom = _.dom.from( o.dom );

  for( let d = 0 ; d < o.dom.length ; d++ )
  {
    _each( o.dom[ d ], o );
  }

  return o.result;
}

each.defaults =
{
  dom : null,
  result : null,
  recursive : true,
  usingNodeTypeElement : true,
  usingNodeTypeText : true,
  usingNodeTypesAll : false,
  onUp : function( dom, o ){},
  onDown : function( dom, o ){},
}

//

function _each( dom, o )
{

  _.assert( _.dom.is( dom ) );

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

  let r = o.onUp( dom, o );
  _.assert( r === undefined );

  let children = dom.childNodes;
  for( let d = 0 ; d < children.length ; d++ )
  {
    let dom = children[ d ];
    _each( dom, o );
  }

  r = o.onDown( dom, o );
  _.assert( r === undefined );

  return o.context;
}

//

let _domGlobalCssKeysArray = [];
function cssGlobal( o )
{

  if( _.strIs( o ) )
  o = { css : o }

  _.routine.options_( cssGlobal, o );

  if( o.document === null )
  o.document = document;

  _.assert( o.document.head );
  _.assert( _.strIs( o.css ) );
  _.assert( arguments.length === 1, 'Expects single argument' );

  if( o.once )
  {

    if( o.key === null )
    o.key = o.css;
    if( _.longHas( _domGlobalCssKeysArray, [ o.key, o.document ], _.long.identical ) )
    return;
    _domGlobalCssKeysArray.push([ o.key, o.document ]);

  }

  let result = $( '<style>' + o.css + '<style>' ).appendTo( o.document.head );

  return result;
}

cssGlobal.defaults =
{
  document : null,
  css : null,
  once : 1,
  key : null,
}

//

function cssExport( o )
{
  if( o instanceof Document )
  o = { dstDocument : o }

  _.routine.options_( cssExport, o );

  if( o.srcDocument === null )
  o.srcDocument = document;

  _.assert( o.srcDocument.head );
  _.assert( o.dstDocument.head );
  _.assert( arguments.length === 1, 'Expects single argument' );

  let styles = o.srcDocument.getElementsByTagName( 'style' );

  for( let s = 0 ; s < styles.length ; s++ )
  {
    let style = styles[ s ];
    let css = style.textContent;

    // console.log( 'css',css.length );
    // if( !css )
    // debugger;

    _.dom.cssGlobal
    ({
      document : o.dstDocument,
      css,
      once : 0,
    });

  }

}

cssExport.defaults =
{
  dstDocument : null,
  srcDocument : null,
}

//

function css( /* targetDom, property, value, priority */ )
{
  _.assert( arguments.length >= 2, 'Expects at least two arguments' );

  let targetDom = arguments[ 0 ];
  let property = arguments[ 1 ];
  let value = arguments[ 2 ];
  let priority = arguments[ 3 ];

  targetDom = _.dom.from( targetDom );

  _.assert( _.dom.is( targetDom ) );

  if( arguments.length === 2 )
  {
    if( _.object.isBasic( property ) )
    {
      for( let key in property )
      targetDom.style.setProperty( key, property[ key ] )
    }
    else
    {
      _.assert( _.strIs( property ) );
      return window.getComputedStyle( targetDom ).getPropertyValue( property );
    }
  }
  else
  {
    targetDom.style.setProperty( property, value, priority );
  }

}

//

function clipboardCopy( text )
{
  let result = false;
  let textArea = document.createElement( 'textarea' );

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
    _.errLog( 'Failed to copy into clipboard', err );
  }

  document.body.removeChild( textArea );
  return result;
}

//

let fullScreen = ( function fullScreen()
{

  let inFullscreen = 0;
  let requestFullScreen = null;
  let cancelFullScreen = null;

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

  return function fullScreen( src )
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
        // alert( 'Fullscreen is not supported.' );
        console.warn( 'Fullscreen is not supported.' );
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
        // alert( 'Fullscreen is not supported.' );
        console.warn( 'Fullscreen is not supported.' );
      }

    }

  }

})();

//

function load( o )
{

  _.routine.options_( load, o );

  o.once = new _.Consequence();
  o.ready = new _.Consequence();

  o.parentDom = $( o.parentDom );
  let targetDom = o.parentDom;
  if( o.targetClass )
  targetDom = o.parentDom.find( '.' + o.targetClass ).addBack( '.' + o.targetClass );

  if( !targetDom.length )
  if( o.replacing )
  targetDom = o.parentDom;
  else
  targetDom = $( '<div>' ).prependTo( o.parentDom );

  /* */

  function showMaybe()
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
    showMaybe();
    o.ready.take( targetDom );
    return o;
  }

  if( o.targetClass )
  _.dom.s.class( targetDom, o.targetClass, 1 );

  /* */

  _.assert( _.mapIs( o ) );
  _.assert( arguments.length === 1, 'Expects single argument' );
  // _.assert( _.strIs( o.targetClass ) || o.replacing );
  _.assert( _.strDefined( o.url ), 'Expects {-o.url-}' );
  _.assert( o.parentDom.length > 0, 'Expects { o.parentDom }' );
  _.assert( targetDom.length > 0, 'Expects { targetDom }' );

  /* */

  function loadEnd( responseData, status, xhr )
  {

    _.assert( arguments.length === 3, 'Expects exactly three argument' );

    if( status !== 'error' && o.replacing )try
    {
      _.assert( _.strIs( responseData ) );
      responseData = $( responseData );
    }
    catch( err )
    {
      status = 'error';
      let reason = _.err( err );
    }

    if( status === 'error' )
    {
      var reason;
      if( _.object.isBasic( xhr ) )
      reason = xhr.status + ' : ' + xhr.statusText;
      else
      reason = responseData.status + ' : ' + responseData.statusText;
      reason += ' : ' + o.url;
      let html = 'Error ' + reason;
      targetDom.html( html );
      let err = _.errLogOnce( reason );
      o.ready.error( err );
      o.once.error( err );
      return;
    }

    if( o.replacing )
    {
      let classes = _.dom.s.class( targetDom );
      let attrs = _.dom.s.attr( targetDom );

      if( o.after || o.before )
      {
        targetDom = targetDom.find( o.after || o.before );
        _.assert( targetDom.length > 0, o.after ? 'after' : 'before', 'DOM was not found', o.after || o.before );
        if( o.after )
        targetDom = targetDom.after( responseData );
        else
        targetDom = targetDom.before( responseData );
      }
      else
      {
        targetDom = targetDom.replaceWith( responseData );
      }
      targetDom = responseData;

      if( o.targetClass )
      _.dom.s.class( targetDom, o.targetClass, 1 );
      if( o.preservingAttributes )
      _.dom.s.attr( targetDom, attrs, 1 );
      if( o.preservingClasses )
      _.dom.s.class( targetDom, classes, 1 );
    }

    o.parentDom.attr( 'dom-loaded', 1 );

    showMaybe();

    o.ready.take( targetDom );
    o.once.take( targetDom );

  }

  /* */

  if( o.replacing )
  $.get( o.url ).always( loadEnd );
  else
  targetDom.load( o.url, loadEnd );

  return o;
}

load.defaults =
{
  url : null,
  targetClass : null,
  parentDom : 'body',
  showing : 0,
  replacing : 1,
  before : null,
  after : null,
  preservingClasses : 1,
  preservingAttributes : 1,
}

// --
// event
// --

let eventName = ( function eventName()
{
  let _eventMap = null;

  return function( name )
  {

    if( _.arrayIs( name ) )
    {
      let result = [ ];

      for( let n = 0 ; n < name.length ; n++ )
      result[ n ] = this.eventName( name[ n ] );

      return result;
    }
    else if( !_.strIs( name ) )
    throw _.err( 'eventName :', 'expect string or array as argument' );

    let touchSupported = ( 'ontouchstart' in window ) || ( 'onmsgesturechange' in window );
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
        else if( 'onclick' in window )
        _eventMap[ 'click' ] = 'touchend';
        else
        _eventMap[ 'click' ] = 'click';

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

    if( _eventMap[ name ] )return _eventMap[ name ];
    else return name;

  }

})();

//

function eventClientPosition( o )
{
  var result;

  if( _.dom.eventIs( o ) )
  o = { event : o };

  let event = o.event;
  let relative = o.relative;

  if( relative )
  relative = _.dom.from( relative );

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( _.dom.eventIs( event ) );
  _.assert( !o.flip || _.arrayIs( o.flip ) );
  _.map.assertHasOnly( o, eventClientPosition.defaults );

  if( _.numberIs( event.pageX ) )
  result = [ event.pageX, event.pageY ];

  if( event.originalEvent )
  event = event.originalEvent;

  if( event.targetTouches && event.targetTouches.length )
  result = [ event.targetTouches[ 0 ].pageX, event.targetTouches[ 0 ].pageY ];

  if( event.changedTouches && event.changedTouches.length )
  result = [ event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY ];

  _.assert( !relative || _.dom.is( relative ), 'eventClientPosition :', 'relative must be jQuery object if defined' );


  if( relative && result )
  {
    let offset = _.dom.offset( relative );
    result[ 0 ] -= offset.left;
    result[ 1 ] -= offset.top;
  }

  if( o.flip )
  {

    if( !relative )
    throw _.err( 'not implemented' );

    let size = _.dom.sizeGet( relative );

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

function eventRedirect( dst, src )
{

  src = $( src );
  dst = $( dst );

  function handleRedirect( event )
  {
    if( event.originalEvent && !event.originalEvent.doNotRedirect ) dst.trigger( event );
    return true;
  }

  function handleMark( event )
  {
    if( event.originalEvent ) event.originalEvent.doNotRedirect = 1;
  }

  function handleStop( event )
  {
    return false;
  }

  src.children()
  .on( 'blur focus focusin focusout load resize scroll unload click dblclick '
  + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '
  + 'change select submit keydown keypress keyup error contextmenu mousewheel', handleMark );

  //src.on( "mousemove", handleRedirect );

  //src.on( "mousedown mouseup mousemove", handleRedirect );

  //src.on( "blur focus focusin focusout click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave mousewheel", handleRedirect );

  src.on( 'blur focus focusin focusout load resize scroll unload click dblclick '
  + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '
  + 'change select submit keydown keypress keyup error contextmenu mousewheel', handleRedirect );

}

//

function eventMouse( type, cx, cy )
{

  if( cx === undefined ) cx = 0;
  if( cy === undefined ) cy = 0;

  let sx = cx + window.screenX;
  let sy = cy + window.screenY;

  var event;
  let e = {
    bubbles : true,
    cancelable : ( type !== 'mousemove' ),
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

  if( typeof( document.createEvent ) === 'function' )
  {
    event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( type,
      e.bubbles, e.cancelable, e.view, e.detail,
      e.screenX, e.screenY, e.clientX, e.clientY,
      e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
      e.button, null );
    //e.button, document.body.parentNode );
  }
  else if( document.createEventObject )
  {
    event = document.createEventObject();
    for( prop in e )
    {
      event[ prop ] = e[ prop ];
    }
    event.button = { 0 : 1, 1 : 4, 2 : 2 }[ event.button ] || event.button;
  }

  //event.fromElement = null;

  return event;
}

//

function on( targetDom, eventName, eventHandler )
{
  _.assert( arguments.length === 3 );
  _.assert( _.routineIs( eventHandler ) );

  eventName = _.dom.eventName( eventName );
  _.assert( _.strDefined( eventName ) );

  targetDom = _.dom.from( targetDom );
  _.assert( _.dom.like( targetDom ) );

  _.assert( _.routineIs( targetDom.addEventListener ) );

  let namespaces = null;

  if( _.strHas( eventName, '.' ) )
  {
    namespaces = _.strSplitNonPreserving( eventName, '.' );
    eventName = namespaces.shift();
  }

  if( !targetDom._eventHandler )
  _eventHandlerAdd( targetDom );

  targetDom.addEventListener( eventName, targetDom._eventHandler );

  _.assert( _.strDefined( eventName ) );

  namespaces = _.array.as( namespaces );
  if( !namespaces.length )
  namespaces.push( null );

  if( !targetDom._events )
  {
    targetDom._events = Object.create( null );
    targetDom._eventsCount = 0;
  }
  if( !targetDom._events[ eventName ] )
  {
    targetDom._events[ eventName ] = [];
    targetDom._eventsCount += 1;
  }

  namespaces.forEach( ( namespace ) =>
  {
    targetDom._events[ eventName ].push({ eventHandler, namespace })
  })
}

//

function _eventHandlerAdd( targetDom )
{
  targetDom._eventHandler = function( event )
  {
    event._stopImmediatePropagation = event.stopImmediatePropagation;
    event.stopImmediatePropagation = function()
    {
      this._stopImmediatePropagation();
      this.immediatePropagationStopped = true;
    };

    let descriptors = this._events[ event.type ].slice();
    for( let i = 0, l = descriptors.length; i < l ; i++ )
    {
      if( event.immediatePropagationStopped )
      break;

      let current = descriptors[ i ];
      event.namespace = current.namespace;
      event.result = current.eventHandler.apply( this, arguments );
      event.originalEvent = event;

      if( event.result !== false )
      continue;

      event.preventDefault();
      event.stopPropagation();
    }
  }
}

//

function off( targetDom, eventName, eventHandler )
{
  _.assert( arguments.length === 2 || _.routineIs( eventHandler ) );

  targetDom = _.dom.from( targetDom );
  _.assert( _.dom.like( targetDom ) );

  let namespaces = null;

  if( _.strHas( eventName, '.' ) )
  {
    namespaces = _.strSplitNonPreserving( eventName, '.' );
    eventName = namespaces.shift();
  }

  eventName = _.dom.eventName( eventName );
  _.assert( _.strDefined( eventName ) );

  if( !targetDom._events )
  return;
  if( !targetDom._events[ eventName ])
  return;

  namespaces = _.array.as( namespaces );

  if( !namespaces.length )
  namespaces.push( null );

  let descriptors = targetDom._events[ eventName ];

  for( let i = descriptors.length - 1; i >= 0; i-- )
  {
    let descriptor = descriptors[ i ];
    if( !eventHandler || descriptor.eventHandler === eventHandler )
    if( _.longHas( namespaces, descriptor.namespace ) )
    descriptors.splice( i, 1 );
  }

  if( !descriptors.length )
  {
    targetDom.removeEventListener( eventName, targetDom._eventHandler );
    delete targetDom._events[ eventName ];
    targetDom._eventsCount -= 1;
    if( !targetDom._eventsCount )
    {
      delete targetDom._events;
      delete targetDom._eventsCount;
      delete targetDom._eventHandler;
    }
  }
}

//
/*
function eventWheelZero( event,x,y )
{
  _.assert( arguments.length === 3, 'Expects exactly three argument' );
  var wrap;
  let o = Object.create( null );

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

  let result = new event.constructor( o );

  if( wrap )
  {
    let o = Object.create( null );
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

function fromAtLeastOne( targetDom )
{
  let wasDom = targetDom;

  _.assert( arguments.length === 1 );
  _.assert( _.dom.domableIs( targetDom ) );
  targetDom = $( targetDom );
  _.assert( targetDom.length > 0, 'Expects at least one DOM element, but found none for', wasDom );

  return targetDom;
}

//

let lowestDelta = null;
function mousewheel( o )
{
  _.assert( arguments.length === 1 );
  _.routine.options_( mousewheel, o );
  _.assert( _.routineIs( o.onWheel ) );

  let targetDom = _.dom.from( o.targetDom );
  _.assert( _.dom.is( targetDom ) );

  if( typeof document.onwheel !== undefined || document.documentMode >= 9 )
  {
    targetDom.addEventListener( 'wheel', _mousewheelHandler, false );
  }
  else
  {
    targetDom.addEventListener( 'mousewheel', _mousewheelHandler, false );
    targetDom.addEventListener( 'DomMouseScroll', _mousewheelHandler, false );
    targetDom.addEventListener( 'MozMousePixelScroll', _mousewheelHandler, false );
  }

  //

  function _mousewheelHandler( e )
  {
    //based on https://github.com/jquery/jquery-mousewheel/blob/master/jquery.mousewheel.js

    let delta = 0;
    let deltaX = 0;
    let deltaY = 0;

    e.preventDefault();

    if( _.numberIs( e.detail ) )
    deltaY = e.detail * -1;
    if( _.numberIs( e.wheelDelta ) )
    deltaY = e.wheelDelta;
    if( _.numberIs( e.wheelDeltaY ) )
    deltaY = e.wheelDeltaY;
    if( _.numberIs( e.wheelDeltaX ) )
    deltaX = e.wheelDeltaX * -1;

    delta = deltaY === 0 ? deltaX : deltaY;

    if( _.numberIs( e.deltaY ) )
    {
      deltaY = e.deltaY * -1;
      delta = deltaY;
    }
    if( _.numberIs( e.deltaX ) )
    {
      deltaX = e.deltaX;
      if( deltaY === 0 )
      delta = deltaX * -1;
    }

    if( deltaY === 0 && deltaX === 0 )
    return;

    let absDelta = Math.max( Math.abs( deltaY ), Math.abs( deltaX ) );

    if( !lowestDelta || absDelta < lowestDelta )
    lowestDelta = absDelta;

    delta = Math[ delta >= 1 ? 'floor' : 'ceil' ]( delta / lowestDelta );
    deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ]( deltaX / lowestDelta );
    deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ]( deltaY / lowestDelta );

    let originalEvent = e;
    e = new Event( originalEvent );
    e.originalEvent = originalEvent;

    e.deltaX = deltaX;
    e.deltaY = deltaY;
    e.deltaFactor = lowestDelta;

    let r = o.onWheel( e );
    return r;
  }

}

mousewheel.defaults =
{
  targetDom : null,
  onWheel : null
}

//

function wheelOn( o )
{

  if( arguments.length === 2 )
  o = { targetDom : arguments[ 0 ], onWheel : arguments[ 1 ] }

  _.routine.options_( wheelOn, o );
  _.assert( _.routineIs( o.onWheel ) );

  o.targetDom = _.dom.fromAtLeastOne( o.targetDom );

  _.assert( _.routineIs( o.targetDom.mousewheel ), '"jQuery.mousewheel" was not included' );

  o.targetDom.mousewheel( handle );
  let onWheel = o.onWheel;

  return o;

  /* */

  function handle( e )
  {
    let delta = eventWheelDelta( e );
    return onWheel( e, delta );
  }

}

wheelOn.defaults =
{
  targetDom : null,
  onWheel : null,
}

//

function eventWheelDelta( e, usingOne )
{
  var deltaX, deltaY;

  if( e.originalEvent )
  e = e.originalEvent;

  if( _.numberIs( e.wheelDeltaX ) )
  deltaX = e.wheelDeltaX;
  else if( _.numberIs( e.deltaX ) )
  deltaX = -e.deltaX;

  if( _.numberIs( e.wheelDeltaY ) )
  deltaY = e.wheelDeltaY;
  else if( _.numberIs( e.deltaY ) )
  deltaY = -e.deltaY;
  else if( _.numberIs( e.wheelDelta ) )
  deltaY = e.wheelDelta;
  else if( _.numberIs( e.delta ) )
  deltaY = -e.delta;
  else if( _.numberIs( e.detail ) )
  deltaY = e.detail;

  if( usingOne )
  {

    if( deltaX > +1 ) deltaX = +1;
    else if( deltaX < -1 ) deltaX = -1;
    else deltaX = 0;

    if( deltaY > +1 ) deltaY = +1;
    else if( deltaY < -1 ) deltaY = -1;
    else deltaY = 0;

  }

  return [ +deltaX, +deltaY ];
}

//

let eventWheelDeltaScreen = ( function eventWheelDeltaScreen()
{

  var screenSize;

  return function( e )
  {
    if( !screenSize )
    screenSize = [ screen.width / 250, screen.height / 250 ];
    let result = eventWheelDelta( e );
    result[ 0 ] *= screenSize[ 0 ];
    result[ 1 ] *= screenSize[ 1 ];
    return result;
  }

})();

//

function eventSpecialMake( o )
{

  _.assert( arguments.length === 1, 'Expects single argument' );

  if( _.strIs( o ) )
  o = { name : o || null };

  _.map.assertHasOnly( o, eventSpecialMake.defaults );

  let event = new CustomEvent
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

  if( !_.object.isBasic( o ) )
  o = { targetDom : o };

  _.assert( _.dom.is( o.targetDom ) );
  _.assert( arguments.length === 1, 'Expects single argument' );
  _.routine.options_( eventsObserver, o );

  let observer = new MutationObserver( function( mutations )
  {
    mutations.forEach( function( mutation )
    {
      if( o.verbosity )
      console.log( mutation.type );
      if( o.onMutation )
      o.onMutation.call( o, mutation );
    });
  });

  let config =
  {
    childList : true,
    attributes : true,
    characterData : true,
    subtree : true,
    // attributeOldValue : true,
    // characterDataOldValue : true,
    // attributeFilter : true,
  };

  observer.observe( o.targetDom, config );

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

  _.assert( _.dom.domableIs( o.targetDom ) );
  _.assert( arguments.length === 1, 'Expects single argument' );
  _.routine.options_( eventsBindAll, o );

  o.targetDom = $( o.targetDom );
  _.assert( o.targetDom.length === 1 );
  o.targetDom = o.targetDom[ 0 ];

  for( var e in o.targetDom )
  {
    if( !_.strBegins( e, 'on' ) || e.length < 3 )
    continue;

    let name = _.strRemoveBegin( e, 'on' );

    o.targetDom.addEventListener( name, o.onEvent );

  }

}

eventsBindAll.defaults =
{
  targetDom : null,
  onEvent : null,
}

//

let _jqueryOriginalOn = $ ? $.fn.on : null;
function eventsBindWatcher( o )
{
  o = _.routine.options_( eventsBindWatcher, o )

  _.assert( _jqueryOriginalOn === $.fn.on, 'on of jQuery is already overwritten' );

  o.result = o.result || [];
  o.close = function close()
  {
    $.fn.on = _jqueryOriginalOn;
    return o.result;
  }

  $.fn.on.fn.on = function on( eventName, handler )
  {
    let dom = $( this );
    var selector, data;

    let argumentsLength = arguments.length;
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

    let e = Object.create( null )
    e.dom = dom;
    e.eventName = eventName;
    e.selector = selector;
    e.data = data;
    e.handler = handler;

    o.result.push( e );

    let result = _jqueryOriginalOn.call( this, eventName, handler );
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
  _.routine.options_( eventFire, o );
  _.assert( _.dom.domableIs( o.targetDom ) );

  o.targetDom = _.dom.from( o.targetDom );

  let event = new Event( o.kind,
    {
      // 'bubbles' : true,
      'cancelable' : true,
    });

  if( o.extendingByOptions )
  _.props.extend( event, o );

  if( o.extendMap )
  _.props.extend( event, o.extendMap );

  // if( !o.informingDescandants )
  // o.targetDom.each( function( k,dom )
  // {
  //   dom.dispatchEvent( event );
  // });
  // else
  // o.targetDom.find( '*' ).addBack().each( function( k,dom )
  // {
  //   dom.dispatchEvent( event );
  // });

  if( o.informingDescandants )
  {
    let descandants = _.dom.find( o.targetDom, '*' );
    descandants = _.array.as( descandants );
    descandants.forEach( ( dom ) => dom.dispatchEvent( event ) )
  }
  else
  {
    o.targetDom.dispatchEvent( event );
  }

  // if( !o.informingDescandants )
  // {
  //   o.targetDom.dispatchEvent( event );
  // }
  // else
  // {
  //   let descandants = _.dom.find( o.targetDom, '*' );
  //   descandants = _.array.as( descandants );
  //   descandants.forEach( ( dom ) => dom.dispatchEvent( event ) )
  // }

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

  _.assert( _.dom.is( targetDom ) );

  if( targetDom.dispatchEvent )
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

let Extension =
{

  // dom

  fromStr,

  caretSelect,
  val,

  attr,

  class : _class,
  addClass,
  removeClass,
  hasClass,

  attrHasAny,
  attrHasAll,
  attrHasNone,

  textGet,
  setText,
  attrInherited,

  nickname,
  of,

  leftTopGet,
  leftTopSet,
  centerSet,

  positionGet,
  boundingBoxGet,
  boundingBoxGlobalGet,

  sizeGet,
  sizeFastGet,
  size2,

  width,
  height,

  radiusGet,
  radiusFastGet,

  offset,

  first,
  firstOf,

  ownIdentity,

  cssGet,
  cssSet,
  cssGlobal,
  cssExport,
  css,

  emToPx,

  each,
  _each,

  clipboardCopy,
  fullScreen,

  load,

  // event

  eventName,
  eventClientPosition,
  eventRedirect,
  eventMouse,

  on,
  off,

  /*eventWheelZero : eventWheelZero,*/

  fromAtLeastOne,
  mousewheel,
  wheelOn,

  eventWheelDelta,
  eventWheelDeltaScreen,
  eventSpecialMake,

  eventsObserver,
  eventsBindAll,
  eventsBindWatcher,
  eventFire,
  eventFire2,

  // fields

  _domBaselayer3Loaded : true

};

/* _.props.extend */Object.assign( _.dom, Extension );

})();
