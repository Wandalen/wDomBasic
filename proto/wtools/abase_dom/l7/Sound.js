(function _Sound_js_() {

'use strict';

const _ = _global_.wTools;
const Self = _.dom.sound = _.dom.sound || Object.create( null );
var $ = typeof jQuery !== 'undefined' ? jQuery : null;

// --
// routines
// --

function play( o )
{
  if( _.strIs( o ) )
  o = { url : o }

  _.assert( _.strIs( o.url ) );
  _.assert( arguments.length === 1, 'Expects single argument' );

  if( !_.SoundsByUrl[ o.url ] )
  _.SoundsByUrl[ o.url ] = new buzz.sound( o.url );

  var sound = _.SoundsByUrl[ o.url ];
  var result = sound.play();

}

play.defaults =
{
  url : null,
}

//

function playTry( o )
{
  if( _.strIs( o ) )
  o = { url : o }

  _.assert( arguments.length === 1, 'Expects single argument' );

  try
  {
    return play( o );
  }
  catch( err )
  {
    console.warn( 'cant paly',o.url );
  }

}

playTry.defaults =
{
}

playTry.defaults.__proto__ = play.defaults;

// --
// prototype
// --

const Routines =
{

  play : play,
  playTry : playTry,

  SoundsByUrl : {},

}

// if( _.sound )
// {
//   _.mapExtend( Self,Routines );
// }
// else
// {
//   _.sound = Proto;
//   _.sound.__proto__ = _;
// }

_.mapExtend( Self,Routines );


// const _ = _global_.wTools.sound;

})();
