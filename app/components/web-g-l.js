import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'canvas',

  setupGL: function () {
    this.set('ctx', this.element.getContext('webgl'));

    if (!this.get('ctx')) {
      this.set('ctx', this.element.getContext('experimental-webgl'));
    }
  }.on('willInsertElement'),

  clear: function () {
    const ctx = this.get('ctx');
    ctx.clearColor(0, 0, 0, 1);
    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
  }.on('didInsertElement'),

  adjustViewport: function () {
    this.get('ctx').viewport(0, 0, this.$().width(), this.$().height());
  },

  adjustViewportAbsolute: function () {
    this.$().css({
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0
    });

    this.adjustViewport();
  },

  getPixelsRGBA: function () {
    const ctx = this.get('ctx');
    const pixels = new Uint8Array(this.$().width() * this.$().height() * 4);

    ctx.readPixels(
      0,
      0,
      this.$().width(),
      this.$().height(),
      ctx.RGBA,
      ctx.UNSIGNED_BYTE,
      pixels
    );

    return pixels;
  },

  getHistogramRGBA: function (buckets = 8) {
    const div = 256 / buckets;

    const result = {
      r: new Array(buckets),
      g: new Array(buckets),
      b: new Array(buckets),
      a: new Array(buckets)
    };

    ['r', 'g', 'b', 'a'].forEach((letter) => {
      for (let i = 0; i < 8; ++i) {
        result[letter][i] = 0;
      }
    });

    const states = {
      r: 0,
      g: 1,
      b: 2,
      a: 3
    };

    let state = states.r;

    this.getPixelsRGBA().forEach((p) => {
      switch (state) {
        case states.r:
          ++result.r[Math.trunc(p / div)];
          state = states.g;
          break;
        case states.g:
          ++result.g[Math.trunc(p / div)];
          state = states.b;
          break;
        case states.b:
          ++result.b[Math.trunc(p / div)];
          state = states.a;
          break;
        case states.a:
          ++result.a[Math.trunc(p / div)];
          state = states.r;
          break;
      }
    });

    return result;
  },

  getParameter: function (param) {
    const ctx = this.get('ctx');
    return ctx.getParameter(ctx[param]);
  },

  maxVertexAttributes: function () {
    return this.getParameter('MAX_VERTEX_ATTRIBS');
  },

  maxCombinedTextureImageUnits: function () {
    return this.getParameter('MAX_COMBINED_TEXTURE_IMAGE_UNITS');
  },

  maxCubeMapTextureSize: function () {
    return this.getParameter('MAX_CUBE_MAP_TEXTURE_SIZE');
  },

  maxFragmentUniformVectors: function () {
    return this.getParameter('MAX_FRAGMENT_UNIFORM_VECTORS');
  },

  maxRenderbufferSize: function () {
    return this.getParameter('MAX_RENDERBUFFER_SIZE');
  },

  maxTextureImageUnits: function () {
    return this.getParameter('MAX_TEXTURE_IMAGE_UNITS');
  },

  maxTextureSize: function () {
    return this.getParameter('MAX_TEXTURE_SIZE');
  },

  maxVaryingVectors: function () {
    return this.getParameter('MAX_VARYING_VECTORS');
  },

  maxVertexTextureImageUnits: function () {
    return this.getParameter('MAX_VERTEX_TEXTURE_IMAGE_UNITS');
  },

  maxVertexUniformVectors: function () {
    return this.getParameter('MAX_VERTEX_UNIFORM_VECTORS');
  },

  maxViewportDims: function () {
    return this.getParameter('MAX_VIEWPORT_DIMS');
  },

  compileShader: function (src, type) {
    const ctx = this.get('ctx');
    const shader = ctx.createShader(type);
    ctx.shaderSource(shader, src);
    ctx.compileShader(shader);

    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
      throw new Error(ctx.getShaderInfoLog(shader));
    }

    return shader;
  },

  vertexShader: function (src) {
    return this.compileShader(src, this.get('ctx').VERTEX_SHADER);
  },

  fragmentShader: function (src) {
    return this.compileShader(src, this.get('ctx').FRAGMENT_SHADER);
  },

  shaderProgram: function (shaders) {
    const program = this.get('ctx').createProgram();

    if (shaders) {
      this.linkProgram(program, shaders);
    }

    return program;
  },

  linkProgram: function (program, shaders) {
    const ctx = this.get('ctx');

    shaders.forEach((shader) => {
      ctx.attachShader(program, shader);
    });

    ctx.linkProgram(program);
    ctx.validateProgram(program);

    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
      throw new Error(ctx.getProgramInfoLog(program));
    }
  },

  useProgram: function (program) {
    this.get('ctx').useProgram(program);
  }
});
