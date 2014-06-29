react-nine-patch
================
This is a small project I started to learn [React](http://facebook.github.io/react/). It uses the HTML canvas element to implement support for the [nine-patch image format](http://developer.android.com/guide/topics/graphics/2d-graphics.html#nine-patch) used in Android. 

#Features
Currently only stretching of one contiguous area in each dimension is supported. Padding specified in the nine-patch is ignored.

#Run
This project uses gulp. If you don't already have gulp, you can install it with:
```bash
npm install -g gulp
```

To run the example, clone the repo and run the following:
```bash
cd react-nine-patch
npm install
gulp
```

Then navigate to [http://localhost:3000](http://localhost:30000).
