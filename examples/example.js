/** @jsx React.DOM */

var React = require('react');
var NinePatch = require('./dist/react9p');

React.renderComponent((<NinePatch src="test.9.png" width={800} height={600} />), 
                      document.getElementById('content'));

