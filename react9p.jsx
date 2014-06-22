/** @jsx React.DOM */

module.exports = React.createClass({

    // Get the image specified by a URL in the 'src' property.    
    requestImage: function() {
        var img = new Image();
        img.src = this.props.src;
        img.onLoad = function() {
            this.setState({ image: this });
        };
    },

    // get the image when the component first loads
    componentDidMount: function() {
        this.requestImage();
    },

    // update the image when the src property changes
    componentWillReceiveProps: function() {
        this.requestImage();
    },

    draw: function() {
        var canvas = this.refs.canvas.getDomNode();
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this.state.image);
    },

    componentDidUpdate: function() {
        this.draw();
    },

    render: function() { 
        return (
            <canvas ref="canvas"></canvas>
        );
    }
});
