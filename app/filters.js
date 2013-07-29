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
            var ar = App.R,
                ag = App.G,
                ab = App.B,
                data32 = new Uint32Array(pixels.data.buffer), // use Uint32Array directly for faster manipulation
                ii,
                tt = data32.length,
                b,
                g,
                r;

            for (ii = 0; ii < tt; ii+=1) {
                b = ((data32[ii] >> 16) & 0xff) * App.B;
                g = ((data32[ii] >> 8) & 0xff) * App.G;
                r = ((data32[ii] >> 0) & 0xff) * App.R;

                data32[ii] = (255 << 24) | ((b > 255 ? 255 : b) << 16) | ((g > 255 ? 255 : g) << 8) | (r > 255 ? 255 : r);
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
