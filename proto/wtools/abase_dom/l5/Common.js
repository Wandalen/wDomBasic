( function _Common_js_()
{

'use strict';

const _global = _global_;
const _ = _global.wTools;
let $ = typeof jQuery === 'undefined' ? null : jQuery;
// let $ = typeof jQuery !== 'undefined' ? jQuery : null;
_.dom = _.dom || Object.create( null );
let isApple = navigator.platform.match( /(Mac|iPhone|iPod|iPad)/i );

/*

- implement unbind for habbitMouseClick!!!

*/

// --
// dom
// --

function formationRadialSet( o )
{

  if( _.dom.domableIs( o ) )
  o = { elementsDom : o }

  if( o.containerDom )
  o.containerDom = $( o.containerDom );

  o.elementsDom = $( o.elementsDom );

  if( o.containerDom && o.containerDom.length )
  {
    let size = _.dom.sizeFastGet( o.containerDom );
    if( o.containerCenter === null || o.containerCenter === undefined )
    o.containerCenter = [ size[ 0 ]/2, size[ 1 ]/2 ];
    if( o.containerRadius === null || o.containerRadius === undefined )
    o.containerRadius = Math.min( size[ 0 ]/2, size[ 1 ]/2 );
  }

  /* */

  _.assert( o.containerDom.length <= 1 );
  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( _.arrayIs( o.containerCenter ) );
  _.assert( _.numberIs( o.containerRadius ) );
  _.routine.options_( formationRadialSet, o );

  if( !o.elementsDom.length )
  return;

  /* sizes */

  var sizes;

  if( o.containerDom && o.containerDom.length )
  {
    if( o.containerDom[ 0 ]._formationRadialSetSizes )
    {
      sizes = o.containerDom[ 0 ]._formationRadialSetSizes;
    }
    else if( o.containerDom.css( 'display' ) === 'none' )
    {
      _.dom.offscreenMake( o.containerDom, 1 );
      sizes = _.dom.s.sizeGet( o.elementsDom );
      o.containerDom[ 0 ]._formationRadialSetSizes = sizes;
      _.dom.offscreenMake( o.containerDom, 0 );
    }
  }

  if( !sizes )
  sizes = _.dom.s.sizeGet( o.elementsDom );

  /* */

  let radius = o.radius*o.containerRadius;
  let radiansPerElement = 2*Math.PI / o.elementsDom.length;
  let pos = [];

  for( let i = 0 ; i < o.elementsDom.length ; i++ )
  {
    pos[ 0 ] = o.containerCenter[ 0 ] + Math.cos( o.phase + radiansPerElement*i ) * radius;
    pos[ 1 ] = o.containerCenter[ 1 ] + Math.sin( o.phase + radiansPerElement*i ) * radius;
    // logger.log( 'element',i,pos );
    _.dom.centerSet( o.elementsDom[ i ], pos )
  }

  /* */

}

formationRadialSet.defaults =
{
  containerDom : null,
  elementsDom : null,
  containerCenter : null,
  containerRadius : null,
  radius : 1,
  phase : 0,
}

//

function colorOnClick( o )
{

  if( _.dom.domableIs( o ) )
  o = { canvas : o };

  _.assert( _.dom.domableIs( o.canvas ) );

  o.canvas = _.dom.from( o.canvas );

  _.assert( o.canvas instanceof HTMLCanvasElement, 'Expects exactly one canvas' );

  let canvas = o.canvas;

  _.dom.on( o.canvas, _.dom.eventName( 'mousemove' ), function( event )
  {

    if( !event.ctrlKey || !event.altKey )
    return;

    //if( event.target !== canvas )
    //return;

    let color = null;

    if( canvas.renderer )
    {

      let position = _.dom.eventClientPosition
      ({
        event,
        relative : o.canvas,
        flip : [ 0, 1 ],
      });

      let renderer = canvas.renderer;
      // SRT.gfx.RenderTarget.prototype._webglRendertargetActivate_static.call( null,null,renderer );
      // gRenderTarget.screen.webglRenderTargetActivate( renderer );
      // renderer.renderTarget = gRenderTarget.screen;
      renderer.renderTarget = renderer.screen;
      color = renderer.readPixel( position );

    }
    else
    {

      throw _.err( 'not tested' );

      let position = _.dom.eventClientPosition
      ({
        event,
        relative : o.canvas,
        flip : [ 0, 0 ],
      });

      let context = canvas.getContext( '2d' );
      color = context.getImageData( position[ 0 ], position[ 1 ], 1, 1 ).data;

      let colorFloat = [ ];
      for( let i = 0 ; i < color.length ; i++ )
      colorFloat[ i ] = color[ i ] / 255;

      console.log( 'color', ' :', _.entity.exportString( color ), ' :', _.entity.exportString( colorFloat, { precision : 3 } ) );

    }
  });

}

//

/*

    _.dom.msg
    ({
      kind : 'negative',
      msg : msg,
      title : title,
    });

*/

let msg = ( function msg()
{

  let kinds = [ 'neutral', 'positive', 'negative' ];
  let titles =
  {
    'neutral' : 'Info :',
    'positive' : '',
    'negative' : 'Something has gone wrong!',
  };
  let cssClassSemantic =
  {
    'neutral' : 'info',
    'positive' : 'positive',
    'negative' : 'negative',
  }
  let cssClass =
  {
    'neutral' : 'panel-msg-neutral',
    'positive' : 'panel-msg-positive',
    'negative' : 'panel-msg-negative',
  }
  let smiles =
  {
    'neutral' : 'smile',
    'positive' : 'smile',
    'negative' : 'meh',
  }

  return function msg( o )
  {

    o = o || Object.create( null );
    let optionsDefault =
    {
      kind : 'neutral',
      msg : '',
      title : '',
      target : '',
    }

    if( o.kind === undefined )
    o.kind = 'neutral';

    _.map.assertHasOnly( o, optionsDefault );
    _.assert( kinds.indexOf( o.kind ) !== -1, 'dom.msg :', 'unknown type' );

    if( o.msg === undefined )
    o.msg = '';

    if( !_.strIs( o.msg ) )
    o.msg = _.entity.exportString( o.msg, { levels : 2 } );

    if( o.title === undefined )
    o.title = titles[ o.kind ];

    if( o.target === undefined )
    o.target = '.' + cssClass[ o.kind ];

    //

    let dom = _.dom.from( o.target );
    if( !dom )
    {
      let html =
      [
        '<div class="ui message icon hidden layout">',
        '<i class="smile icon"></i><i class="close icon"></i>',
        '<div class="content">',
        '<div class="header"></div>',
        '<p class="text"></p>',
        '</div>',
        '</div>',
      ].join( '\n' );
      dom = _.dom.make({ html });
      let body = document.body;
      let top = _.dom.from( 'body > .panel.top' );
      if( top ) _.dom.after( top, dom );
      else _.dom.prepend( document.body, dom );
      _.dom.addClass( dom, [ cssClass[ o.kind ], cssClassSemantic[ o.kind ] ] )
      // dom.find( '.smile' ).removeClass( 'smile' ).addClass( smiles[ o.kind ] )
      let found = _.dom.find( dom, '.smile' );
      _.dom.s.removeClass( found, 'smile' );
      _.dom.s.addClass( found, smiles[ o.kind ] );
    }

    //

    dom
    .find( 'p' )
    .text( o.msg )
    .css( 'white-space', 'pre' );
    let p = _.dom.find( dom, 'p' );
    _.dom.setText( p, o.msg );
    _.dom.css( p, 'white-space', 'pre' );

    _.dom.text( _.dom.find( dom, '.header' ), o.title );

    if( _.dom.hasClass( dom, 'hidden' ) )
    dom
    .transition
    ({
      animation : 'swing down',
      duration  : 500,
    });

    if( dom._domMsgInited )return;

    _.assert( _.dom.is( dom ) );
    dom._domMsgInited = true;

    _.dom.on( _.dom.find( dom, '.close' ), 'click', function()
    {
      this.closest( '.message' )
      .transition
      ({
        animation : 'fly down',
        duration  : 400,
      });
    });

  }

})();

//

let _domLoadingModeLoading = 1;
function loadingMode( value )
{

  _.assert( arguments.length === 1, 'Expects single argument' );

  if( !_domLoadingModeLoading )
  _domLoadingModeLoading = 0;

  _domLoadingModeLoading += value ? +1 : -1;

  if( _domLoadingModeLoading < 0 )
  {

    console.warn( _.err( 'loadingMode : have used more times then loadingBegin' ).toString() );
    _domLoadingModeLoading = 0;

  }

  if( _domLoadingModeLoading )
  {

    $( '.panel-loading' ).removeClass( 'layout-invisible' );

  }
  else
  {

    $( '.panel-loading' ).addClass( 'layout-invisible' );

  }

}

//

function scrollFix( o )
{
  o = o || Object.create( null );

  _.assert( _.dom.is( o.target ) || _.dom.jqueryIs( o.target ), 'scrollFix', 'Expects o.target' );

  o.target = $( o.target );
  let xFix = o.xFix === undefined ? true : !!o.xFix;
  let yFix = o.yFix === undefined ? true : !!o.yFix;
  // let xFix = o.xFix !== undefined ? !!o.xFix : true;
  // let yFix = o.yFix !== undefined ? !!o.yFix : true;

  o.target.each( function( k, element )
  {

    element = $( element );
    let relative = o.relative || element.parent();
    let position = element.position();

    relative.scroll( function( event )
    {

      if( xFix === true )
      element.css( 'left', ( position.left + relative.scrollLeft() ) + 'px' );

      if( yFix === true )
      element.css( 'top', ( position.top + relative.scrollTop() ) + 'px' );

    });

  });

}

//

function scrollFocus( o )
{

  if( _.dom.like( o ) )
  o = { elementDom : o }

  o.elementDom = $( o.elementDom );

  if( o.contentDom )
  o.contentDom = $( o.contentDom );
  else
  o.contentDom = o.elementDom.parent().parent();

  // if( !o.contentDom )
  // o.contentDom = o.elementDom.parent().parent();
  // else
  // o.contentDom = $( o.contentDom );

  _.routine.options_( scrollFocus, o );
  _.assert( [ 'center', 'begin', 'end' ].indexOf( o.mode ) !== -1 );
  _.assert( o.contentDom.length === 1 );
  _.assert( o.elementDom.length === 1 );
  _.assert( o.contentDom[ 0 ] !== window && o.contentDom[ 0 ] !== document );

  let sizeOfContent = _.dom.sizeGet( o.contentDom );
  let sizeOfElement = _.dom.sizeGet( o.elementDom );
  let positionOfElement = _.dom.positionGet( o.elementDom );

  if( o.mode === 'center' )
  o.contentDom.scrollTop( o.contentDom.scrollTop() + positionOfElement[ 1 ] - sizeOfContent[ 1 ] / 2 );
  else if( o.mode === 'begin' )
  o.contentDom.scrollTop( o.contentDom.scrollTop() + positionOfElement[ 1 ] );
  else if( o.mode === 'end' )
  o.contentDom.scrollTop( o.contentDom.scrollTop() + positionOfElement[ 1 ] - sizeOfContent[ 1 ] + sizeOfElement[ 1 ] + 1 );

}

scrollFocus.defaults =
{
  contentDom : null,
  elementDom : null,
  mode : 'center',
}

//

function scrolable( o )
{

  if( typeof wScrollable === 'undefined' )
  throw _.err( 'please include Scrollable.js first' );

  return wScrollable( o );
}

//

function menuable( o )
{

  _.routine.options_( menuable, o );
  _.assert( _.dom.domableIs( o.targetDom ) );

  o.targetDom = $( o.targetDom );
  if( o.iconParentDom )
  o.iconParentDom = $( o.iconParentDom );

  o.targetDom.addClass( 'wmenu' );

  if( o.contentHide )
  o.contentHide = $( o.contentHide );
  else
  o.contentHide = o.targetDom.children( '.wmenu-conent-hide' );

  o.contentHide.addClass( 'wmenu-conent-hide' );

  if( o.firingEventsForDom )
  o.firingEventsForDom = _.dom.of( o.targetDom, o.firingEventsForDom );

  /* */

  let css =
  `
    .wmenu.wmaximized
    {
      left : 0 !important;
      top : 0 !important;
      width : 100% !important;
      height : 100% !important;
    }
    .wmenu.active > .wmenu-conent-hide
    {
      filter : blur( 3px );
    }
    .wmenu .wmenu-menu
    {
      display : none;
      position : absolute;
      clear : both;
      width : 100%;
      height : 100%;
      left : 0;
      top : 0;
      z-index : 1;
      text-align : center;
      flex-direction : column;
      justify-content : center;
    }
    .wmenu .wmenu-menu
    {
      line-height : 2em;
    }
    .wmenu .wcorner-parent.wmenuable-corner
    {
      margin : 0em;
      width : 2em;
      height : 2em;
    }
    .wmenu.active .wmenu-menu .wmenu-item
    {
      cursor : pointer;
      align-self : center;
    }
    .wmenu.active .wmenu-menu .wmenu-item:hover
    {
      text-shadow : 1px 1px 4px #000000;
    }
    .wmenu .wmenu-icon-open-default
    {
      border-width : 1px;
      border-style : solid;
      border-color : #999;
      border-radius : 3px;
      margin : 0.5em;
      width : 1em;
      height : 1em;
      transition : background-color 0.4s;
    }
    .wmenu .wmenu-icon-open-default:hover
    {
      background-color : #f44;
    }
    .wmenu.active .wmenu-icon-open-default:hover
    {
      background-color : #4f4;
    }
    .wmenu .wcorner-parent .wmenu-icon-open-default
    {
      position : absolute;
      color : #666666;
      cursor : pointer;
    }
    .wmenu .wcorner-parent.wmenu-icon-hiding
    {
      opacity : 0;
      transition : opacity 0.4s;
    }
    .wmenu .wcorner-parent.wmenu-icon-hiding:hover
    {
      opacity : 1;
    }
  `

  _.dom.cssGlobal({ css, key : menuable });

  /* */

  if( !o.iconParentDom )
  {

    let corners = _.dom.cornersMake
    ({
      targetDom : o.targetDom,
      corners : o.corners,
      cssClass : 'wmenuable-corner',
      makingChild : 0,
    });

    o.iconParentDom = corners.cornerParentDom;
    _.assert( o.iconParentDom.length === o.corners.length );

  }

  if( o.iconOpenDom )
  {
    o.iconOpenDom = $( o.iconOpenDom );
  }
  else
  {
    o.iconParentDom.each( function( i, dom )
    {
      let icon = $( '<i>' ).appendTo( dom );
      _.dom.s.class( icon, [ 'wmenu-icon-open-default', 'wmenu-icon-open' ], 1 );
      icon.attr( 'title', 'Associated Menu' );
    });
    o.iconOpenDom = o.iconParentDom.find( '.wmenu-icon-open' );
  }

  // _.dom.s.class( o.iconOpenDom,[ 'wmenu-icon-open','transition','hidden' ],1 );
  _.dom.s.class( o.iconOpenDom, [ 'wmenu-icon-open' ], 1 );
  _.dom.s.class( o.iconOpenDom, [ 'visible' ], 0 );

  /* menu */

  o.items = o.items || [];

  if( o.menuDom )
  {
    o.menuDom = $( o.menuDom );
  }
  else
  {
    o.menuDom = $( '<div class="wmenu-menu transition hidden">' ).appendTo( o.targetDom );

    if( o.addingStockItems )
    {
      _.arrayAppendArrayOnceStrictly( o.items, [ 'Maximize', 'Window', 'Close', 'Resume' ] );
    }

    for( let i = 0 ; i < o.items.length ; i++ )
    {
      let item = $( '<div>' ).appendTo( o.menuDom );
      item.text( o.items[ i ] );
      item.addClass( 'wmenu-item' );
      item.attr( 'item', o.items[ i ] );
    }
  }
  // if( !o.menuDom )
  // {
  //   o.menuDom = $( '<div class="wmenu-menu transition hidden">' ).appendTo( o.targetDom );
  //
  //   if( o.addingStockItems )
  //   {
  //     _.arrayAppendArrayOnceStrictly( o.items, [ 'Maximize', 'Window', 'Close', 'Resume' ] );
  //   }
  //
  //   for( let i = 0 ; i < o.items.length ; i++ )
  //   {
  //     let item = $( '<div>' ).appendTo( o.menuDom );
  //     item.text( o.items[ i ] );
  //     item.addClass( 'wmenu-item' );
  //     item.attr( 'item', o.items[ i ] );
  //   }
  //
  // }
  // else
  // {
  //   o.menuDom = $( o.menuDom );
  // }

  o.itemsDom = o.menuDom.find( '.wmenu-item' );

  _.assert( o.menuDom.length > 0 );
  _.assert( o.itemsDom.length > 0 );

  /* item handler */

  function handleItemSelect( event )
  {

    let t = $( event.target );
    let item = t.attr( 'item' );
    let e =
    {
      dom : t,
      kind : 'item-selected',
      item,
    }

    if( o.addingStockItems )
    {

      if( item === 'Resume' )
      {
        o.menuShow( 0 );
      }
      else if( e.item === 'Close' )
      {
        o.targetDom.remove();
      }
      else if( e.item === 'Window' )
      {
        _.dom.windowOpen
        ({
          targetDom : o.targetDom,
        });
      }
      else if( e.item === 'Maximize' )
      {
        o.targetDom.addClass( 'wmaximized' );
        e.dom.attr( 'item', 'Minimize' );
        e.dom.text( 'Minimize' );
        if( o.firingEventsForDom )
        _.dom.eventFire({ targetDom : o.firingEventsForDom, kind : 'resize' });
      }
      else if( e.item === 'Minimize' )
      {
        o.targetDom.removeClass( 'wmaximized' );
        e.dom.attr( 'item', 'Maximize' );
        e.dom.text( 'Maximize' );
        if( o.firingEventsForDom )
        _.dom.eventFire({ targetDom : o.firingEventsForDom, kind : 'resize' });
      }

    }

    if( !o.onEvent )
    return;

    o.onEvent( e );

  }

  /*o.itemsDom.on( _.dom.eventName( 'click' ), handleItemSelect );*/

  _.dom.habbitMouseClick
  ({
    dom : o.itemsDom,
    // givingRepeat : 1,
    onEvent : function handleHold( e )
    {

      console.log( 'kindOfMouseEvent', e.kindOfMouseEvent );
      // if( e.kindOfMouseEvent !== 'repeat' )
      // return;
      handleItemSelect.call( this, e );

    },
  });

  /* icon handler */

  o.iconOpenDom.on( _.dom.eventName( 'click' ), function( e )
  {

    console.log( 'menuable.click' );
    // debugger;

    let active = o.targetDom.hasClass( 'active' );
    o.menuShow( !active );

  });

  /* menu show */

  o.menuShow = function menuShow( val )
  {

    o.targetDom.toggleClass( 'active' );
    o.menuDom.transition
    ({
      animation : 'scale',
      displayType : 'flex',
    });

  }

  /* icon hide */

  if( o.hidingIcon )
  {
    _.dom.s.class( o.iconParentDom, [ 'wmenu-icon-hiding' ], 1 );
    // _.dom.s.class( o.iconOpenDom,[ 'transition','hidden' ],1 );
    // o.iconParentDom
    // .on( _.dom.eventName( 'mouseleave' ), function( e )
    // {
    //   let t = $( this ).children();
    //   t.transition
    //   ({
    //     animation : 'scale',
    //     displayType : 'flex',
    //   });
    // })
    // .on( _.dom.eventName( 'mouseenter' ), function( e )
    // {
    //   let t = $( this ).children();
    //   t.transition
    //   ({
    //     animation : 'scale',
    //     displayType : 'flex',
    //   });
    // })
  }

  _.dom.abilityRegister
  ({
    targetDom : o.targetDom,
    settings : o,
    maker : menuable,
    css,
  });

  return o;
}

menuable.defaults =
{
  targetDom : null,
  contentHide : null,
  iconParentDom : null,
  iconOpenDom : null,
  menuDom : null,
  menuItemsDom : null,
  items : null,
  onEvent : null,
  addingStockItems : 1,
  hidingIcon : 1,
  firingEventsForDom : 'canvas',
  corners : [ 'lt', 'lb', 'rt', 'rb' ],
}

//

function resizable( o )
{

  _.routine.options_( resizable, o );

  o.containerDom = $( o.containerDom );
  o.targetDom = $( o.targetDom );

  // _.dom.eventsObserver( o.targetDom[ 0 ] ); // xxx

  if( o.firingEventsForDom )
  o.firingEventsForDom = _.dom.of( o.targetDom, o.firingEventsForDom );

  _.assert( o.containerDom.length >= 1 );
  _.assert( o.targetDom.length >= 1 );
  _.assert( arguments.length === 1, 'Expects single argument' );

  /* handles */

  if( o.makingHandles )
  {
    _.assert( !o.handleParentDom );
    _.assert( !o.handleChildDom );

    let css =
    `
    .wresizable
    {
      position : absolute;
    }

    .wresizable .wresizable-corner.wcorner-parent
    {
      display : block;
      position : absolute;
      height : 14px;
      width : 14px;
      background : transparent;
      z-index : 2;
      transition : height 0.4s, width 0.4s;
    }

    .wresizable .wresizable-corner.wcorner-parent:hover
    {
      height : 23px;
      width : 23px;
    }

    .wresizable .wresizable-corner.wcorner-child.lt,
    .wresizable .wresizable-corner.wcorner-child.rb
    {
      cursor : nwse-resize;
    }

    .wresizable .wresizable-corner.wcorner-child.lb,
    .wresizable .wresizable-corner.wcorner-child.rt
    {
      cursor : nesw-resize;
    }
    `

    _.dom.cssGlobal({ css, key : resizable });

    let corners = _.dom.cornersMake
    ({
      targetDom : o.targetDom,
      corners : o.corners,
      cssClass : 'wresizable-corner',
    });

    o.handleParentDom = corners.cornerParentDom;
    o.handleChildDom = corners.cornerChildDom;

    o.handleChildDom.addClass( 'layout-cross' );

  }

  /* pre */

  o.targetDom.addClass( 'wresizable' );
  o.state = Object.create( null );

  /* handler */

  o.handleParentDom
  .on( _.dom.eventName( 'mousedown' ), function( e )
  {
    let target = $( e.target );

    // console.log( 'resizable.mousedown' );

    let pos = _.dom.eventClientPosition
    ({
      event : e,
      relative : o.targetDom,
      flip : [ 1, 1 ],
    });

    pos = _.dom.eventClientPosition( e );
    let dom = $( this ).closest( '[ wresizable ]' );

    o.state.start = _.dom.eventClientPosition( e );
    o.state.position = _.dom.positionGet( o.targetDom );
    o.state.size = _.dom.sizeGet( o.targetDom );
    o.state.corner = _.dom.s.class( target );
    o.state.corner = _.arraySetIntersection_( null, o.state.corner, [ 'lt', 'lb', 'rt', 'rb' ] );
    _.assert( o.state.corner.length === 1 );
    o.state.corner = o.state.corner[ 0 ];

    o.targetDom.attr( 'wresizing', 1 );
    o.containerDom.attr( 'wresizing', 1 );
    o.containerDom.attr( 'wdraggable-not', 1 );

    e.preventDefault();
    e.stopPropagation();

    return false;
  })

  /*  */

  o.target

  o.targetDom
  .on( _.dom.eventName( 'drag' ), function( e )
  {
    if( !o.state.start )return;
    e.preventDefault();
    return false;
  })
  .on( 'domRelocated', function( e )
  {
    o.containerDom = $( this ).parent();
    bindContainer();
  });

  /* */

  function bindContainer()
  {

    o.containerDom
    .on( _.dom.eventName( 'mouseup' ), function( e )
    {
      if( !o.state.start )
      return;

      o.state.start = null;
      o.targetDom.removeAttr( 'wresizing' );
      o.containerDom.removeAttr( 'wresizing' );
      o.containerDom.removeAttr( 'wdraggable-not' );

    })
    .on( _.dom.eventName( 'mousemove' ), function( e )
    {
      if( !o.state.start )
      return;

      let pos = _.dom.eventClientPosition( e );

      let dx = pos[ 0 ] - o.state.start[ 0 ];
      let dy = pos[ 1 ] - o.state.start[ 1 ];

      // console.log( 'resizable.mousemove',dx,dy );

      if( o.state.corner[ 0 ] === 'r' )
      o.targetDom.css
      ({
        'width' : ( o.state.size[ 0 ] + dx ) + 'px',
      });
      else
      o.targetDom.css
      ({
        'left' : ( o.state.position[ 0 ] + dx ) + 'px',
        'width' : ( o.state.size[ 0 ] - dx ) + 'px',
      });

      if( o.state.corner[ 1 ] === 'b' )
      o.targetDom.css
      ({
        'height' : ( o.state.size[ 1 ] + dy ) + 'px',
      });
      else
      o.targetDom.css
      ({
        'top' : ( o.state.position[ 1 ] + dy ) + 'px',
        'height' : ( o.state.size[ 1 ] - dy ) + 'px',
      });

      _.dom.eventFire({ targetDom : o.firingEventsForDom, kind : 'resize' });

      return false;
    });

  }

  bindContainer();

  _.dom.abilityRegister
  ({
    targetDom : o.targetDom,
    settings : o,
    maker : resizable,
    css,
  });

}

resizable.defaults =
{
  corners : [ 'lt', 'lb', 'rt', 'rb' ],
  makingHandles : 1,
  firingEventsForDom : 'canvas',
  handleParentDom : null,
  handleChildDom : null,
  handleCssClass : 'wresizeable-handle',
  containerDom : 'body',
  targetDom : null,
}

//

function cornersMake( o )
{

  _.routine.options_( cornersMake, o );

  o.targetDom = $( o.targetDom );

  _.assert( o.targetDom.length >= 1 );
  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( !o.cornerParentDom );
  _.assert( !o.cornerChildDom );

  let css =
  `
  .wcorner-parent
  {
    display : block;
    position : absolute;
    height : 14px;
    width : 14px;
    clear : both;
    background : transparent;
    z-index : 2;
    transition : height 0.4s, width 0.4s;
  }

  .wcorner-child
  {
    position : relative;
    height : 100%;
    width : 100%;
  }

  `

  _.dom.cssGlobal({ css, key : cornersMake });

  o.cornerParentDom = $();
  if( o.makingChild )
  o.cornerChildDom = $();

  var cornerParentDom, cornerChildDom;
  for( var side of o.corners )
  {

    if( o.makingChild )
    cornerParentDom = $( '<div class="wcorner-parent"><div class="wcorner-child"></div></div>' ).appendTo( o.targetDom );
    else
    cornerParentDom = $( '<div class="wcorner-parent"></div>' ).appendTo( o.targetDom );

    if( o.makingChild )
    cornerChildDom = cornerParentDom.children( '.wcorner-child' );

    let left = _.strHas( side, 'l' ) ? 'left' : 'right';
    let top = _.strHas( side, 't' ) ? 'top' : 'bottom';
    cornerParentDom.css
    ({
      [ left ] : '0',
      [ top ] : '0',
    });

    cornerParentDom.children( 'div' ).css
    ({
      [ left ] : left === 'left' ? 'calc( -50% - 1px )' : '-50%',
      [ top ] : top === 'top' ? 'calc( -50% - 1px )' : '-50%',
    });

    if( o.cssClass )
    {
      _.dom.s.class( cornerParentDom, o.cssClass, 1 );
      if( o.makingChild )
      _.dom.s.class( cornerChildDom, o.cssClass, 1 );
    }

    if( left === 'left' && top === 'top' )
    {
      cornerParentDom.addClass( 'lt' )
      if( o.makingChild )
      cornerChildDom.addClass( 'lt' )
    }
    else if( left === 'left' && top === 'bottom' )
    {
      cornerParentDom.addClass( 'lb' )
      if( o.makingChild )
      cornerChildDom.addClass( 'lb' )
    }
    else if( left === 'right' && top === 'top' )
    {
      cornerParentDom.addClass( 'rt' )
      if( o.makingChild )
      cornerChildDom.addClass( 'rt' )
    }
    else if( left === 'right' && top === 'bottom' )
    {
      cornerParentDom.addClass( 'rb' )
      if( o.makingChild )
      cornerChildDom.addClass( 'rb' )
    }

    o.cornerParentDom = o.cornerParentDom.add( cornerParentDom );
    if( o.makingChild )
    o.cornerChildDom = o.cornerChildDom.add( cornerChildDom );

  }

  _.dom.abilityRegister
  ({
    targetDom : o.targetDom,
    settings : o,
    maker : cornersMake,
    css,
    combining : 'rewriting',
  });

  return o;
}

cornersMake.defaults =
{
  targetDom : null,
  corners : [ 'lt', 'lb', 'rt', 'rb' ],
  cssClass : null,
  makingChild : 1,
}

//

function windowOpen( o )
{

  o = _.routine.options_( windowOpen, o );
  _.assert( _.arrayIs( o.features ) || o.features === null );
  _.assert( _.strIs( o.uri ) );
  _.assert( _.strIs( o.iframeName ) );
  _.assert( _.strIs( o.title ) || o.title === null );
  _.assert( _.routineIs( o.onClose ) || _.consequenceIs( o.onClose ) || o.onClose === null );
  _.assert( arguments.length === 0 || arguments.length === 1 );

  if( o.features === null )
  o.features = [];

  if( o.size )
  {
    _.assert( !o.asTab, 'Expects no {o.size} when {o.asTab} is enabled.' );
    _.assert( _.arrayIs( o.size ) );
    _.assert( o.size.length === 2 );
    o.features.push( 'width=' + o.size[ 0 ] )
    o.features.push( 'height=' + o.size[ 1 ] )
  }

  if( o.asTab )
  {
    _.assert( o.iframeName === null || o.iframeName === '_blank' );
    if( !o.iframeName )
    o.iframeName = '_blank';
  }

  let features = o.features.join( ',' );

  o.window = window.open( o.uri, o.iframeName, features );
  if( o.window )
  {

    if( o.onClose === null )
    o.onClose = new _.Consequence();

    $( o.window ).on( 'beforeunload', () => o.onClose( o.window ) );

    if( o.title )
    o.window.document.title = o.title;

    let body = $( o.window.document.body );
    if( o.targetDom )
    body.append( o.targetDom );

    if( o.targetDom )
    _.dom.eventFire
    ({
      kind : 'domRelocated',
      targetDom : o.targetDom,
      informingDescandants : 1,
      extendMap :
      {
        parentDom : body,
      }
    });

    if( o.exportingCss )
    {
      _.dom.cssExport({ dstDocument : o.window.document });
      if( o.targetDom )
      _.dom.abilityCssExport({ targetDom : o.targetDom, dstDocument : o.window.document });
    }

  }
  else
  {
    console.warn( 'Please allow popups for this website' );
  }

  return o;
}

windowOpen.defaults =
{
  uri : '',
  iframeName : '',
  title : null,
  size : null,
  asTab : 0,
  features : null,
  exportingCss : 1,
  targetDom : null,
  onClose : null
}

//

function abilityRegister( o )
{

  _.assert( _.dom.jqueryIs( o.targetDom ) );
  _.assert( _.routineIs( o.maker ) );
  _.assert( _.strDefined( o.maker.name ) );
  _.assert( _.object.isBasic( o.settings ) );
  _.assert( !o.combining || o.combining === 'rewriting' );

  o.name = o.maker.name;

  o.targetDom.each( function( k, e )
  {

    if( !e._abilities )
    e._abilities = Object.create( null );

    if( !o.combining )
    _.assert( !e._abilities[ o.name ] );

    e._abilities[ o.name ] = o;

  });

  return o;
}

abilityRegister.defaults =
{
  maker : null,
  targetDom : null,
  settings : null,
  css : null,
  combining : 0,
}

//

function abilityUnregister( o )
{

  _.assert( _.dom.jqueryIs( o.targetDom ) );
  _.assert( _.strDefined( o.name ) );

  o.targetDom.each( function( k, e )
  {

    _.assert( e._abilities );
    _.assert( e._abilities[ o.name ] );

    delete e._abilities[ o.name ];

  });

  return o;
}

abilityUnregister.defaults =
{
  targetDom : null,
  ability : null,
  name : null,
}

//

function abilityCssExport( o )
{
  _.routine.options_( abilityCssExport, o );
  _.assert( arguments.length === 1, 'Expects single argument' );
  _.dom.jqueryIs( o.targetDom )

  o.targetDom.each( function( k, e )
  {

    if( !e._abilities )
    return;

    for( var a in e._abilities )
    {
      let ability = e._abilities[ a ];
      if( ability.css )
      _.dom.cssGlobal
      ({
        css : ability.css,
        key : ability.maker,
        document : o.dstDocument,
      });

    }

  });

}

abilityCssExport.defaults =
{
  targetDom : null,
  dstDocument : null,
}

//

function copyable( o )
{
  o = o || Object.create( null );

  _.routine.options_( copyable, o );
  _.assert( _.dom.domableIs( o.containerDom ) );
  _.assert( _.dom.domableIs( o.targetDom ) );

  o.containerDom = $( o.containerDom );
  if( _.strIs( o.targetDom ) )
  o.targetDom = o.containerDom.find( o.targetDom );
  else
  o.targetDom = $( o.targetDom );

  /* */

  _.assert( o.targetDom.length > 0 );
  _.assert( o.containerDom.length > 0 );

  /* */

  o.targetDom
  .on( _.dom.eventName( 'click' ), function( e )
  {
    let dom = $( this );
    let val = this.value;

    if( !this.value.length )
    this.value = this.placeholder;
    this.setSelectionRange( 0, this.value.length );

    let successful = document.execCommand( 'copy' );

    if( !successful )
    _.errLog( 'copyable :', 'fail to copy into clipboard' );

    if( !val.length )
    this.value = val;

  });

}

copyable.defaults =
{
  containerDom : 'body',
  targetDom : 'input'
}

//

function copyableHtmlText( o )
{
  o = o || Object.create( null );

  _.routine.options_( copyableHtmlText, o );
  _.assert( _.dom.domableIs( o.targetDom ) );

  /* */

  o.containerDom = $( o.containerDom );
  if( _.strIs( o.targetDom ) )
  o.targetDom = o.containerDom.find( o.targetDom );
  else
  o.targetDom = $( o.targetDom );

  o.containerDom.attr( 'wcopyable-html-text', 1 );

  /* */

  _.assert( o.targetDom.length > 0 );
  _.assert( o.containerDom.length > 0 );

  /* */

  o.targetDom
  .on( _.dom.eventName( 'click' ), function( e )
  {
    let dom = $( this ).closest( '[ wcopyable-html-text ]' );
    _.dom.clipboardCopy( _.dom.textGet( dom ) );
  });

}

copyableHtmlText.defaults =
{
  containerDom : 'body',
  targetDom : null,
}

//

function pinnable( o )
{
  o = o || Object.create( null );

  _.routine.options_( pinnable, o );

  if( o.makingTargetDom && !o.targetDom )
  o.targetDom = o.containerDom;

  _.assert( _.dom.domableIs( o.targetDom ) );

  /* */

  o.containerDom = $( o.containerDom );
  if( _.strIs( o.targetDom ) )
  o.targetDom = o.containerDom.find( o.targetDom );
  else
  o.targetDom = $( o.targetDom );

  /* */

  if( o.makingTargetDom )
  {
    o.targetDom = $( '<i class="ui pin icon"></i>' ).appendTo( o.targetDom );
    // o.targetDom.css();
  }

  o.containerDom.attr( 'wpinnable', 1 );

  /* */

  function handlePin( event )
  {
    let icon = $( this );
    let dom = icon.closest( '[ wpinnable ]' );
    let value = o.onPin.call( dom, !dom.attr( 'wpinned' ) );

    if( value )
    {
      icon.removeClass( 'pin' );
      icon.addClass( 'x' );
    }
    else
    {
      icon.addClass( 'pin' );
      icon.removeClass( 'x' );
    }

    if( value )
    dom.attr( 'wpinned', 1 );
    else
    dom.removeAttr( 'wpinned' );

    /*console.log( 'pinned',value );*/

    return value;
  }

  /* */

  o.pin = function()
  {
    if( arguments.length === 0 )
    return !!o.containerDom.attr( 'wpinned' );
    else
    {
      let src = !!arguments[ 0 ];
      if( o.pin() === src )
      return src;
      return handlePin.call( o.targetDom[ 0 ] );
    }
  }

  /* */

  o.targetDom
  .on( _.dom.eventName( 'click' ), handlePin );

  _.dom.abilityRegister
  ({
    targetDom : o.targetDom,
    settings : o,
    maker : pinnable,
  });

  return o;
}

pinnable.defaults =
{
  containerDom : 'body',
  targetDom : null,
  makingTargetDom : 0,
  onPin : function( value ){ return value },
}

//

let subjective = (function()
{

  return function subjective( o )
  {
    o = o || Object.create( null );
    let optionsDefault =
    {
      container : 'body',
      target : null,
      onFocus : function( value ){ return value },
    }

    _.map.assertHasOnly( o, optionsDefault );
    _.props.supplement( o, optionsDefault );
    _.assert( _.dom.domableIs( o.target ) );

    //

    o.container = $( o.container );
    if( _.strIs( o.target ) )
    o.target = o.container.find( o.target );
    else
    o.target = $( o.target );

    o.target.attr( 'wsubjective', 1 );

    //

    o.target
    .on( _.dom.eventName( 'mouseleave' ), function( event )
    {
      let icon = $( this );
      let dom = icon.closest( '[ wsubjective ]' );

      o.onFocus.call( dom, false );

    });

  }

})();

//

function widgable( o )
{
  o = o || Object.create( null );

  _.routine.options_( widgable, o );

  o.targetDom = $( o.targetDom );
  if( !o.containerDom )
  o.containerDom = o.targetDom.parent();

  _.assert( o.targetDom.length === 1 );
  _.assert( o.containerDom.length === 1 );

  function handleMenuItem( e )
  {
  }

  if( 0 )
  _.dom.pinnable
  ({
    makingTargetDom : 1,
    containerDom : parentDom,
    // targetDom : '.pin.icon',
    onPin : function( value )
    {
    }
  });

  o.resizable = _.dom.resizable
  ({
    targetDom : o.targetDom,
    containerDom : o.containerDom,
    firingEventsForDom : o.firingEventsForDom,
  });

  o.menuable = _.dom.menuable
  ({
    targetDom : o.targetDom,
    onEvent : handleMenuItem,
    firingEventsForDom : o.firingEventsForDom,
  });

  o.draggable = _.dom.draggable2
  ({
    targetDom : o.targetDom,
    manualDragApplication : 0,
    nonDraggableAttr : _.arrayFlatten( [ 'wresizing' ], [ o.nonDraggableAttr ] ),
  });

}

widgable.defaults =
{
  targetDom : null,
  containerDom : null,
  firingEventsForDom : 'canvas',
  nonDraggableAttr : 'wdragable-inactive',
}

//

function tristatable( o )
{
  o = o || Object.create( null );

  _.map.assertHasOnly( o, tristatable.defaults );
  _.props.supplement( o, tristatable.defaults );
  _.assert( _.dom.domableIs( o.items ) );

  //

  o.items = $( o.items );
  _.assert( o.items.length >= 1 );

  //

  o.itemSet = function( state )
  {
    let stateWas = _.props.extend( null, o.state );

    _.assert( _.strIs( state.name ) );

    if( state.on === undefined )
    state.on = state.name !== stateWas.name || !stateWas.on;

    if( stateWas.name === state.name && !!stateWas.on === !!state.on )
    return;

    /*Object.freeze( state );*/

    if( o.onChange( state, stateWas ) === false )
    {
      o.state = stateWas;
      return false;
    }
    else
    {
      o.state = state;
      if( o.context )
      o.context.eventGive
      ({
        kind : 'tristateChange',
        tristate : o,
        state,
        stateWas,
      });

      return true;
    }
  }

  //

  if( o.eventForActivation )
  o.items
  .on( _.dom.eventName( o.eventForActivation ), function( event )
  {
    let t = $( this );
    let state = Object.create( null );
    state.name = o.onStateNameOf( t, event );
    state.dom = t;

    _.assert( _.strIs( state.name ) );

    o.items.removeClass( 'active' );
    if( o.itemSet( state ) )
    if( o.state.on )
    t.addClass( 'active' );

  });

  return o;
}

tristatable.defaults =
{
  items : null,
  state : {},
  context : null,
  eventForActivation : 'click',
  onChange : function( state, stateWas ){ return true; },
  onStateNameOf : function( dom, event ){ throw _.err( 'no assigned' ); },
}

// --
//
// --

function buttonMake( o )
{

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.routine.options_( buttonMake, o );

  o.parentDom = $( o.parentDom );
  let html = o.onHtmlGet( o );
  o.buttonDom = $( html );

  _.assert( o.parentDom.length > 0, 'DOM with selector ".buttons-container" not found' );
  _.assert( o.buttonDom.length > 0 );

  _.dom.uiInitPopups( o.buttonDom );
  o.buttonDom.appendTo( o.parentDom );

  if( o.onClick )
  {
    o.buttonDom.on( _.dom.eventName( 'mouseup' ), ( e ) => o.onClick.call( o.context || this, e ) );
    if( o.keyboard && _global_.Mousetrap )
    _global_.Mousetrap.bind( o.keyboard, ( e ) => o.onClick.call( o.context || this, e ) );
  }

  return o;
}

buttonMake.defaults =
{
  parentDom : null,
  text : '',
  hint : '',
  cssClass : '',
  keyboard : null,
  onClick : null,
  onHtmlGet : null,
  context : null,
}

//

function panelMake( o )
{
  o = o || Object.create( null );
  if( !_.object.isBasic( o ) )
  o = { targetDom : o }

  _.routine.options_( panelMake, o );
  o.targetDom = $( o.targetDom );

  if( !o.targetDom.length )
  o.targetDom = $( '<' + o.htmlTag + '>' );

  _.assert( arguments.length === 0 || arguments.length === 1 );
  _.assert( o.targetDom.length >= 1 );

  if( !o.targetDom.parents().has( document.body ).length )
  $( document.body ).append( o.targetDom );

  if( o.cssClasses )
  _.dom.s.class( o.targetDom, o.cssClasses, 1 );

  if( o.css )
  {
    if( o.total )
    o.targetDom.css
    ({
      'z-index' : '1000',
      'left' : '0',
      'top' : '0',
      'width' : '100%',
      'height' : '100%',
    });
    else
    o.targetDom.css
    ({
      'width' : '200px',
      'height' : '200px',
      'border-width' : '1px',
      'border-style' : 'solid',
      'border-color' : '#999',
    });
  }

  if( o.fill )
  o.targetDom.css({ 'background-color' : o.fill });

  return o;
}

panelMake.defaults =
{
  targetDom : null,
  // fill : 'red',
  fill : 'silver',
  cssClasses : [ 'layout-stretch' ],
  css : 1,
  htmlTag : 'div',
  total : 0,
}

//

function totalPanelMake( o )
{
  o = o || Object.create( null );
  if( !_.object.isBasic( o ) )
  o = { targetDom : o }

  o.total = 1;
  if( !o.cssClasses )
  o.cssClasses = [ 'layout-stretch', 'panel-total' ];

  return _.dom.panelMake( o );
}

totalPanelMake.defaults =
{
  total : 1,
}

// totalPanelMake.defaults.__proto__ = panelMake.defaults;
Object.setPrototypeOf( totalPanelMake.defaults, panelMake.defaults )

//

function shut( down, container, imageUrl )
{

  if( container === undefined ) container = $( 'body' );
  container = $( container );
  if( down === undefined ) down = 1;
  if( imageUrl === undefined ) imageUrl = '/amid_viewer/image/loading.gif';

  if( down )
  {
    if( typeof Mousetrap !== 'undefined' ) Mousetrap.pause();
    let result = $( '.dom-shut-down', container );
    if( result.length )return result;
    result = $( '<div>' )
    .addClass( 'dom-shut-down' )
    .css( 'z-index', 1000 )
    .css( 'position', 'fixed' )
    .css( 'left', '0' )
    .css( 'top', '0' )
    .css( 'width', '100%' )
    .css( 'height', '100%' )

    .css( 'background', 'rgba(0,0,0,0.2)' )
    .css( 'background-image', 'url(' + imageUrl + ')' )
    .css( 'background-repeat', 'no-repeat' )
    .css( 'background-repeat', 'no-repeat' )
    .css( 'background-position', 'center' )
    .css( 'background-size', '80px 80px' )

    .appendTo( container );
    return result;
  }
  else
  {
    if( Mousetrap ) Mousetrap.unpause();
    let result = $( '.dom-shut-down', container );
    return result.remove();
  }

}

//

function offscreenMake()
{

  if( arguments.length === 0 )
  {

    let result = $( 'body > div.offscreen' );

    if( !result.length )
    {
      result = $( '<div>' )
      .addClass( 'offscreen' )
      .css( 'display', 'fixed' )
      .css( 'position', 'absolute' )
      .css( 'left', '1000000px' )
      .css( 'top', '1000000px' )
      .css( 'z-index', '-10' )
      .css( 'width', 'auto' )
      .css( 'height', 'auto' )
      .css( 'opacity', '1' )
      .css( 'overflow', 'visible' )
      .appendTo( 'body' );
    }

    return result;
  }
  else if( arguments.length === 1 || arguments.length === 2 )
  {
    let dst = $( arguments[ 0 ] );
    let value = arguments[ 1 ] === undefined ? 1 : arguments[ 1 ];

    _.assert( dst.length === 1 );

    if( value )
    {

      dst[ 0 ]._domOffscreenOriginalCss = _.dom.cssGet( dst, [ 'display', 'left', 'top' ] );

      let css =
      {
        'display' : 'block',
        'left' : '100000px',
        'top' : '100000px',
      }

      _.dom.cssSet( dst, css );

    }
    else
    {

      _.assert( dst[ 0 ]._domOffscreenOriginalCss );

      if( dst[ 0 ]._domOffscreenOriginalCss )
      _.dom.cssSet( dst, dst[ 0 ]._domOffscreenOriginalCss );
      // dst, dst[ 0 ]._domOffscreenOriginalCss = null;
      dst[ 0 ]._domOffscreenOriginalCss = null;

    }

  }
  else throw _.err( 'unexpected' );

}

//

function textEditMake( o )
{
  let con = new _.Consequence();

  if( o === undefined )
  o = Object.create( null );

  if( _.strIs( o ) )
  o = { text : o };

  _.routine.options_( textEditMake, o );

  o.container = $( o.container );

  _.assert( o.container.length >= 1 );
  _.assert( arguments.length === 0 || arguments.length === 1 );

  /* textarea */

  o.textarea = $( '<textarea>' );
  o.textarea.text( o.text );
  o.textarea.css
  ({
    'width' : '100%',
    'height' : '100%',
  });

  /* hud */

  if( o.usingHud )
  {

    let hudOptions =
    {
      data : Object.create( null ),
      containerDom : o.container,
      resizable : 1,
      pinned : 1,
      onPin : function( value )
      {
        if( !value )
        con.take( o.textarea.text() );
        return value;
      }
    }

    if( !o.hud )
    o.hud = new wHud( hudOptions );

    o.hud.centrate();
    o.hud.show();

    o.container = o.hud.contentDom;

  }

  /* */

  /*
    o.container = $( '<div>' ).appendTo( o.container );
    o.container.css
    ({
      'overflow' : 'hidden',
      'width' : '100%',
      'height' : '100%',
    });
  */

  /* */

  o.textarea.appendTo( o.container );

  return con;
}

textEditMake.defaults =
{

  container : 'body',
  text : '',
  usingHud : 1,

}

// --
//
// --

function habbitMouseClick( o )
{

  let mouseup = _.dom.eventName( 'mouseup' );
  let mousedown = _.dom.eventName( 'mousedown' );
  let mousemove = _.dom.eventName( 'mousemove' );

  _.routine.options_( habbitMouseClick, o );

  _.assert( _.object.isBasic( o.onEvent ) || _.routineIs( o.onEvent ) );
  _.assert( !!o.dom );

  o.down = [ null, null ];
  o.up = [ null, null ];

  // give click

  function giveEvent( kindOfMouseEvent, down, up )
  {

    if( !o.givingSingleClick && kindOfMouseEvent === 'single' )
    return;

    // console.log( 'giveEvent :',kindOfMouseEvent,_.time.now() - down.clickTime );

    let e =
    {
      kind : 'mouseEvent',
      kindOfMouseEvent,
      clickHandler : o,
      target : down.mouseEvent.target,
      mouse : down.mouseEvent,
      down : down.mouseEvent,
      up : up ? up.mouseEvent : null,
      position : down.clickPosition,
      time : down.clickTime,
      extendingEvent : down.extendingEvent,
    }

    if( _.routineIs( o.onEvent ) )
    o.onEvent.call( o, e );
    else
    o.onEvent.eventGive( e );

  }

  // maybe single click

  function maybeSingle()
  {

    if( !o.up[ 1 ] || !o.down[ 1 ] )
    return;

    /* double or single click? */

    if( tooFar )
    {
      giveEvent( 'single', o.down[ 1 ], o.up[ 1 ] );
      o.down[ 1 ] = null;
      o.up[ 1 ] = null;
    }

  }

  // handle mousedown

  function handleMouseDown( event, extendingEvent )
  {

    o.down[ 1 ] = o.down[ 0 ];
    let down = o.down[ 0 ] = Object.create( null );

    down.mouseEvent = event;
    down.clickPosition = _.dom.eventClientPosition( event );
    down.clickTime = event.timeStamp;
    down.extendingEvent = extendingEvent;

    /* give previous single click if mouse up was too far from the new mouse down */

    if( o.down[ 1 ] && o.up[ 0 ] )
    {

      let tooFar = _.avector.distanceSqr( o.down[ 0 ].clickPosition, o.down[ 1 ].clickPosition ) > o.clickPositionTolerance;
      if( tooFar )
      {
        giveEvent( 'single', o.down[ 1 ], o.up[ 0 ] );
        o.down[ 1 ] = null;
        o.up[ 0 ] = null;
      }

    }

    let delay2 = o.repeatDelay2;
    function handleRepeat()
    {

      if( o.down[ 0 ] !== down )
      return;

      if( o.up[ 0 ] )
      return;

      giveEvent( 'repeat', o.down[ 0 ], null );
      setTimeout( handleRepeat, delay2 );
      delay2 -= 1;

    }

    if( o.givingRepeat )
    setTimeout( handleRepeat, o.repeatDelay1 );

  }

  // handle mouseup

  function handleMouseUp( event, extendingEvent )
  {

    o.up[ 1 ] = o.up[ 0 ];
    let up = o.up[ 0 ] = Object.create( null );

    up.mouseEvent = event;
    up.clickPosition = _.dom.eventClientPosition( event );
    up.clickTime = event.timeStamp;
    up.extendingEvent = extendingEvent;

    /* orphan */

    if( !o.down[ 0 ] )
    {
      o.up[ 0 ] = null;
      return;
    }

    /* too far */

    let tooFar = _.avector.distanceSqr( o.up[ 0 ].clickPosition, o.down[ 0 ].clickPosition ) > o.clickPositionTolerance;

    /* too late */

    var tooLate;
    if( o.givingDoubleClick )
    tooLate = o.up[ 0 ].clickTime - o.down[ 0 ].clickTime > o.clickDelay;
    else
    tooLate = true;
    if( tooLate )
    {
      o.down[ 0 ] = null;
      o.up[ 0 ] = null;
      maybeSingle();
      return;
    }

    /* maybe double */

    if( o.up[ 1 ] && o.down[ 1 ] )
    {

      if( tooFar )
      {
        maybeSingle();
      }
      else
      {
        giveEvent( 'double', o.down[ 1 ], o.up[ 0 ] );
        o.down[ 0 ] = null;
        o.up[ 0 ] = null;
        return;
      }

    }

    /* too far mouseup */

    if( tooFar )
    {
      o.down[ 0 ] = null;
      o.up[ 0 ] = null;
      return;
    }

    /* is click */

    // console.log( 'before.timeout',o.down,o.up );

    let delay = Math.max( 1, o.down[ 0 ].clickTime - _.time.now() + o.clickDelay-10 );
    setTimeout( function()
    {

      _.assert( !!o.givingDoubleClick );

      // console.log( 'after.timeout',o.down,o.up );

      if( o.up[ 0 ] !== up )
      {
        return;
      }

      _.assert( !!o.down[ 0 ] );

      /*
            if( o.up[ 1 ] )
            debugger;
            happen sometimes !!!
      */

      if( o.down[ 1 ] )
      {
        giveEvent( 'single', o.down[ 1 ], o.up[ 0 ] );
        o.down[ 1 ] = null;
        o.up[ 0 ] = null;
      }
      else
      {
        giveEvent( 'single', o.down[ 0 ], o.up[ 0 ] );
        o.down[ 0 ] = null;
        o.up[ 0 ] = null;
      }

      o.down[ 1 ] = null;
      o.up[ 1 ] = null;

    }, delay );

  }

  // hamdler of mousem ove

  function handleMouseMove( e, extendingEvent )
  {

    if( !o.down[ 0 ] )
    return;

    let clickPosition = _.dom.eventClientPosition( e );
    let tooFar = _.avector.distanceSqr( clickPosition, o.down[ 0 ].clickPosition ) > o.clickPositionTolerance;

    if( tooFar )
    {

      if( o.down[ 0 ] && o.up[ 0 ] )
      giveEvent( 'single', o.down[ 0 ], o.up[ 0 ] );

      o.down[ 0 ] = null;
      o.up[ 0 ] = null;
    }

  }

  // handler of events

  o.handleMouseEvent = function( event, extendingEvent )
  {

    // if( event.type !== 'mousemove' )
    // debugger;

    _.assert( arguments.length === 1 || arguments.length === 2 );
    _.assert( _.dom.eventIs( event ) );

    if( event.type === mousedown )
    handleMouseDown( event, extendingEvent );
    else if( event.type === mouseup )
    handleMouseUp( event, extendingEvent );
    else if( event.type === mousemove )
    handleMouseMove( event, extendingEvent );
    else
    throw _.assert( 0, 'unexpected event type', event.type );

  }

  o.dom = _.dom.from( o.dom );

  if( !o.usingManualEventsOnly )
  {

    o.dom
    .on( mouseup, o.handleMouseEvent )
    .on( mousedown, o.handleMouseEvent )
    .on( mousemove, o.handleMouseEvent );

  }

  _.accessor.forbid
  ({
    object : o,
    strict : 0,
    names : { clientPosition : 'clientPosition' },
  });

  Object.preventExtensions( o );
  Object.seal( o );

  return o;
}

habbitMouseClick.defaults =
{
  dom : null,
  onEvent : null,

  usingManualEventsOnly : 0,

  givingSingleClick : 1,
  givingDoubleClick : 1,
  givingRepeat : 0,

  mouseEvent : null,

  clickPositionTolerance : 25,
  clickDelay : 300,
  repeatDelay1 : 450,
  repeatDelay2 : 150,
}

//

function habbitKeyEnter( o )
{
  let keyUpName = 'keyup';
  let keyDownName = 'keydown';
  let value = '';
  let lastEvent = null;

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.routine.options_( habbitKeyEnter, o );

  // give event

  function giveEvent()
  {

    let e =
    {
      kind : 'keybaordEnter',
      enterHandler : o,
      value,
      lastEvent,
    }

    if( _.routineIs( o.onEvent ) )
    o.onEvent.call( o, e );
    else
    o.onEvent.eventGive( e );

  }

  // original events handler

  o.handleKeyEvent = function handleKeyEvent( e )
  {

    if( !e.key || e.key.length !== 1 )
    return;

    value += e.key;
    lastEvent = e;

    setTimeout( function()
    {

      if( e !== lastEvent )
      return;

      giveEvent();

      value = '';

    }, o.delay );

  }

  if( !o.usingManualEventsOnly )
  {

    o.dom
    .on( keyUpName, o.handleKeyEvent )
    //.on( keyDownName,o.handleKeyEvent );

  }

}

habbitKeyEnter.defaults =
{
  onEvent : null,
  delay : 1000,
  dom : null,
}

//

function habbitDrag( o )
{
  let mouseup = _.dom.eventName( 'mouseup' );
  let mousedown = _.dom.eventName( 'mousedown' );
  let mousemove = _.dom.eventName( 'mousemove' );
  let mouseleave = _.dom.eventName( 'mouseleave' );
  let value = '';
  let lastEvent = null;

  if( _.dom.like( o ) )
  o = { targetDom : o }

  if( o.arbitrary )
  _.mapComplement( o, habbitDrag.defaults );
  else
  _.routine.options_( habbitDrag, o );

  o.targetDom = $( o.targetDom );

  if( !o.rootDom )
  o.rootDom = o.targetDom.parent();
  o.rootDom = $( o.rootDom );

  o.down = null;
  o.position = null;
  o.delta = [ 0, 0 ];
  o.targetOldPosition = [ 0, 0 ];
  o.targetNewPosition = [ 0, 0 ];

  if( o.draggableAttr )
  _.dom.s.attr( o.targetDom, o.draggableAttr, 1 );

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( o.targetDom.length === 1 );
  _.assert( o.rootDom.length === 1 );

  /* */

  function giveEvent( e, kind )
  {

    let event = Object.create( null );
    event.original = e;
    event.handler = o;
    event.kind = kind;

    if( _.consequenceIs( o.onEvent ) )
    return o.onEvent.eventGive( event );
    else if( _.routineIs( o.onEvent ) )
    return o.onEvent( event );
    else _.assert( o.onEvent === null );

  }

  /* */

  o.handleMouseDown = function handleMouseDown( e )
  {

    if( o.nonDraggableAttr )
    if( _.dom.attrHasAny( o.targetDom, o.nonDraggableAttr ) || _.dom.attrHasAny( e.target, o.nonDraggableAttr ) )
    return;

    // return;
    console.log( 'habbitDrag : handleMouseDown' );

    if( o.draggingAttr )
    _.dom.s.attr( o.targetDom, o.draggingAttr, 1 );

    o.down = _.dom.eventClientPosition
    ({
      event : e,
      relative : o.relativeDom,
    });

    o.targetOldPosition = _.dom.leftTopGet( o.targetDom );
    for( let i = 0 ; i < 2 ; i++ )
    o.targetNewPosition[ i ] = o.targetOldPosition[ i ];

    if( giveEvent( e, 'dragBegin' ) === false )
    o.down = null;
    else
    return false;
  }

  /* */

  o.handleMouseUp = function handleMouseUp( e )
  {

    if( o.down === null )
    return;

    console.log( 'habbitDrag : handleMouseUp' );

    if( o.draggingAttr )
    _.dom.s.attr( o.targetDom, o.draggingAttr, 0 );

    if( giveEvent( e, 'dragEnd' ) !== false )
    o.down = null;

  }

  /* */

  o.handleMouseMove = function handleMouseMove( e )
  {

    if( !o.down )
    return;

    // console.log( 'habbitDrag : handleMouseMove' );

    o.position = _.dom.eventClientPosition
    ({
      event : e,
      relative : o.relativeDom,
    });

    for( let i = 0 ; i < 2 ; i++ )
    {
      if( o.allowedDirections[ i ] )
      o.delta[ i ] = o.position[ i ] - o.down[ i ];
      else
      o.delta[ i ] = 0;
      o.targetNewPosition[ i ] = o.targetOldPosition[ i ] + o.delta[ i ];
    }

    giveEvent( e, 'drag' );

  }

  /* original events handler */

  o.handleEvent = function handleEvent( e )
  {

    if( e.type === mousedown )
    return o.handleMouseDown( e );
    else if( e.type === mouseup )
    return o.handleMouseUp( e );
    else if( e.type === mousemove )
    return o.handleMouseMove( e );
    else if( e.type === mouseleave )
    return o.handleMouseUp( e );

  }

  o.bindTarget = function bindTarget()
  {
    o.targetDom
    .on( mousedown, o.handleEvent );
  }

  o.bindRoot = function bindRoot()
  {
    o.rootDom
    .on( mouseup, o.handleEvent )
    .on( mousemove, o.handleEvent )
    .on( mouseleave, o.handleEvent );
  }

  o.unbindRoot = function unbindRoot()
  {
    o.rootDom
    .off( mouseup, o.handleEvent )
    .off( mousemove, o.handleEvent )
    .off( mouseleave, o.handleEvent );
  }

  /* */

  if( !o.usingManualEventsOnly )
  {

    o.bindTarget();
    o.bindRoot();

  }

  return o;
}

habbitDrag.defaults =
{
  onEvent : null,
  targetDom : null,
  rootDom : 'body',
  relativeDom : null,
  allowedDirections : [ 1, 1 ],
  usingManualEventsOnly : 0,
  arbitrary : 0,

  draggingAttr : 'wdragging',
  draggableAttr : 'wdraggable',
  nonDraggableAttr : '',
}

//

function draggable2( o )
{

  if( _.dom.like( o ) )
  o = { targetDom : o }
  o.arbitrary = 1;
  _.routine.options_( draggable2, o );
  o = _.dom.habbitDrag( o );

  /* drag */

  function drag()
  {

    o.targetDom.css
    ({
      'left' : o.targetNewPosition[ 0 ] + 'px',
      'top' : o.targetNewPosition[ 1 ] + 'px',
    });

  }

  /* */

  let onEvent = o.onEvent;
  o.onEvent = function handleMouseMove( e )
  {

    if( !o.manualDragApplication )
    drag( e );

    if( onEvent )
    onEvent.call( this, e );

  }

  _.dom.abilityRegister
  ({
    targetDom : o.targetDom,
    settings : o,
    maker : draggable2,
  });

  o.targetDom
  .on( 'domRelocated', function( e )
  {
    if( o.usingManualEventsOnly )
    return;

    o.unbindRoot();
    o.rootDom = $( this ).parent();
    o.bindRoot();

  });

  return o;
}

draggable2.defaults =
{

  usingManualEventsOnly : 0,
  manualDragApplication : 1,

}
// draggable2.defaults.__proto__ = habbitDrag.defaults;
Object.setPrototypeOf( draggable2.defaults, habbitDrag.defaults )

//

let draggable = (function()
{

  var styleAdded;

  function addStyles()
  {
    if( styleAdded )
    return;

    styleAdded = true;

    let style = $( '<style>' );

    style
    .prop( 'type', 'text/css' )
    .appendTo( 'head' )
    .html
    ([
      '[ wdragging ], [ wdragging ] *',
      '{',
      'cursor : move',
      '}',
    ].join( '\n' ));

  }

  return function draggable( o )
  {
    o = o || Object.create( null );

    _.routine.options_( draggable, o );

    if( o.notDraggableTagNames === null )
    o.notDraggableTagNames = [ 'TEXTAREA', 'INPUT' ]

    _.assert( _.dom.domableIs( o.target ) );
    _.assert( _.dom.domableIs( o.container ) );
    _.assert( arguments.length === 1, 'Expects single argument' );

    o.state = Object.create( null );
    o.container = $( o.container );
    o.target = $( o.target );
    o.target.attr( 'wdraggable', 1 );

    /* */

    addStyles();

    /* */

    o.target
    .on( _.dom.eventName( 'mousedown' ), function( event )
    {

      let notDraggable = $( this ).closest( '[ wdraggable-not ]' );
      if( notDraggable.length )
      return;

      let tagName = event.target.tagName;
      if( o.notDraggableTagNames.indexOf( tagName ) !== -1 )
      return;

      let dom = $( this ).closest( '[ wdraggable ]' );

      o.state.target = dom;
      o.state.offset = dom.offset();
      o.state.offset = [ o.state.offset.left, o.state.offset.top ];
      o.state.start = _.dom.eventClientPosition( event );

      o.container.attr( 'wdragging', 1 );
      dom.attr( 'wdragging', 1 );
    })
    .on( _.dom.eventName( 'drag' ), function( event )
    {
      event.preventDefault();
      return false;
    });

    /* */

    o.container
    .on( _.dom.eventName( 'mouseup' ), function( event )
    {
      if( !o.state.start )return;
      o.state.start = null;
      o.state.target.removeAttr( 'wdragging' );
      o.container.removeAttr( 'wdragging' );
    })
    .on( _.dom.eventName( 'mousemove' ), function( event )
    {
      if( !o.state.start )return;
      let dom = o.state.target;
      let pos = _.dom.eventClientPosition( event );
      dom.offset
      ({
        left : o.state.offset[ 0 ] + pos[ 0 ] - o.state.start[ 0 ],
        top : o.state.offset[ 1 ] + pos[ 1 ] - o.state.start[ 1 ],
      });
    });

  }

})();

draggable.defaults =
{
  container : 'body',
  target : null,
  notDraggableTagNames : null,
}

//
//
//

function habitRightClick( targetSelector, onEvent )
{

  let touchSupported = ( 'ontouchstart' in window ) || ( 'onmsgesturechange' in window );
  let eventName = _.dom.eventName( touchSupported ? 'taphold' : 'mouseup' );


  $( targetSelector ).on( eventName, function( event )
  {

    if( event.which !== 3 )
    return;

    event = { mouse : event };

    onEvent.call( this, event );

  })

}

//

function habitDropFile( targetDom, onEvent )
{

  _.assert( _.dom.domableIs( targetDom ) )

  let target = $( targetDom );

  _.assert( targetDom.length === 1 );

  target[ 0 ].addEventListener( 'dragover', function( event )
  {

    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

  }, false );

  target[ 0 ].addEventListener( 'drop', function( event )
  {

    let self = this;

    event.stopPropagation();
    event.preventDefault();

    let files = event.dataTransfer.files;
    onEvent.call( this, files, event );

  }, false );

}

// --
// ui
// --

function uiPopupDefaults( dom )
{

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( _.dom.domableIs( dom ) );

  /* console.log( 'popup :',_.dom.nickname( dom,'data-tab' ) ); */

  dom = $( dom );
  let position = _.dom.attrInherited( dom, 'data-position' ) || 'bottom center';
  let variation = _.dom.attrInherited( dom, 'data-variation' ) || '';

  let hoverable = dom.hasClass( 'hoverable' );
  let inline = dom.hasClass( 'inline' );

  var defaults =
  {
    'exclusive' : true,
    position,
    hoverable,
    inline,
    variation,
    'delay' :
    {
      show : 750,
      hide : hoverable ? 500 : 0,
    }
  }

  return defaults;
}

//

function uiInitPopups( dom )
{

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( _.dom.domableIs( dom ) );

  dom = $( dom );

  let popups = dom
  .find( '[ title ],[ data-html ],[ data-content ]' )
  .addBack( '[ title ],[ data-html ],[ data-content ]' );

  popups.each( function( k, e )
  {

    e = $( e );
    let thePopupOptions = uiPopupDefaults( e );

    e.popup( thePopupOptions );
    if( thePopupOptions[ 'inline' ] )
    {
      e.popup( 'show' ).popup( 'hide' );
    }

  });

}

//

function uiInitDropdown( o )
{

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.routine.options_( uiInitDropdown, o );
  _.assert( _.dom.domableIs( o.targetDom ) );

  if( o.dropdownOptions === null )
  o.dropdownOptions = Object.create( null );

  o.targetDom = $( o.targetDom );

  o.targetDom.find( '.ui.dropdown:not( .hoverable )' )
  .dropdown( o.dropdownOptions );

  o.targetDom.find( '.ui.dropdown.hoverable' )
  .dropdown( _.props.extend( { on : 'hover' }, o.dropdownOptions || Object.create( null ) ) );

}

uiInitDropdown.defaults =
{
  targetDom : null,
  dropdownOptions : null,
}

//

let uiTabsInit = ( function uiTabsInit()
{

  let _currentTab = false;

  return function uiTabsInit( o )
  {

    // if( arguments.length === 1 && _.mapIs( targetDom ) )
    // o = targetDom;
    // else if( arguments.length === 1 && _.dom.domableIs( targetDom ) )
    // o = { targetDom : targetDom };
    // else if( arguments.length === 2 )
    // o.targetDom = targetDom;

    // o = o || Object.create( null );

    _.assert( arguments.length === 1, 'Expects single argument' );
    _.assert( !o.targetDom || _.dom.domableIs( o.targetDom ), 'uiTabsInit :', 'Expects { targetDom } as first argument' );
    _.map.assertHasNoUndefine( o );
    _.routine.options_( uiTabsInit, o );

    let body = $( document.body );
    if( !o.targetDom ) o.targetDom = body;
    o.targetDom = $( o.targetDom );

    /* not dynamic */

    o.targetDom.find( 'a[ data-tab ]:not( .dynamic ):not( .disabled )' )
    .each( function( k, e )
    {
      e = $( e );
      let dataTabContext = e
      .parents( '[ data-tab-context ]' )
      .add( e )
      .attr( 'data-tab-context' );
      let dataTabName = e.attr( 'data-tab' );
      e.tab
      ({
        onLoad : o.onTabLoad,
        context : ( dataTabContext ? dataTabContext : body ),
      });
      /*e.tab();*/
    });

    /* dynamic */

    let dynamic = o.targetDom.find( 'a.dynamic[ data-tab ]:not( .disabled )' );

    if( !dynamic.length )
    return;

    _.assert( o.onTabLoad );

    let tabOptions =
    {
      /*auto : true,*/
      cache : false,
      history : true,
      /*historyType : 'state',*/
      /*historyType : dataHistoryType,*/
      /*path : rootUrl,*/
      /*context : ( dataTabContext ? dataTabContext : body ),*/
      onLoad : function( tabPath, parameterArray, historyEvent )
      {
        let t = this;
        if( t._tabOptions && t._tabOptions.loading )
        return;
        /*if( _currentTab !== tabPath || ( t._tabOptions && !t._tabOptions.cache ) )*/
        if( !t._tabOptions || !t._tabOptions.cache )
        {
          tabOptions.onFirstLoad.call( t, tabPath, parameterArray, historyEvent, t._tabOptions.url );
          return;
        }
        o.onTabLoad.call( t, tabPath, parameterArray, historyEvent, t._tabOptions.url );
      },
      onFirstLoad : function( tabPath, parameterArray, historyEvent )
      {

        if( _currentTab === tabPath )
        {
          throw _.err( 'not expected' );
          return;
        }

        let t = this;
        let path = ( historyEvent && historyEvent.path !== '/' ) ? historyEvent.path : tabPath;
        let dataTab = $( this ).attr( 'data-tab' );
        let a = $( 'a[ data-tab=' + dataTab + ' ]' );
        let rootUrl = a.attr( 'data-tab-url' ) || '';
        let dataCache = a.attr( 'data-tab-cache' );
        if( dataCache === undefined )
        dataCache = true;
        else
        dataCache = _.boolFrom( dataCache );

        let url = encodeURI( _.uri.join( rootUrl, path ) );

        t._tabOptions = Object.create( null )
        t._tabOptions.cache = dataCache;
        t._tabOptions.url = url;
        t._tabOptions.loading = true;

        console.log( 'onFirstLoad :', dataTab );
        $( this )
        .load( url, function( responseData, status, xhr )
        {
          if( status === 'error' )
          {
            var html, reason;

            if( _.object.isBasic( xhr ) )
            reason = xhr.status + ' : ' + xhr.statusText;
            else
            reason = responseData.status + ' : ' + responseData.statusText;

            let err = _.errLog( reason );

            if( o.viewOnError )
            html = o.viewOnError({ reason });
            else
            html = 'Error ' + reason;

            $( this ).html( html );

          }
          else
          {
          }

          t._tabOptions.loading = false;
          o.onTabLoad.call( t, tabPath, parameterArray, historyEvent );

        });
        _currentTab = tabPath;
      },
    }

    //

    dynamic.tab( tabOptions );
    dynamic.each( function( k, e )
    {

      e = $( e );
      //let dataTabContext = e.parents().andSelf().filter( '[ data-tab-context ]' ).attr( 'data-tab-context' );
      //let dataHistoryType = e.parents().andSelf().filter( '[ data-tab-history-type ]' ).attr( 'data-tab-history-type' ) || 'hash';
      let dataTabContext = e
      .parents()
      .add( e )
      .filter( '[ data-tab-context ]' )
      .attr( 'data-tab-context' );
      let dataHistoryType = e
      .parents()
      .add( e )
      .filter( '[ data-tab-history-type ]' )
      .attr( 'data-tab-history-type' ) || 'hash';

      //let dataHistory = e.parents().andSelf().filter( '[ data-tab-history ]' ).attr( 'data-tab-history' );
      let dataHistory = e
      .parents()
      .add( e )
      .filter( '[ data-tab-history ]' )
      .attr( 'data-tab-history' );
      if( dataHistory === undefined ) dataHistory = true;
      else dataHistory = _.boolFrom( dataHistory );

      //let dataCache = e.parents().andSelf().filter( '[ data-tab-cache ]' ).attr( 'data-tab-cache' );
      let dataCache = e
      .parents()
      .add( e )
      .filter( '[ data-tab-cache ]' )
      .attr( 'data-tab-cache' );
      if( dataCache === undefined ) dataCache = true;
      else dataCache = _.boolFrom( dataCache );

      let dataTab = e.attr( 'data-tab' );
      let rootUrl = e.attr( 'data-tab-url' ) || '';

      let tabOptions =
      {
        auto : false,
        cache : dataCache,
        history : dataHistory,
        /*historyType : 'state',*/
        historyType : dataHistoryType,
        path : rootUrl,
        context : ( dataTabContext ? dataTabContext : body ),
      }

      e.tab( 'setting', tabOptions );

    });

  }

})();

uiTabsInit.defaults =
{

  targetDom : null,
  viewOnError : null,

  onTabLoad : null,
  onFirstLoad : null,

}

//

function uiInitGeneric( o )
{

  if( !_.mapIs( o ) )
  o = { targetDom : o }

  // if( arguments.length === 1 && _.mapIs( targetDom ) )
  // o = targetDom;
  // else if( arguments.length === 1 && _.dom.domableIs( targetDom ) )
  // o = { targetDom : targetDom };
  // else if( arguments.length === 2 )
  // o.targetDom = targetDom;

  if( o.dropdownOptions === null )
  o.dropdownOptions = Object.create( null );

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( !o.targetDom || _.dom.domableIs( o.targetDom ), 'uiInitGeneric :', 'Expects DOM {o.targetDom}' );
  _.map.assertHasNoUndefine( o );
  _.routine.options_( uiInitGeneric, o );

  let body = $( document.body );
  if( !o.targetDom )
  o.targetDom = body;
  o.targetDom = $( o.targetDom );

  _.assert( o.targetDom.length > 0 );

  // if( o.usingTabs )
  // debugger;

  if( o.usingTabs )
  _.dom.uiTabsInit( _.mapOnly_( null, o, _.dom.uiTabsInit.defaults ) );

  _.dom.uiInitPopups( o.targetDom );

  _.dom.uiInitDropdown( _.mapOnly_( null, o, _.dom.uiInitDropdown.defaults ) );

  _.dom.uiInitSimple( o.targetDom );

}

uiInitGeneric.defaults =
{
  targetDom : null,
  dropdownOptions : null,
  usingTabs : 1,
}
// uiInitGeneric.defaults.__proto__ = uiTabsInit.defaults;
Object.setPrototypeOf( uiInitGeneric.defaults, uiTabsInit.defaults )

//

function uiInitSimple( dom )
{

  o = o || Object.create( null );

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( _.dom.domableIs( dom ) );

  dom = $( dom );

  dom.find( '.ui.rating' ).rating();
  dom.find( '.ui.checkbox' ).checkbox();
  dom.find( '.ui.accordion' ).accordion();

}

uiInitSimple.defaults =
{
  dom : null
}

//

function uiShow( o )
{
  if( _.dom.is( o ) )
  o = { targetDom : o };

  if( arguments[ 2 ] !== undefined )
  o.value = arguments[ 2 ];

  _.assert( _.dom.domableIs( o.targetDom ) );
  _.assert( arguments.length === 1 || arguments.length === 2 );
  _.routine.options_( uiShow, o );
  _.assert( o.value !== undefined );

  o.targetDom = $( o.targetDom );

  if( !o.consequence )
  o.consequence = new _.Consequence();

  // console.log( 'uiShow',o.value );

  if( !o.targetDom.length )
  return o.consequence.take( null );

  if( o.value === undefined )
  //o.value = !o.targetDom.transition( 'is visible' );
  o.value = !o.targetDom[ 0 ]._uiShowVisible;

  // for( let i = 0 ; i < o.targetDom.length ; i++ )
  // o.targetDom[ i ];

  o.targetDom = o.targetDom.filter( function( k, e )
  {
    if( e._uiShowVisible === undefined )
    return true;
    return e._uiShowVisible === !o.value;
    // return ( e._uiShowVisible ) ^ !!o.value;
  });

  // if( !( o.targetDom.transition( 'is visible' ) ^ !!o.value ) )
  // return o.consequence.take( null );

  if( !o.targetDom.length )
  return o.consequence.take( null );

  if( o.consequence.competitorsEarlyGet().length > 1 )
  return o.consequence.take( null );

  o.targetDom = o.targetDom.filter( function( k, e )
  {
    if( e._uiShowVisible === undefined )
    if( o.value )
    $( e ).transition( 'hide' );
    else
    $( e ).transition( 'show' );

    e._uiShowVisible = !!o.value;
    return true;;
  });

  o.targetDom
  .transition
  ({
    animation : o.animation,
    duration : o.duration,
    onComplete : function()
    {
      o.consequence.take( null );
    },
  });

  return o.consequence;
}

uiShow.defaults =
{
  targetDom : null,
  consequence : null,
  value : 1,
  animation : 'fly right',
  duration : 400,
}

//

function uiIsShowed( dom )
{
  return dom.transition( 'is visible' );
}

// --
// prototype
// --

let Extension =
{

  // dom

  formationRadialSet,

  colorOnClick,

  msg,

  loadingMode,

  scrollFix,
  scrollFocus,
  scrolable,

  menuable,
  resizable,

  cornersMake,
  windowOpen,

  abilityRegister,
  abilityUnregister,
  abilityCssExport,

  copyable,
  copyableHtmlText,
  pinnable,
  subjective,

  widgable,

  tristatable,

  buttonMake,

  panelMake,
  totalPanelMake,
  shut,
  offscreenMake,
  textEditMake,

  habbitMouseClick,
  habbitKeyEnter,

  habbitDrag,
  draggable2,
  draggable,

  habitRightClick,
  habitDropFile,

  // ui

  uiPopupDefaults,
  uiInitPopups,
  uiInitDropdown,
  uiTabsInit,
  uiInitGeneric,
  uiInitSimple,

  uiShow,
  uiIsShowed,

  _domBasel5Loaded : true

};

/* _.props.extend */Object.assign( _.dom, Extension );

})();
