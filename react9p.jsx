/** @jsx React.DOM */
var React = require('react');
var NinePatchData = require('./NinePatchData.js');

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
        ctx.setStrokeColor(1, 0, 0, 1);
        ctx.imageSmoothingEnabled = false;
        var np = this.state.ninePatch;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawSect(sect, dx, dy, dw, dh) {
            ctx.drawImage(np.canvas, 
                          sect.x, sect.y, sect.width, sect.height,
                          dx, dy, dw, dh);            
        }

        // Get the width of a section drawn on the canvas
        function getTargetWidth(x) {
            switch(x) {
            case 0:
                return np.edgeLeftSize;
            case 1:
                return canvas.width - np.edgeLeftSize - np.edgeRightSize;
            case 2:
                return np.edgeRightSize;
            }
        }

        // Get the hieght of a section drawn on the canvas
        function getTargetHeight(y) {
            switch (y) {
            case 0:
                return np.edgeTopSize;
            case 1:
                return canvas.height - np.edgeTopSize - np.edgeBottomSize;
            case 2:
                return np.edgeBottomSize;
            }
        }

        var dx = 0;
        for (var x = 0; x < 3; x++) {
            var dw = getTargetWidth(x);
            var dy = 0;
            for (var y = 0; y < 3; y++) {
                var dh = getTargetHeight(y);
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
