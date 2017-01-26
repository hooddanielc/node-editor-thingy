import Ember from 'ember';

const WEBGL_VERTEX_ATTRIBUTE_TYPES = [
  'FLOAT',
  'FLOAT_VEC2',
  'FLOAT_VEC3',
  'FLOAT_VEC4',
  'FLOAT_MAT2',
  'FLOAT_MAT3',
  'FLOAT_MAT4',
  'FLOAT_MAT2x3',
  'FLOAT_MAT2x4',
  'FLOAT_MAT3x2',
  'FLOAT_MAT3x4',
  'FLOAT_MAT4x2',
  'FLOAT_MAT4x3',
  'INT',
  'INT_VEC2',
  'INT_VEC3',
  'INT_VEC4',
  'UNSIGNED_INT',
  'UNSIGNED_INT_VEC2',
  'UNSIGNED_INT_VEC3',
  'UNSIGNED_INT_VEC4',
  'DOUBLE',
  'DOUBLE_VEC2',
  'DOUBLE_VEC3',
  'DOUBLE_VEC4',
  'DOUBLE_MAT2',
  'DOUBLE_MAT3',
  'DOUBLE_MAT4',
  'DOUBLE_MAT2x3',
  'DOUBLE_MAT2x4',
  'DOUBLE_MAT3x2',
  'DOUBLE_MAT3x4',
  'DOUBLE_MAT4x2',
  'DOUBLE_MAT4x3'
];

