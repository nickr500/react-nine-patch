/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({

    // Get the image specified by a URL in the 'src' property.    
    requestImage: function() {
        var img = new Image();
        img.src = this.props.src;
        console.log('src: ' + this.props.src);
        var self = this;
        img.onload = function() {
            console.log('loaded image');
            console.log(this);
            self.setState({ image: this });
        };
    },

    // get the image when the component first loads
    componentDidMount: function() {
        console.log('mounted');
        this.requestImage();
    },

    // update the image when the src property changes
    componentWillReceiveProps: function() {
        this.requestImage();
    },

    draw: function() {
        console.log('drawing');
        console.log(this.state.image);
        var canvas = this.refs.canvas.getDOMNode();
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this.state.image, 0, 0);
    },

    componentDidUpdate: function() {
        console.log('updated');
        this.draw();
    },


    render: function() { 
        console.log('render');
        return (
            <canvas ref="canvas"></canvas>
        );
    }
});
