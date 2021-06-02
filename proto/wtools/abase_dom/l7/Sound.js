( function _Sound_js_()
{

'use strict';

const _ = _global_.wTools;
_.dom.sound = _.dom.sound || Object.create( null );
var $ = typeof jQuery === 'undefined' ? null : jQuery;

// --
// implementation
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
    console.warn( 'cant paly', o.url );
  }

}

playTry.defaults =
{
};

// playTry.defaults.__proto__ = play.defaults; /* qqq : for Dmytro : investigate */

// --
// prototype
// --

const Extension =
{

  play,
  playTry,

  SoundsByUrl : {},

}

// if( _.sound )
// {
//   /* _.props.extend */Object.assign( _.sound,Proto );
// }
// else
// {
//   _.sound = Proto;
//   _.sound.__proto__ = _;
// }

/* _.props.extend */Object.assign( _.dom.sound, Extension );

// const _ = _global_.wTools.sound;

})();
