(function() {

  /* These shaders return a [r, g, b, a] */
  /* If faster performance is required, this can be encoded into a single integer */
  
  function packColour(r, g, b, a) {
    return (r<<24|g<<16|b<<8|a);
  }
  
  //function unpackColour
  
  window.shaders = {
    simplex: function (size) {
      return function(x, y) {
        var value = noise.simplex2(x/size, y/size);
        value = (value+1)*128;
        
        return [value, value, value, 255];
      };
    },
    
    perlin: function(size) {
      return function(x, y) {
        var value = noise.perlin2(x/size, y/size);
        value = (value+1)*128;
        
        return [value, value, value, 255];
      }
    },
    
    constant: function(colour) {
      return function(x, y) {
        return colour;
      };
    },
    
    grain: function(density) {
      return function(x, y) {
        return [255, 255, 255, Math.random()*255];
      };
    }
  };
  
  // Blenders are functions that return shaders which combine shaders.
  window.blenders = {};
  
  
  window.blenders.pixelWise = function(combine) {
    return function(shaders) { // Blender
      return function(x, y) { // Shader
        
        // Evaluate the shaders for the pixel
        var pixels = [];
        for(var i = 0, length = shaders.length; i < length; i++) {
          pixels.push(shaders[i](x, y));
        }
        
        // Combine the pixels
        return combine(pixels);
      }
    }
  };
  
  // transform is a function which takes 2-n components and combines them into 1 component
  window.blenders.componentWise = function(combine) {
    return window.blenders.pixelWise(function(pixels) {
      var length = pixels.length;
      
      // Transform each component
      var components, result = [];
      for(var i=0; i <= 3; i++) {
        components = [];
        for(var j=0; j < length; j++) {
          components.push(pixels[j][i]);
        }
        result[i] = combine(components);
      }
      
      return result;
      
    });
  };
  
  window.blenders.average = window.blenders.componentWise(function(components) {
    var sum = 0;
    for(var i = 0, length = components.length; i < length; i++) {
      sum += components[i];
    }
    return sum / length;
  });
  
  window.blenders.additive = window.blenders.componentWise(function(components) {
    var sum = 0;
    for(var i = 0, length = components.length; i < length; i++) {
      sum += components[i];
    }
    return Math.min(255, sum)
  });
  
  window.blenders.multiply = window.blenders.componentWise(function(components) {
    return (components[0]*components[1])/255;
  });
  
  window.blenders.screen = window.blenders.componentWise(function(components) {
    return 255 - ((255-components[0])*(255-components[1]))/255;
  });
  
  // At the moment, this only blends 2 layers
  window.blenders.layer = window.blenders.pixelWise(function(pixels) {
    
    var fg = pixels[0],
        bg = pixels[1];
    
    // Performance optimisation
    if(fg[3] === 0) {
      return bg;
    }
    
    var nfg = [fg[0]/255, fg[1]/255, fg[2]/255, fg[3]/255],
        nbg = [bg[0]/255, bg[1]/255, bg[2]/255, bg[3]/255];
    
    var out_alpha = nfg[3] + nbg[3] * (1 - nfg[3]);
    if(out_alpha === 0) {
      return [0, 0, 0, 0];
    } else {
      var out_pixel = [];
      for(var i = 0; i < 3; i++) {
        var component = ( nfg[i] * nfg[3] + (nbg[i] * nbg[3]) * ( 1 - nfg[3] ) ) / out_alpha;
        out_pixel.push(component*255);
      }
      out_pixel.push(out_alpha*255);
      return out_pixel;
    }
    
  });
  
})();
