function getOrientation(imgDataURL) {
  var byteString = atob(imgDataURL.split(',')[1]);
  var orientaion = byteStringToOrientation(byteString);
  return orientaion;

  function byteStringToOrientation(img) {
    var head = 0;
    var orientation;
    while (1) {
      if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 218) {
        break;
      }
      if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 216) {
        head += 2;
      } else {
        var length = img.charCodeAt(head + 2) * 256 + img.charCodeAt(head + 3);
        var endPoint = head + length + 2;
        if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 225) {
          var segment = img.slice(head, endPoint);
          var bigEndian = segment.charCodeAt(10) == 77;
          var count;
          if (bigEndian) {
            count = segment.charCodeAt(18) * 256 + segment.charCodeAt(19);
          } else {
            count = segment.charCodeAt(18) + segment.charCodeAt(19) * 256;
          }
          for (i = 0; i < count; i++) {
            var field = segment.slice(20 + 12 * i, 32 + 12 * i);
            if ((bigEndian && field.charCodeAt(1) == 18) || (!bigEndian && field.charCodeAt(0) == 18)) {
              orientation = bigEndian ? field.charCodeAt(9) : field.charCodeAt(8);
            }
          }
          break;
        }
        head = endPoint;
      }
      if (head > img.length) {
        break;
      }
    }
    return orientation;
  }
}

var createObjectURL = (window.URL && window.URL.createObjectURL) ? function (file) {
  return window.URL.createObjectURL(file);
} : (window.webkitURL && window.webkitURL.createObjectURL) ? function (file) {
  return window.webkitURL.createObjectURL(file);
} : undefined;


//Based on MinifyJpeg
//http://elicon.blog57.fc2.com/blog-entry-206.html

var ExifRestorer = (function () {

  var ExifRestorer = {};

  ExifRestorer.KEY_STR = "ABCDEFGHIJKLMNOP" +
    "QRSTUVWXYZabcdef" +
    "ghijklmnopqrstuv" +
    "wxyz0123456789+/" +
    "=";

  ExifRestorer.encode64 = function (input) {
    var output = "",
      chr1, chr2, chr3 = "",
      enc1, enc2, enc3, enc4 = "",
      i = 0;

    do {
      chr1 = input[i++];
      chr2 = input[i++];
      chr3 = input[i++];

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
        this.KEY_STR.charAt(enc1) +
        this.KEY_STR.charAt(enc2) +
        this.KEY_STR.charAt(enc3) +
        this.KEY_STR.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
  };

  ExifRestorer.restore = function (origFileBase64, resizedFileBase64) {
    if (!origFileBase64.match("data:image/jpeg;base64,")) {
      return resizedFileBase64;
    }

    var rawImage = this.decode64(origFileBase64.replace("data:image/jpeg;base64,", ""));
    var segments = this.slice2Segments(rawImage);

    var image = this.exifManipulation(resizedFileBase64, segments);

    return this.encode64(image);

  };


  ExifRestorer.exifManipulation = function (resizedFileBase64, segments) {
    var exifArray = this.getExifArray(segments),
      newImageArray = this.insertExif(resizedFileBase64, exifArray),
      aBuffer = new Uint8Array(newImageArray);

    return aBuffer;
  };


  ExifRestorer.getExifArray = function (segments) {
    var seg;
    for (var x = 0; x < segments.length; x++) {
      seg = segments[x];
      if (seg[0] == 255 & seg[1] == 225) //(ff e1)
      {
        return seg;
      }
    }
    return [];
  };


  ExifRestorer.insertExif = function (resizedFileBase64, exifArray) {
    var imageData = resizedFileBase64.replace("data:image/jpeg;base64,", ""),
      buf = this.decode64(imageData),
      separatePoint = buf.indexOf(255, 3),
      mae = buf.slice(0, separatePoint),
      ato = buf.slice(separatePoint),
      array = mae;

    array = array.concat(exifArray);
    array = array.concat(ato);
    return array;
  };


  ExifRestorer.slice2Segments = function (rawImageArray) {
    var head = 0,
      segments = [];

    while (1) {
      if (rawImageArray[head] == 255 & rawImageArray[head + 1] == 218) {
        break;
      }
      if (rawImageArray[head] == 255 & rawImageArray[head + 1] == 216) {
        head += 2;
      } else {
        var length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3],
          endPoint = head + length + 2,
          seg = rawImageArray.slice(head, endPoint);
        segments.push(seg);
        head = endPoint;
      }
      if (head > rawImageArray.length) {
        break;
      }
    }

    return segments;
  };


  ExifRestorer.decode64 = function (input) {
    var output = "",
      chr1, chr2, chr3 = "",
      enc1, enc2, enc3, enc4 = "",
      i = 0,
      buf = [];

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
      alert("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
      enc1 = this.KEY_STR.indexOf(input.charAt(i++));
      enc2 = this.KEY_STR.indexOf(input.charAt(i++));
      enc3 = this.KEY_STR.indexOf(input.charAt(i++));
      enc4 = this.KEY_STR.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      buf.push(chr1);

      if (enc3 != 64) {
        buf.push(chr2);
      }
      if (enc4 != 64) {
        buf.push(chr3);
      }

      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";

    } while (i < input.length);

    return buf;
  };


  return ExifRestorer;
})();

