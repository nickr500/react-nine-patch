/** @jsx React.DOM */
var React = require('react');

// Get a canvas with the given image in it
// image may be an img, video, or canvas element
function getCanvasForImage(image) {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0 , 0);
    return canvas;
}

/**
 * Reads the indicators in a 9-patch image and stores the data
 *
 * Attributes:
 * width              - height of the image in pixels
 * height             - width of the image in pixels
 * context            - a rendering context with the image data
 * getSection(x, y)   - get one of the 9 sections the image has
 *                      been divided into
 */
function NinePatchData(image) {
    this.width = image.width - 2;
    this.height = image.height - 2;
    this.canvas = getCanvasForImage(image);
    this.context = this.canvas.getContext('2d');

    // look for a contiguous segment of black pixels
    // return an object with the location and length of the segment
    // or return null if not found
    function findIndicator(data) {
        // start marks the first black pixel or
        // -1 if none has been found yet
        var start = -1;
        for (var i = 0; i < data.length; i += 4) {
            var r = data[i], g = data[i + 1], 
                b = data[i + 2], a = data[i + 3];
            var isBlack = r === 0 && g === 0 && b === 0 && a === 255;

            if (isBlack && start < 0) {
                start = i / 4;
            } else if (!isBlack && start >= 0) {
                return {
                    start: start,
                    length: (i / 4) - start
                };
            }
        }

        // we reached the end of the end of the image data but haven't
        // yet determined start and length
        if(start >= 0) {
            return {
                start: start,
                length: (data.length / 4) - start
            };
        }

        return null;
    }

    var xInd = findIndicator(this.context.getImageData(1, 0, image.width - 2, 1).data);
    var yInd = findIndicator(this.context.getImageData(0, 1, 1, image.height - 2).data);
    
    if (!xInd || !yInd) {
        throw "Not a valid 9-patch image.";
    }

    this._xPatches = [0, xInd.start, xInd.start + xInd.length, this.width];
    this.edgeLeftSize = xInd.start;
    this.edgeRightSize = this.width - (xInd.start + xInd.length);

    this._yPatches = [0, yInd.start, yInd.start + yInd.length, this.height];
    this.edgeTopSize = yInd.start;
    this.edgeBottomSize = this.height - (yInd.start + yInd.length);
}

// get the rectangle containing a section of the 9-patch
// where x and y are 0, 1, or 2
NinePatchData.prototype.getSection = function (x, y) {
    return {
        x: this._xPatches[x] + 1,
        y: this._yPatches[y] + 1,
        width:  this._xPatches[x + 1] - this._xPatches[x],
        height: this._yPatches[y + 1] - this._yPatches[y]
    };
};


module.exports = React.createClass({

    // Get the image specified by a URL in the 'src' property.    
    requestImage: function () {
        var img = new Image();
        img.src = this.props.src;
        var self = this;
        img.onload = function () {
            self.setState({ 
                ninePatch: new NinePatchData(this)
            });
        };
    },

    // get the image when the component first loads
    componentDidMount: function () {
        this.requestImage();
    },

    // update the image when the src property changes
    componentWillReceiveProps: function() {
        this.requestImage();
    },

    draw: function() {
        var canvas = this.refs.canvas.getDOMNode();
        var ctx = canvas.getContext('2d');
        ctx.webkitImageSmoothingEnabled = false;
        ctx.setStrokeColor(1, 0, 0, 1);
        var np = this.state.ninePatch;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawSect(sect, dx, dy, dw, dh) {
            ctx.drawImage(np.canvas, 
                          sect.x, sect.y, sect.width, sect.height,
                          dx, dy, dw, dh);            
        }

        var dx = 0;
        for (var x = 0; x < 3; x++) {
            var dw;

            switch(x) {
            case 0:
                dw = np.edgeLeftSize;
                break;
            case 1:
                dw = canvas.width - np.edgeLeftSize - np.edgeRightSize;
                break;
            case 2:
                dw = np.edgeRightSize;
                break;
            }

            var dy = 0;
            for (var y = 0; y < 3; y++) {
                var dh;
                switch (y) {
                case 0:
                    dh = np.edgeTopSize;
                    break;
                case 1:
                    dh = canvas.height - np.edgeTopSize - np.edgeBottomSize;
                    break;
                case 2:
                    dh = np.edgeBottomSize;
                }
                
                var sect = np.getSection(x, y);
                drawSect(sect, dx, dy, dw, dh);

                dy += dh;
            }
            dx += dw;
        }
    },

    componentDidUpdate: function() {
        if (this.state.ninePatch) {
            this.draw();
        }
    },


    render: function() { 
        return (
            <canvas ref="canvas" width={this.props.width} height={this.props.height}></canvas>
        );
    }
});
