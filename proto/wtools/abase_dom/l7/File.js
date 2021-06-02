( function()
{

const _ = _global_.wTools;
_.dom = _.dom || Object.create( null );
var $ = typeof jQuery === 'undefined' ? null : jQuery;

//

//function loadDialog( name, onReady, context )
function loadDialog( options )
{
  var optionsDefault =
  {
    name : '',
    title : 'Please, select files',
    multiple : 1,
  }

  var options = options || {};

  if( _.strIs( options ) )
  options = { title : options };

  _.assert( arguments.length === 1, 'Expects single argument' );
  _.assert( _.object.isBasic( options ) );
  _.map.assertHasOnly( options, optionsDefault );
  _.props.supplement( options, optionsDefault );

  var con = new _.Consequence();

  var a = $( '<input>' )
  .css( 'display', 'none' )
  .appendTo( $('body') )
  .attr( 'type', 'file' )
  .attr( 'name', options.title )
  .attr( 'title', options.title )
  .attr( 'value', options.title )
  .change( function( event )
  {

    var t = this;
    var files = a[ 0 ].files;
    a.remove();

    var e =
    {
      title : options.title,
      name : options.name,
      files,
    };
    con.take( e );
  });

  if( options.multiple )
  a.attr( 'multiple', '' );

  var event = document.createEvent( 'MouseEvents' );
  event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null );
  a[ 0 ].dispatchEvent( event );

  return con;
}

//

function uploadFiles( files, options )
{

  if( _.object.isBasic( arguments[ 0 ] ) )
  {
    options = arguments[ 0 ];
    files = options.files;
  }

  _.map.assertHasOnly( options, uploadFiles.defaults );
  _.mapComplement( options, uploadFiles.defaults );

  var options = options || {};
  var files = options.files = files || options.files;
  if( !( files instanceof FileList ) )
  files = _.array.as( files );

  _.assert( _.strIs( options.url ) );

  var formData = new FormData();

  options.names = [];

  for( var f = 0; f < files.length; f++ )
  {

    var file = files[ f ];
    var name = file.name || file.filename || '_nameless_';
    formData.append( name, file, name );
    options.names.push( name );

  }

  if( options.fields )
  {
    for( var f in options.fields )
    {
      formData.append( f, JSON.stringify( options.fields[ f ] ) );
    }
  }

  if( options.onBegin )
  {
    options.onBegin.call( this, null, null, options );
  }

  $.ajax
  ({

    url           : options.url,
    async         : true,
    data          : formData,
    crossDomain   : !!options.crossDomain,
    processData   : false,
    cache         : false,
    contentType   : false,
    type          : 'POST',

    success       : function ( data )
    {

      /*debugger;*/
      if( options.onEnd )
      options.onEnd.call( this, null, data, options );

    },

    error         : function ( request )
    {

      /*debugger;*/
      var err = _.err( 'upload : cant upload', '( ', options.names.join( ' , ' ), ' )', request.responseText );
      _.errLog( err );
      if( options.onEnd )
      options.onEnd.call( this, err, null, options );

    },

  });

  return options;
}

uploadFiles.defaults =
{

  url : '/upload',

  crossDomain : 1,

  files : null,
  fields : null,

  onBegin : null,
  onEnd : null,

}

//

function urlSave( url, name )
{
  let a = _.dom.make({ targetDom : 'body', html : '<a></a>' });
  _.dom.css( a, 'display', 'none' );
  _.dom.append( 'body', a );

  _.dom.attr( a, 'download', name )
  _.dom.attr( a, 'title', name )
  _.dom.attr( a, 'value', name )
  _.dom.attr( a, 'src', url )
  _.dom.attr( a, 'href', url )

  var event = document.createEvent( 'MouseEvents' );
  event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null );
  a.dispatchEvent( event );
}

//

function blobSave( blob, name )
{

  //saveAs = undefined; // xxx

  if( typeof saveAs === 'undefined' )
  throw _.err( 'blobSave : saveAs is not implemented' );
  else
  return saveAs( blob, name );
  // if( typeof saveAs !== 'undefined' )
  // {
  //
  //   //if( typeof saveAs === 'undefined' ) throw 'blobSave : saveAs is not implemented';
  //   //var blob = new Blob([ "Hello, world!" ], { type: "text/plain;charset=utf-8" });
  //   return saveAs( blob, name );
  //
  // }
  // else
  // {
  //
  //   throw _.err( 'blobSave : saveAs is not implemented' );
  //
  // }

}

//

function textSave( text, name )
{

  var blob = new Blob( [ text ], { type : 'text/plain;charset=utf-8' } );
  return blobSave( blob, name );

}

// --
// proto
// --

const Extension =
{

  // load

  loadDialog,
  uploadFiles,

  // save

  urlSave,
  blobSave,
  textSave,

};

/* _.props.extend */Object.assign( _.dom, Extension );

})();
