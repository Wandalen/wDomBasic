(function _Common_js_()
{

'use strict';

const _global = _global_;
const _ = _global.wTools;
_.assert( !!_.dom );
_.assert( !!_.dom.s );
const Parent = _.dom;
const Self = _.dom.s
let isApple = navigator.platform.match( /(Mac|iPhone|iPod|iPad)/i );

//
// dom
//

//

function val( dom, vals )
{
  var result;

  _.assert( arguments.length <= 2 );

  if( !dom )
  dom = document.body;

  /* */

  if( arguments.length === 2 )
  result = _.dom.each
  ({
    recursive : true,
    dom,
    onUp : function( dom )
    {

      let selector = dom.name;

      if( !_.strDefined( selector ) )
      return;

      let val = _.select( vals, selector );

      if( val === undefined )
      return;

      _.dom.val( dom, val );

    },
  });
  else
  result = _.dom.each
  ({
    recursive : true,
    result : Object.create( null ),
    dom,
    onUp : function( dom, o )
    {
      let text = '';
      let val = _.dom.val( dom );

      if( val === undefined )
      return;
      // return result;

      // let val = _.dom.val( dom );

      if( !isNaN( val ) )
      val = Number( val );

      let selector = dom.name;

      let parts = _.strSplit
      ({
        src : selector,
        delimeter : [ '.', '[', ']' ],
        preservingDelimeters : 0,
        preservingEmpty : 0,
        preservingQuoting : 0,
        stripping : 1,
      });

      let query = parts[ 0 ];
      for( let i = 0; i < parts.length; i++ )
      {
        let set = Object.create( null );

        if( i )
        query = query + '/' + parts[ i ];

        if( i === parts.length - 1 )
        set = val;
        else if( _.select( o.result, query ) !== undefined )
        continue;
        else if( !isNaN( _.numberFromStr( parts[ i + 1 ] ) ) )
        set = [];

        _.selectSet
        ({
          src : o.result,
          selector : query,
          set
        });
      }

      // _.selectSet( o.result,selector,val );

      // return result;
    },
  });

  /* */

  return result;
}

//

function _class( dom, classes, adding )
{

  _.assert( arguments.length === 1 || arguments.length === 3 );
  _.assert( _.dom.domableIs( dom ) );

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
    else for( let c = 0 ; c < classes.length ; c++ )
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
 * If `adding` is `true` routine adds attributes `` to the element.
 * If `adding` is `false` routine removes attributes `attrs` from the element.
 * If single `dom` argument is provided routine returns attributes of the element.
 * @param {String|Object} dom Target dom.
 * @param {String|Object} attrs Source attributes.
 * @param {Boolean} adding Controls adding/removing of the attributes.
 * @function attr
 * @namespace Tools.dom
 * @module Tools/base/DomBasic
 */

function attr( dom, attrs, adding )
{

  _.assert( arguments.length === 1 || arguments.length === 2 || arguments.length === 3 );
  _.assert( _.dom.domableIs( dom ) );

  if( adding === undefined )
  adding = 1;

  dom = $( dom );

  if( arguments.length === 1 )
  {

    _.assert( dom.length === 1 );

    let result = Object.create( null );
    for( let a = 0 ; a < dom[ 0 ].attributes.length ; a++ )
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
    _.assert( _.object.isBasic( attrs ) || _.strIs( attrs ) );

    // if( !adding )
    // debugger;

    if( _.strIs( attrs ) )
    {
      // if( !adding )
      // debugger;
      if( adding )
      dom.attr( attrs, 1 );
      else
      dom.removeAttr( attrs );
    }
    else for( var c in attrs )
    {
      _.assert( _.primitiveIs( attrs[ c ] ) );
      if( adding )
      dom.attr( c, attrs[ c ] );
      else
      dom.removeAttr( c, attrs[ c ] );
    }

  }

}

//

function sizeGet( dom )
{
  let result = [];
  dom = $( dom );

  for( let i = 0 ; i < dom.length ; i++ )
  result[ i ] = _.dom.sizeGet( dom[ i ] );

  return result;
}

//

function sizeFastGet( dom )
{
  let result = [];
  dom = $( dom );

  for( let i = 0 ; i < dom.length ; i++ )
  result[ i ] = _.dom.sizeFastGet( dom[ i ] );

  return result;
}

//

function radiusGet( dom )
{
  let result = [];
  dom = $( dom );

  for( let i = 0 ; i < dom.length ; i++ )
  result[ i ] = _.dom.radiusGet( dom[ i ] );

  return result;
}

//

function radiusFastGet( dom )
{
  let result = [];
  dom = $( dom );

  for( let i = 0 ; i < dom.length ; i++ )
  result[ i ] = _.dom.radiusFastGet( dom[ i ] );

  return result;
}

// --
// prototype
// --

let DomsExtension =
{

  // dom

  val,

  class : _class,
  attr,

  addClass : Self._vectorize( 'addClass', 2 ),
  removeClass : Self._vectorize( 'removeClass', 2 ),

  sizeGet,
  sizeFastGet,

  radiusGet,
  radiusFastGet

};

_.mapExtendDstNotOwn( Self, DomsExtension );

})();
