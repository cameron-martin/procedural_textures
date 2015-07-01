# Procedural Texture Test

This is me messing around with [perlin][perlin] and [simplex noise][simplex]. The aim was to use it as a dynamic-size background for something on a website I was making, but it is way too slow for that.

`perlin.js` is taken from [josephg/noisejs][noisejs]. `shaders.js` contains all the interesting stuff that I made. The terminology may be wrong, but I call functions which take as input an `(x, y)` coordinate, and output a `[r, g, b, a]` array *shaders*. I call functions which take as input shaders, and output a shader *blenders*. 

There is lots of global state; everything is just hooked up to window. But I don't care, because it was just a test.

[noisejs]: https://github.com/josephg/noisejs
[perlin]: https://en.wikipedia.org/wiki/Perlin_noise
[simplex]: https://en.wikipedia.org/wiki/Simplex_noise
