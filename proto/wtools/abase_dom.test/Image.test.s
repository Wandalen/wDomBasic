( function _Image_test_s_( )
{

'use strict';

if( typeof module !== 'undefined' )
{
  let _ = require( '../../node_modules/Tools' )
  require( '../abase_dom/l7/Image.js' );

  _.include( 'wTesting' );
}

let _ = _global_.wTools;

// --
// tests
// --

function imageCompare( test )
{
  /* */

  test.case = 'no difference'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 255, 255, 255, 255 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.identical( got, 0 );

  /* */

  test.case = 'half different on first channel'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 128, 255, 255, 255 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 0.125 );

  /* */

  test.case = 'half different on first two channels'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 128, 128, 255, 255 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 0.25 );

  /* */

  test.case = 'half different on first three channels'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 128, 128, 128, 255 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 0.37 );

  /* */

  test.case = 'half different on all channels'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 128, 128, 128, 128 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 0.5 );

  /* */

  test.case = '25% different'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 0, 255, 255, 255 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 0.25 );

  /* */

  test.case = '50% different'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 0, 0, 255, 255 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 0.5 );

  /* */

  test.case = '75% different'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 0, 0, 0, 255 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 0.75 );

  /* */

  test.case = 'different'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 0, 0, 0, 0 ]),
    src2 : new U8x([ 255, 255, 255, 255 ]),
    format : [ 8, 8, 8, 8 ]
  })
  test.equivalent( got, 1 );

  /* */

  test.case = 'RGB format'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 255, 255, 255 ]),
    src2 : new U8x([ 255, 255, 255 ]),
    format : [ 8, 8, 8 ]
  })
  test.equivalent( got, 0 );

  /* */

  test.case = 'single channel format'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 255 ]),
    src2 : new U8x([ 255 ]),
    format : [ 8 ]
  })
  test.equivalent( got, 0 );

  /* */

  test.case = '2 bytes'
  var got = _.dom.imageCompare
  ({
    src1 : new U32x([ 65535 ]),
    src2 : new U32x([ 65535 ]),
    format : [ 16 ]
  })
  test.equivalent( got, 0 );

  /* */

  test.case = 'difference is bigger than max value'
  var got = _.dom.imageCompare
  ({
    src1 : new U8x([ 30 ]),
    src2 : new U8x([ 0 ]),
    format : [ 4 ]
  })
  test.gt( got, 1 );

  /* */

  if( !Config.debug )
  return;

  /* */

  test.case = 'buffers have different length'
  test.shouldThrowErrorSync( () =>
  {
    _.dom.imageCompare
    ({
      src1 : new U8x([ 0, 0, 0 ]),
      src2 : new U8x([ 255, 255, 255, 255 ]),
      format : [ 8, 8, 8, 8 ]
    })
  })

  /* */

  test.case = 'wrong format'
  test.shouldThrowErrorSync( () =>
  {
    _.dom.imageCompare
    ({
      src1 : new U8x([ 0, 0, 0, 0 ]),
      src2 : new U8x([ 255, 255, 255, 0 ]),
      format : [ 8, 8, 8 ]
    })
  })
}

imageCompare.accuracy = 10e-3

//

// --
// declare
// --

let Self =
{

  name : 'Tools/abase_dom/Image',
  silencing : 1,

  tests :
  {
    imageCompare
  },

}

//

Self = wTestSuite( Self );
if( typeof module !== 'undefined' && !module.parent )
wTester.test( Self.name );

})();
