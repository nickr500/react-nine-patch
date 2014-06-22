/** @jsx React.DOM */

module.exports = React.createClass({

    // Get the image specified by a URL in the 'src' property.    
    requestImage: function() {
        var img = new Image();
        img.src = this.props.src;
        img.onLoad = function() {
            this.setState({ img: this });
        };
    },

    // get the image when the component first loads
    componentWillMount: function() {
        this.requestImage();
    },

    // update the image when the src property changes
    componentWillReceiveProps: function() {
        this.requestImage();
    },

    render: function() { 
        return (
            <canvas ref="canvas"></canvas>
        );
    }
});
