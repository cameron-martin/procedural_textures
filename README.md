# Procedural Texture Test

This is me messing around with perlin and simplex noise. The aim was to use it as a dynamic-size background for something on a website I was making, but it is way too slow for that.

`perlin.js` is taken from [josephg/noisejs][0]. `shaders.js` contains all the interesting stuff that I made. The terminology may be wrong, but I call functions which take as input an `(x, y)` coordinate, and output a `[r, g, b, a]` array *shaders*. I call functions which take as input shaders, and output a shader *blenders*. 

There is lots of global state; everything is just hooked up to window. But I don't care, because it was just a test.

[0]: https://github.com/josephg/noisejs