const WEBGL_UNFIROM_ATTRIBUTE_TYPES = [
  'FLOAT',
  'FLOAT_VEC2',
  'FLOAT_VEC3',
  'FLOAT_VEC4',
  'DOUBLE',
  'DOUBLE_VEC2',
  'DOUBLE_VEC3',
  'DOUBLE_VEC4',
  'INT',
  'INT_VEC2',
  'INT_VEC3',
  'INT_VEC4',
  'UNSIGNED_INT',
  'UNSIGNED_INT_VEC2',
  'UNSIGNED_INT_VEC3',
  'UNSIGNED_INT_VEC4',
  'BOOL',
  'BOOL_VEC2',
  'BOOL_VEC3',
  'BOOL_VEC4',
  'FLOAT_MAT2',
  'FLOAT_MAT3',
  'FLOAT_MAT4',
  'FLOAT_MAT2x3',
  'FLOAT_MAT2x4',
  'FLOAT_MAT3x2',
  'FLOAT_MAT3x4',
  'FLOAT_MAT4x2',
  'FLOAT_MAT4x3',
  'DOUBLE_MAT2',
  'DOUBLE_MAT3',
  'DOUBLE_MAT4',
  'DOUBLE_MAT2x3',
  'DOUBLE_MAT2x4',
  'DOUBLE_MAT3x2',
  'DOUBLE_MAT3x4',
  'DOUBLE_MAT4x2',
  'DOUBLE_MAT4x3',
  'SAMPLER_1D',
  'SAMPLER_2D',
  'SAMPLER_3D',
  'SAMPLER_CUBE',
  'SAMPLER_1D_SHADOW',
  'SAMPLER_2D_SHADOW',
  'SAMPLER_1D_ARRAY',
  'SAMPLER_2D_ARRAY',
  'SAMPLER_1D_ARRAY_SHADOW',
  'SAMPLER_2D_ARRAY_SHADOW',
  'SAMPLER_2D_MULTISAMPLE',
  'SAMPLER_2D_MULTISAMPLE_ARRAY',
  'SAMPLER_CUBE_SHADOW',
  'SAMPLER_BUFFER',
  'SAMPLER_2D_RECT',
  'SAMPLER_2D_RECT_SHADOW',
  'INT_SAMPLER_1D',
  'INT_SAMPLER_2D',
  'INT_SAMPLER_3D',
  'INT_SAMPLER_CUBE',
  'INT_SAMPLER_1D_ARRAY',
  'INT_SAMPLER_2D_ARRAY',
  'INT_SAMPLER_2D_MULTISAMPLE',
  'INT_SAMPLER_2D_MULTISAMPLE_ARRAY',
  'INT_SAMPLER_BUFFER',
  'INT_SAMPLER_2D_RECT',
  'UNSIGNED_INT_SAMPLER_1D',
  'UNSIGNED_INT_SAMPLER_2D',
  'UNSIGNED_INT_SAMPLER_3D',
  'UNSIGNED_INT_SAMPLER_CUBE',
  'UNSIGNED_INT_SAMPLER_1D_ARRAY',
  'UNSIGNED_INT_SAMPLER_2D_ARRAY',
  'UNSIGNED_INT_SAMPLER_2D_MULTISAMPLE',
  'UNSIGNED_INT_SAMPLER_2D_MULTISAMPLE_ARRAY',
  'UNSIGNED_INT_SAMPLER_BUFFER',
  'UNSIGNED_INT_SAMPLER_2D_RECT',
  'IMAGE_1D',
  'IMAGE_2D',
  'IMAGE_3D',
  'IMAGE_2D_RECT',
  'IMAGE_CUBE',
  'IMAGE_BUFFER',
  'IMAGE_1D_ARRAY',
  'IMAGE_2D_ARRAY',
  'IMAGE_2D_MULTISAMPLE',
  'IMAGE_2D_MULTISAMPLE_ARRAY',
  'INT_IMAGE_1D',
  'INT_IMAGE_2D',
  'INT_IMAGE_3D',
  'INT_IMAGE_2D_RECT',
  'INT_IMAGE_CUBE',
  'INT_IMAGE_BUFFER',
  'INT_IMAGE_1D_ARRAY',
  'INT_IMAGE_2D_ARRAY',
  'INT_IMAGE_2D_MULTISAMPLE',
  'INT_IMAGE_2D_MULTISAMPLE_ARRAY',
  'UNSIGNED_INT_IMAGE_1D',
  'UNSIGNED_INT_IMAGE_2D',
  'UNSIGNED_INT_IMAGE_3D',
  'UNSIGNED_INT_IMAGE_2D_RECT',
  'UNSIGNED_INT_IMAGE_CUBE',
  'UNSIGNED_INT_IMAGE_BUFFER',
  'UNSIGNED_INT_IMAGE_1D_ARRAY',
  'UNSIGNED_INT_IMAGE_2D_ARRAY',
  'UNSIGNED_INT_IMAGE_2D_MULTISAMPLE',
  'UNSIGNED_INT_IMAGE_2D_MULTISAMPLE_ARRAY',
  'UNSIGNED_INT_ATOMIC_COUNTER'
];

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

  getUniformType: function (type) {
    const ctx = this.get('ctx');

    for (let i = 0; i < WEBGL_UNFIROM_ATTRIBUTE_TYPES.length; ++i) {
      if (ctx[WEBGL_UNFIROM_ATTRIBUTE_TYPES[i]] === type) {
        return WEBGL_UNFIROM_ATTRIBUTE_TYPES[i];
      }
    }
  },

  getVertexType: function (type) {
    const ctx = this.get('ctx');

    for (let i = 0; i < WEBGL_VERTEX_ATTRIBUTE_TYPES.length; ++i) {
      if (ctx[WEBGL_VERTEX_ATTRIBUTE_TYPES[i]] === type) {
        return WEBGL_VERTEX_ATTRIBUTE_TYPES[i];
      }
    }
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
  },

  getProgramAttributes: function (program) {
    const ctx = this.get('ctx');
    const numAttributes = ctx.getProgramParameter(program, ctx.ACTIVE_ATTRIBUTES);
    const numUniforms = ctx.getProgramParameter(program, ctx.ACTIVE_UNIFORMS);
    const uniforms = [];
    const vertices = [];

    for (let i = 0; i < numAttributes; ++i) {
      vertices.push(ctx.getActiveAttrib(program, i));
      vertices[i].typeName = this.getVertexType(vertices[i].type);
    }

    for (let i = 0; i < numUniforms; ++i) {
      uniforms.push(ctx.getActiveUniform(program, i));
      uniforms[i].typeName = this.getUniformType(uniforms[i].type);
    }

    return {
      uniforms: uniforms,
      vertices: vertices
    };
  },

  createBuffer: function ({ vertices, elements }) {
    const ctx = this.get('ctx');

    // create vertex array
    const verts = ctx.createBuffer(ctx.VERTEX_BUFFER);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, verts);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(vertices), ctx.STATIC_DRAW);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, null);

    // create element array buffer
    const elems = ctx.createBuffer(ctx.ELEMENT_ARRAY_BUFFER);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, elems);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(elements), ctx.STATIC_DRAW);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);

    return {
      elements: elems,
      vertices: verts
    };
  }
});