(function () {

  var debug = false;

  var root = this;

  var EXIF = function (obj) {
    if (obj instanceof EXIF) return obj;
    if (!(this instanceof EXIF)) return new EXIF(obj);
    this.EXIFwrapped = obj;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = EXIF;
    }
    exports.EXIF = EXIF;
  } else {
    root.EXIF = EXIF;
  }

  var ExifTags = EXIF.Tags = {

    // version tags
    0x9000: "ExifVersion",             // EXIF version
    0xA000: "FlashpixVersion",         // Flashpix format version

    // colorspace tags
    0xA001: "ColorSpace",              // Color space information tag

    // image configuration
    0xA002: "PixelXDimension",         // Valid width of meaningful image
    0xA003: "PixelYDimension",         // Valid height of meaningful image
    0x9101: "ComponentsConfiguration", // Information about channels
    0x9102: "CompressedBitsPerPixel",  // Compressed bits per pixel

    // user information
    0x927C: "MakerNote",               // Any desired information written by the manufacturer
    0x9286: "UserComment",             // Comments by user

    // related file
    0xA004: "RelatedSoundFile",        // Name of related sound file

    // date and time
    0x9003: "DateTimeOriginal",        // Date and time when the original image was generated
    0x9004: "DateTimeDigitized",       // Date and time when the image was stored digitally
    0x9290: "SubsecTime",              // Fractions of seconds for DateTime
    0x9291: "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
    0x9292: "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

    // picture-taking conditions
    0x829A: "ExposureTime",            // Exposure time (in seconds)
    0x829D: "FNumber",                 // F number
    0x8822: "ExposureProgram",         // Exposure program
    0x8824: "SpectralSensitivity",     // Spectral sensitivity
    0x8827: "ISOSpeedRatings",         // ISO speed rating
    0x8828: "OECF",                    // Optoelectric conversion factor
    0x9201: "ShutterSpeedValue",       // Shutter speed
    0x9202: "ApertureValue",           // Lens aperture
    0x9203: "BrightnessValue",         // Value of brightness
    0x9204: "ExposureBias",            // Exposure bias
    0x9205: "MaxApertureValue",        // Smallest F number of lens
    0x9206: "SubjectDistance",         // Distance to subject in meters
    0x9207: "MeteringMode",            // Metering mode
    0x9208: "LightSource",             // Kind of light source
    0x9209: "Flash",                   // Flash status
    0x9214: "SubjectArea",             // Location and area of main subject
    0x920A: "FocalLength",             // Focal length of the lens in mm
    0xA20B: "FlashEnergy",             // Strobe energy in BCPS
    0xA20C: "SpatialFrequencyResponse",    //
    0xA20E: "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
    0xA20F: "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
    0xA210: "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
    0xA214: "SubjectLocation",         // Location of subject in image
    0xA215: "ExposureIndex",           // Exposure index selected on camera
    0xA217: "SensingMethod",           // Image sensor type
    0xA300: "FileSource",              // Image source (3 == DSC)
    0xA301: "SceneType",               // Scene type (1 == directly photographed)
    0xA302: "CFAPattern",              // Color filter array geometric pattern
    0xA401: "CustomRendered",          // Special processing
    0xA402: "ExposureMode",            // Exposure mode
    0xA403: "WhiteBalance",            // 1 = auto white balance, 2 = manual
    0xA404: "DigitalZoomRation",       // Digital zoom ratio
    0xA405: "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
    0xA406: "SceneCaptureType",        // Type of scene
    0xA407: "GainControl",             // Degree of overall image gain adjustment
    0xA408: "Contrast",                // Direction of contrast processing applied by camera
    0xA409: "Saturation",              // Direction of saturation processing applied by camera
    0xA40A: "Sharpness",               // Direction of sharpness processing applied by camera
    0xA40B: "DeviceSettingDescription",    //
    0xA40C: "SubjectDistanceRange",    // Distance to subject

    // other tags
    0xA005: "InteroperabilityIFDPointer",
    0xA420: "ImageUniqueID"            // Identifier assigned uniquely to each image
  };

  var TiffTags = EXIF.TiffTags = {
    0x0100: "ImageWidth",
    0x0101: "ImageHeight",
    0x8769: "ExifIFDPointer",
    0x8825: "GPSInfoIFDPointer",
    0xA005: "InteroperabilityIFDPointer",
    0x0102: "BitsPerSample",
    0x0103: "Compression",
    0x0106: "PhotometricInterpretation",
    0x0112: "Orientation",
    0x0115: "SamplesPerPixel",
    0x011C: "PlanarConfiguration",
    0x0212: "YCbCrSubSampling",
    0x0213: "YCbCrPositioning",
    0x011A: "XResolution",
    0x011B: "YResolution",
    0x0128: "ResolutionUnit",
    0x0111: "StripOffsets",
    0x0116: "RowsPerStrip",
    0x0117: "StripByteCounts",
    0x0201: "JPEGInterchangeFormat",
    0x0202: "JPEGInterchangeFormatLength",
    0x012D: "TransferFunction",
    0x013E: "WhitePoint",
    0x013F: "PrimaryChromaticities",
    0x0211: "YCbCrCoefficients",
    0x0214: "ReferenceBlackWhite",
    0x0132: "DateTime",
    0x010E: "ImageDescription",
    0x010F: "Make",
    0x0110: "Model",
    0x0131: "Software",
    0x013B: "Artist",
    0x8298: "Copyright"
  };

  var GPSTags = EXIF.GPSTags = {
    0x0000: "GPSVersionID",
    0x0001: "GPSLatitudeRef",
    0x0002: "GPSLatitude",
    0x0003: "GPSLongitudeRef",
    0x0004: "GPSLongitude",
    0x0005: "GPSAltitudeRef",
    0x0006: "GPSAltitude",
    0x0007: "GPSTimeStamp",
    0x0008: "GPSSatellites",
    0x0009: "GPSStatus",
    0x000A: "GPSMeasureMode",
    0x000B: "GPSDOP",
    0x000C: "GPSSpeedRef",
    0x000D: "GPSSpeed",
    0x000E: "GPSTrackRef",
    0x000F: "GPSTrack",
    0x0010: "GPSImgDirectionRef",
    0x0011: "GPSImgDirection",
    0x0012: "GPSMapDatum",
    0x0013: "GPSDestLatitudeRef",
    0x0014: "GPSDestLatitude",
    0x0015: "GPSDestLongitudeRef",
    0x0016: "GPSDestLongitude",
    0x0017: "GPSDestBearingRef",
    0x0018: "GPSDestBearing",
    0x0019: "GPSDestDistanceRef",
    0x001A: "GPSDestDistance",
    0x001B: "GPSProcessingMethod",
    0x001C: "GPSAreaInformation",
    0x001D: "GPSDateStamp",
    0x001E: "GPSDifferential"
  };

  var StringValues = EXIF.StringValues = {
    ExposureProgram: {
      0: "Not defined",
      1: "Manual",
      2: "Normal program",
      3: "Aperture priority",
      4: "Shutter priority",
      5: "Creative program",
      6: "Action program",
      7: "Portrait mode",
      8: "Landscape mode"
    },
    MeteringMode: {
      0: "Unknown",
      1: "Average",
      2: "CenterWeightedAverage",
      3: "Spot",
      4: "MultiSpot",
      5: "Pattern",
      6: "Partial",
      255: "Other"
    },
    LightSource: {
      0: "Unknown",
      1: "Daylight",
      2: "Fluorescent",
      3: "Tungsten (incandescent light)",
      4: "Flash",
      9: "Fine weather",
      10: "Cloudy weather",
      11: "Shade",
      12: "Daylight fluorescent (D 5700 - 7100K)",
      13: "Day white fluorescent (N 4600 - 5400K)",
      14: "Cool white fluorescent (W 3900 - 4500K)",
      15: "White fluorescent (WW 3200 - 3700K)",
      17: "Standard light A",
      18: "Standard light B",
      19: "Standard light C",
      20: "D55",
      21: "D65",
      22: "D75",
      23: "D50",
      24: "ISO studio tungsten",
      255: "Other"
    },
    Flash: {
      0x0000: "Flash did not fire",
      0x0001: "Flash fired",
      0x0005: "Strobe return light not detected",
      0x0007: "Strobe return light detected",
      0x0009: "Flash fired, compulsory flash mode",
      0x000D: "Flash fired, compulsory flash mode, return light not detected",
      0x000F: "Flash fired, compulsory flash mode, return light detected",
      0x0010: "Flash did not fire, compulsory flash mode",
      0x0018: "Flash did not fire, auto mode",
      0x0019: "Flash fired, auto mode",
      0x001D: "Flash fired, auto mode, return light not detected",
      0x001F: "Flash fired, auto mode, return light detected",
      0x0020: "No flash function",
      0x0041: "Flash fired, red-eye reduction mode",
      0x0045: "Flash fired, red-eye reduction mode, return light not detected",
      0x0047: "Flash fired, red-eye reduction mode, return light detected",
      0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
      0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
      0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
      0x0059: "Flash fired, auto mode, red-eye reduction mode",
      0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
      0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
    },
    SensingMethod: {
      1: "Not defined",
      2: "One-chip color area sensor",
      3: "Two-chip color area sensor",
      4: "Three-chip color area sensor",
      5: "Color sequential area sensor",
      7: "Trilinear sensor",
      8: "Color sequential linear sensor"
    },
    SceneCaptureType: {
      0: "Standard",
      1: "Landscape",
      2: "Portrait",
      3: "Night scene"
    },
    SceneType: {
      1: "Directly photographed"
    },
    CustomRendered: {
      0: "Normal process",
      1: "Custom process"
    },
    WhiteBalance: {
      0: "Auto white balance",
      1: "Manual white balance"
    },
    GainControl: {
      0: "None",
      1: "Low gain up",
      2: "High gain up",
      3: "Low gain down",
      4: "High gain down"
    },
    Contrast: {
      0: "Normal",
      1: "Soft",
      2: "Hard"
    },
    Saturation: {
      0: "Normal",
      1: "Low saturation",
      2: "High saturation"
    },
    Sharpness: {
      0: "Normal",
      1: "Soft",
      2: "Hard"
    },
    SubjectDistanceRange: {
      0: "Unknown",
      1: "Macro",
      2: "Close view",
      3: "Distant view"
    },
    FileSource: {
      3: "DSC"
    },

    Components: {
      0: "",
      1: "Y",
      2: "Cb",
      3: "Cr",
      4: "R",
      5: "G",
      6: "B"
    }
  };

  function addEvent(element, event, handler) {
    if (element.addEventListener) {
      element.addEventListener(event, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + event, handler);
    }
  }

  function imageHasData(img) {
    return !!(img.exifdata);
  }


  function base64ToArrayBuffer(base64, contentType) {
    contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
    base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
    var binary = atob(base64);
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return buffer;
  }

  function objectURLToBlob(url, callback) {
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.responseType = "blob";
    http.onload = function (e) {
      if (this.status == 200 || this.status === 0) {
        callback(this.response);
      }
    };
    http.send();
  }

  function getImageData(img, callback) {
    function handleBinaryFile(binFile) {
      var data = findEXIFinJPEG(binFile);
      var iptcdata = findIPTCinJPEG(binFile);
      img.exifdata = data || {};
      img.iptcdata = iptcdata || {};
      if (callback) {
        callback.call(img);
      }
    }

    if (img.src) {
      if (/^data\:/i.test(img.src)) { // Data URI
        var arrayBuffer = base64ToArrayBuffer(img.src);
        handleBinaryFile(arrayBuffer);

      } else if (/^blob\:/i.test(img.src)) { // Object URL
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
          handleBinaryFile(e.target.result);
        };
        objectURLToBlob(img.src, function (blob) {
          fileReader.readAsArrayBuffer(blob);
        });
      } else {
        var http = new XMLHttpRequest();
        http.onload = function () {
          if (this.status == 200 || this.status === 0) {
            handleBinaryFile(http.response);
          } else {
            throw "Could not load image";
          }
          http = null;
        };
        http.open("GET", img.src, true);
        http.responseType = "arraybuffer";
        http.send(null);
      }
    } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        if (debug) console.log("Got file of length " + e.target.result.byteLength);
        handleBinaryFile(e.target.result);
      };

      fileReader.readAsArrayBuffer(img);
    }
  }

  function findEXIFinJPEG(file) {
    var dataView = new DataView(file);

    if (debug) console.log("Got file of length " + file.byteLength);
    if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
      if (debug) console.log("Not a valid JPEG");
      return false; // not a valid jpeg
    }

    var offset = 2,
      length = file.byteLength,
      marker;

    while (offset < length) {
      if (dataView.getUint8(offset) != 0xFF) {
        if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
        return false; // not a valid marker, something is wrong
      }

      marker = dataView.getUint8(offset + 1);
      if (debug) console.log(marker);

      // we could implement handling for other markers here,
      // but we're only looking for 0xFFE1 for EXIF data

      if (marker == 225) {
        if (debug) console.log("Found 0xFFE1 marker");

        return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

        // offset += 2 + file.getShortAt(offset+2, true);

      } else {
        offset += 2 + dataView.getUint16(offset + 2);
      }

    }

  }

  function findIPTCinJPEG(file) {
    var dataView = new DataView(file);

    if (debug) console.log("Got file of length " + file.byteLength);
    if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
      if (debug) console.log("Not a valid JPEG");
      return false; // not a valid jpeg
    }

    var offset = 2,
      length = file.byteLength;


    var isFieldSegmentStart = function (dataView, offset) {
      return (
        dataView.getUint8(offset) === 0x38 &&
        dataView.getUint8(offset + 1) === 0x42 &&
        dataView.getUint8(offset + 2) === 0x49 &&
        dataView.getUint8(offset + 3) === 0x4D &&
        dataView.getUint8(offset + 4) === 0x04 &&
        dataView.getUint8(offset + 5) === 0x04
      );
    };

    while (offset < length) {

      if (isFieldSegmentStart(dataView, offset)) {

        // Get the length of the name header (which is padded to an even number of bytes)
        var nameHeaderLength = dataView.getUint8(offset + 7);
        if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
        // Check for pre photoshop 6 format
        if (nameHeaderLength === 0) {
          // Always 4
          nameHeaderLength = 4;
        }

        var startOffset = offset + 8 + nameHeaderLength;
        var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

        return readIPTCData(file, startOffset, sectionLength);

        break;

      }


      // Not the marker, continue searching
      offset++;

    }

  }

  var IptcFieldMap = {
    0x78: 'caption',
    0x6E: 'credit',
    0x19: 'keywords',
    0x37: 'dateCreated',
    0x50: 'byline',
    0x55: 'bylineTitle',
    0x7A: 'captionWriter',
    0x69: 'headline',
    0x74: 'copyright',
    0x0F: 'category'
  };

  function readIPTCData(file, startOffset, sectionLength) {
    var dataView = new DataView(file);
    var data = {};
    var fieldValue, fieldName, dataSize, segmentType, segmentSize;
    var segmentStartPos = startOffset;
    while (segmentStartPos < startOffset + sectionLength) {
      if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
        segmentType = dataView.getUint8(segmentStartPos + 2);
        if (segmentType in IptcFieldMap) {
          dataSize = dataView.getInt16(segmentStartPos + 3);
          segmentSize = dataSize + 5;
          fieldName = IptcFieldMap[segmentType];
          fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
          // Check if we already stored a value with this name
          if (data.hasOwnProperty(fieldName)) {
            // Value already stored with this name, create multivalue field
            if (data[fieldName] instanceof Array) {
              data[fieldName].push(fieldValue);
            } else {
              data[fieldName] = [data[fieldName], fieldValue];
            }
          } else {
            data[fieldName] = fieldValue;
          }
        }

      }
      segmentStartPos++;
    }
    return data;
  }


  function readTags(file, tiffStart, dirStart, strings, bigEnd) {
    var entries = file.getUint16(dirStart, !bigEnd),
      tags = {},
      entryOffset, tag,
      i;

    for (i = 0; i < entries; i++) {
      entryOffset = dirStart + i * 12 + 2;
      tag = strings[file.getUint16(entryOffset, !bigEnd)];
      if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
      tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
    }
    return tags;
  }


  function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
    var type = file.getUint16(entryOffset + 2, !bigEnd),
      numValues = file.getUint32(entryOffset + 4, !bigEnd),
      valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
      offset,
      vals, val, n,
      numerator, denominator;

    switch (type) {
      case 1: // byte, 8-bit unsigned int
      case 7: // undefined, 8-bit byte, value depending on field
        if (numValues == 1) {
          return file.getUint8(entryOffset + 8, !bigEnd);
        } else {
          offset = numValues > 4 ? valueOffset : (entryOffset + 8);
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint8(offset + n);
          }
          return vals;
        }

      case 2: // ascii, 8-bit byte
        offset = numValues > 4 ? valueOffset : (entryOffset + 8);
        return getStringFromDB(file, offset, numValues - 1);

      case 3: // short, 16 bit int
        if (numValues == 1) {
          return file.getUint16(entryOffset + 8, !bigEnd);
        } else {
          offset = numValues > 2 ? valueOffset : (entryOffset + 8);
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
          }
          return vals;
        }

      case 4: // long, 32 bit int
        if (numValues == 1) {
          return file.getUint32(entryOffset + 8, !bigEnd);
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
          }
          return vals;
        }

      case 5:    // rational = two long values, first is numerator, second is denominator
        if (numValues == 1) {
          numerator = file.getUint32(valueOffset, !bigEnd);
          denominator = file.getUint32(valueOffset + 4, !bigEnd);
          val = new Number(numerator / denominator);
          val.numerator = numerator;
          val.denominator = denominator;
          return val;
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
            denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
            vals[n] = new Number(numerator / denominator);
            vals[n].numerator = numerator;
            vals[n].denominator = denominator;
          }
          return vals;
        }

      case 9: // slong, 32 bit signed int
        if (numValues == 1) {
          return file.getInt32(entryOffset + 8, !bigEnd);
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
          }
          return vals;
        }

      case 10: // signed rational, two slongs, first is numerator, second is denominator
        if (numValues == 1) {
          return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
        } else {
          vals = [];
          for (n = 0; n < numValues; n++) {
            vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
          }
          return vals;
        }
    }
  }

  function getStringFromDB(buffer, start, length) {
    var outstr = "";
    for (n = start; n < start + length; n++) {
      outstr += String.fromCharCode(buffer.getUint8(n));
    }
    return outstr;
  }

  function readEXIFData(file, start) {
    if (getStringFromDB(file, start, 4) != "Exif") {
      if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
      return false;
    }

    var bigEnd,
      tags, tag,
      exifData, gpsData,
      tiffOffset = start + 6;

    // test for TIFF validity and endianness
    if (file.getUint16(tiffOffset) == 0x4949) {
      bigEnd = false;
    } else if (file.getUint16(tiffOffset) == 0x4D4D) {
      bigEnd = true;
    } else {
      if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
      return false;
    }

    if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
      if (debug) console.log("Not valid TIFF data! (no 0x002A)");
      return false;
    }

    var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

    if (firstIFDOffset < 0x00000008) {
      if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
      return false;
    }

    tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

    if (tags.ExifIFDPointer) {
      exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
      for (tag in exifData) {
        switch (tag) {
          case "LightSource" :
          case "Flash" :
          case "MeteringMode" :
          case "ExposureProgram" :
          case "SensingMethod" :
          case "SceneCaptureType" :
          case "SceneType" :
          case "CustomRendered" :
          case "WhiteBalance" :
          case "GainControl" :
          case "Contrast" :
          case "Saturation" :
          case "Sharpness" :
          case "SubjectDistanceRange" :
          case "FileSource" :
            exifData[tag] = StringValues[tag][exifData[tag]];
            break;

          case "ExifVersion" :
          case "FlashpixVersion" :
            exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
            break;

          case "ComponentsConfiguration" :
            exifData[tag] =
              StringValues.Components[exifData[tag][0]] +
              StringValues.Components[exifData[tag][1]] +
              StringValues.Components[exifData[tag][2]] +
              StringValues.Components[exifData[tag][3]];
            break;
        }
        tags[tag] = exifData[tag];
      }
    }

    if (tags.GPSInfoIFDPointer) {
      gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
      for (tag in gpsData) {
        switch (tag) {
          case "GPSVersionID" :
            gpsData[tag] = gpsData[tag][0] +
              "." + gpsData[tag][1] +
              "." + gpsData[tag][2] +
              "." + gpsData[tag][3];
            break;
        }
        tags[tag] = gpsData[tag];
      }
    }

    return tags;
  }

  EXIF.getData = function (img, callback) {
    if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

    if (!imageHasData(img)) {
      getImageData(img, callback);
    } else {
      if (callback) {
        callback.call(img);
      }
    }
    return true;
  }

  EXIF.getTag = function (img, tag) {
    if (!imageHasData(img)) return;
    return img.exifdata[tag];
  }

  EXIF.getAllTags = function (img) {
    if (!imageHasData(img)) return {};
    var a,
      data = img.exifdata,
      tags = {};
    for (a in data) {
      if (data.hasOwnProperty(a)) {
        tags[a] = data[a];
      }
    }
    return tags;
  }

  EXIF.pretty = function (img) {
    if (!imageHasData(img)) return "";
    var a,
      data = img.exifdata,
      strPretty = "";
    for (a in data) {
      if (data.hasOwnProperty(a)) {
        if (typeof data[a] == "object") {
          if (data[a] instanceof Number) {
            strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
          } else {
            strPretty += a + " : [" + data[a].length + " values]\r\n";
          }
        } else {
          strPretty += a + " : " + data[a] + "\r\n";
        }
      }
    }
    return strPretty;
  }

  EXIF.readFromBinaryFile = function (file) {
    return findEXIFinJPEG(file);
  }

  if (typeof define === 'function' && define.amd) {
    define('exif-js', [], function () {
      return EXIF;
    });
  }
}.call(this));

