/**
 * Project Touch
 *
 * @date: 6/18/13
 */

/*global define, window, document, $, requirejs, require  */

define([], function () {

    'use strict';

    return {
        threshold: function (pixels) {
            var threshold = 80,
                d = pixels.data;
            for (var i = 0; i < d.length; i += 4) {
                var r = d[i];
                var g = d[i + 1];
                var b = d[i + 2];
                var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
                d[i] = d[i + 1] = d[i + 2] = v
            }
            return pixels;
        },

        grayscale: function (pixels) {
            var d = pixels.data;
            for (var i = 0; i < d.length; i += 4) {
                var r = d[i];
                var g = d[i + 1];
                var b = d[i + 2];
                // CIE luminance for the RGB
                // The human eye is bad at seeing red and blue, so we de-emphasize them.
                var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                d[i] = d[i + 1] = d[i + 2] = v
            }
            return pixels;
        },

        hipster: function (pixels) {
            var rgb = {
                r: App.R,
                g: App.G,
                b: App.B
            };

            var d = pixels.data;

//            var buf = new ArrayBuffer(d.buffer);
            var buf8 = new Uint8ClampedArray(d.buffer);
            var data32 = new Uint32Array(d.buffer);

//            for (var i = 0; i < d.length; i += 4) {
////                var r = d[i];
////                var g = d[i + 1];
////                var b = d[i + 2];
////
////                d[i] = r * rgb.r;
////                d[i + 1] = g * rgb.g;
////                d[i + 2] = b * rgb.b;
//            }

            for (var y = 0; y < 360; ++y) {
                for (var x = 0; x < 720; ++x) {

//                    var test = data32[y * 720 + x].toString(2);//data32[y * 720 + x];
//console.log(d[(y * 720 + x) * 4]);
//console.log(d[(y * 720 + x) * 4 + 1]);
//console.log(d[(y * 720 + x) * 4 + 2]);
//console.log(d[(y * 720 + x) * 4 + 3]);
                    var a = ((data32[y * 720 + x] >> 24) & 0xff);
                    var b = ((data32[y * 720 + x] >> 16) & 0xff) * rgb.b;
                    var g = ((data32[y * 720 + x] >> 8) & 0xff) * rgb.g;
                    var r = ((data32[y * 720 + x] >> 0) & 0xff) * rgb.r;

                    if(r > 255) r = 255;
                    if(g > 255) g = 255;
                    if(b > 255) b = 255;

                    data32[y * 720 + x] =
                        (a   << 24) |    // alpha
                            (b << 16) |    // blue
                            (g <<  8) |    // green
                            r;            // red
                }
            }

            pixels.data.set(buf8);

            return pixels;
        },

        red: function (pixels) {
            var d = pixels.data;
            for (var i = 0; i < d.length; i += 4) {
                var r = d[i];
                var g = d[i + 1];
                var b = d[i + 2];

                d[i] = r;
                d[i + 1] = 0;
                d[i + 2] = 0;
            }
            return pixels;
        },

        green: function (pixels) {
            var d = pixels.data;
            for (var i = 0; i < d.length; i += 4) {
                var r = d[i];
                var g = d[i + 1];
                var b = d[i + 2];

                d[i] = 0;
                d[i + 1] = g;
                d[i + 2] = 0;
            }
            return pixels;
        },

        blue: function (pixels) {
            var d = pixels.data;
            for (var i = 0; i < d.length; i += 4) {
                var r = d[i];
                var g = d[i + 1];
                var b = d[i + 2];

                d[i] = 0;
                d[i + 1] = 0;
                d[i + 2] = b;
            }
            return pixels;
        },

        pixelize: function (pixels) {

            var radius = 10,
                d = pixels.data;

            // Failsafe so we don't end up in an endless loop
            if (radius == 0) {
                return pixels;
            }

            // Walk through width x height pixels.
            for (var x = 0; x < pixels.width; x += radius) {
                for (var y = 0; y < pixels.height; y += radius) {
                    var r = 0,
                        g = 0,
                        b = 0,
                        count = 0;



                    // Average our pixels and count the amount of averaged pixels
                    // We need to count them because of edge pixels
                    for (var rX = x; rX < Math.min(x + radius, pixels.width); rX++) {
                        for (var rY = y; rY < Math.min(y + radius, pixels.height); rY++) {
                            var pos = (rY * pixels.width + rX) * 4;
                            count += 1;
                            r += d[pos];
                            g += d[pos + 1];
                            b += d[pos + 2];
                        }
                    }

                    // Set the averaged colors to the pixels.
                    for (var rX = x; rX < Math.min(x + radius, pixels.width); rX++) {
                        for (var rY = y; rY < Math.min(y + radius, pixels.height); rY++) {
                            var pos = (rY * pixels.width + rX) * 4;
                            d[pos] = r / count;
                            d[pos + 1] = g / count;
                            d[pos + 2] = b / count;
                        }
                    }
                }
            }
            return pixels;
        }

    };

});
