( function()
{

const _ = _global_.wTools;
_.dom = _.dom || Object.create( null );
let fileTextSave;
let downloadNameSupport = 'download' in document.createElement('a');
let BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
let URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.saveBlob = navigator.saveBlob || navigator.mozSaveBlob || navigator.webkitSaveBlob || navigator.msSaveBlob;
window.saveAs = window.saveAs || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs;

let BrowserSupportedMimeTypes =
{
  'image/jpeg' : true,
  'image/png' : true,
  'image/gif' : true,
  'image/svg+xml' : true,
  'image/bmp' : true,
  'image/x-windows-bmp' : true,
  'image/webp' : true,
  'audio/wav' : true,
  'audio/mpeg' : true,
  'audio/webm' : true,
  'audio/ogg' : true,
  'video/mpeg' : true,
  'video/webm' : true,
  'video/ogg' : true,
  'text/plain' : true,
  'text/html' : true,
  'text/xml' : true,
  'application/xhtml+xml' : true,
  'application/json' : true
};

if( BlobBuilder && (window.saveAs || navigator.saveBlob) )
{

  fileTextSave = function( data, name, mimeType )
  {
    let builder = new BlobBuilder();
    builder.append(data);
    let blob = builder.getBlob( mimetype||'application/octet-stream' );
    if( !name ) name = 'download.txt';
    if( window.saveAs )
    {
      window.saveAs(blob, name);
    }
    else
    {
      navigator.saveBlob(blob, name);
    }
  };

}
else if( BlobBuilder && URL )
{

  fileTextSave = function( data, name, mimetype )
  {
    let blob, url;
    let builder = new BlobBuilder();
    builder.append( data );
    if( !mimetype )
    mimetype = 'application/octet-stream';
    if( downloadNameSupport )
    {
      blob = builder.getBlob( mimetype );
      url = URL.createObjectURL( blob );
      let link = document.createElement( 'a' );
      link.setAttribute( 'href', url );
      link.setAttribute( 'download', name || 'download.txt' );
      let event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      link.dispatchEvent(event);
    }
    else
    {
      if( BrowserSupportedMimeTypes[ mimetype.split( ';' )[ 0 ] ] === true )
      {
        mimetype = 'application/octet-stream';
      }
      blob = builder.getBlob( mimetype );
      url = URL.createObjectURL( blob );
      window.open( url, '_blank', '' );
    }
    setTimeout(function ()
    {
      URL.revokeObjectURL(url);
    }, 250);
  };

}
else if( !/\bMSIE\b/.test(navigator.userAgent) )
{

  fileTextSave = function( data, name, mimetype )
  {
    if( !mimetype )
    mimetype = 'application/octet-stream';
    if( BrowserSupportedMimeTypes[ mimetype.split( ';' )[ 0 ] ] === true )
    mimetype = 'application/octet-stream';

    window.open( 'data:' + mimetype + ',' + encodeURIComponent( data ), '_blank', '' );
  }

}

// --
//
// --

let Extension =
{

  fileTextSave,

}

/* _.props.extend */Object.assign( _.dom, Extension );

})();