function rotate(img) {
  var exif = img.exifdata.Orientation
  var raw_width = img.width;
  var raw_height = img.height;
  var canvas = document.createElement('canvas');
  canvas.width = raw_width / 2;
  canvas.height = raw_height / 2;
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.translate(canvas.width / 2, canvas.height / 2);
  switch (exif) {
    case 1:
      break;
    case 2: // vertical flip
      ctx.scale(-1, 1);
      break;
    case 3: // 180 rotate left
      ctx.rotate(Math.PI);
      break;
    case 4: // horizontal flip
      ctx.scale(1, -1);
      break;
    case 5: // vertical flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6: // 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      break;
    case 7: // horizontal flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(-1, 1);
      break;
    case 8: // 90 rotate left
      ctx.rotate(-0.5 * Math.PI);
      break;
    default:
      break;
  }
  var dx = -canvas.width / 2;
  var dy = -canvas.height / 2;
  var dw = canvas.width;
  var dh = canvas.height;
  var sx = Math.max((raw_width - raw_height) / 2, 0);
  var sy = Math.max((raw_height - raw_width) / 2, 0);
  var sw = Math.min(raw_height, raw_width);
  var sh = Math.min(raw_height, raw_width);
  //ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.drawImage(img, dx, dy, dw, dh)

  var url = canvas.toDataURL('image/jpeg');
  ctx = null;
  canvas = null;
  return url;
}

var PhotoFileReader = function (file, index, onload) {

  this.file = file;
  this.fileReader = new FileReader();
  this.index = index;
  var t = this;
  this.fileReader.onload = function () {
    onload(t);
  };

  this.readAsDataURL = function () {
    this.fileReader.readAsDataURL(this.file);

  }
};


var showSelectImage = function (target, previewElement) {
  var file = target.files[0];
  if (file.type.match('image.*')) {
    var photoFileReader = new PhotoFileReader(file, 0, function (reader) {
      var imgContainer = $('<img>');
      var targetFile = reader.file;
      var url = createObjectURL ? createObjectURL(targetFile) : this.fileReder.result;
      var img = new Image();
      img.onload = function () {
        EXIF.getData(img, function () {
          var url = rotate(img);
          imgContainer.attr('src', url);
          imgContainer.addClass('img-fluid');
          img = null;
          $(previewElement).html('').append(imgContainer);
        });
      };
      img.src = url;
    });
  }
  photoFileReader.readAsDataURL();
}

function getImageFileType(arrayBuffer) {
  var ba = new Uint8Array(arrayBuffer);
  var headerStr = "";
  var headerHex = "";
  for (var i = 0; i < 10; i++) {
    headerHex += ba[i].toString(16);
    headerStr += String.fromCharCode(ba[i]);
  }
  var fileType = null;
  if (headerHex.indexOf('ffd8') != -1) {
    fileType = 'JPG';
  }
  else if (headerStr.indexOf('PNG') != -1) {
    fileType = 'PNG';
  }
  return fileType;
}