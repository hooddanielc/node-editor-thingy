import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import { setupComponentTest } from 'ember-mocha';

describe('WebGLComponent', function() {
  const assertViewport = (subject) => {
    const ctx = subject.get('ctx');
    const params = ctx.getParameter(ctx.VIEWPORT);

    expect(params).to.eql({
      '0': 0,
      '1': 0,
      '2': subject.$().width(),
      '3': subject.$().height()
    });
  };

  const vertexShaderSrc = `
    attribute vec3 coordinates;

    void main(void) {
      gl_Position = vec4(coordinates, 1.0);
    }
  `;

  const fragmentShaderSrc = `
    void main(void) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
    }
  `;

  setupComponentTest('web-g-l', {
    needs: [],
    unit: true
  });

  let subject = null;
  let el = null;

  beforeEach(function () {
    subject = this.subject();
    this.render();
    el = subject.$();
  });

  it('renders', function () {
    expect(el).to.have.length(1);
    expect(el.prop('tagName')).to.eql('CANVAS');
    expect(el.children().prop('tagName')).to.eql('P');
    expect(subject.get('ctx') instanceof WebGLRenderingContext).to.eql(true);
  });

  it('adjusts viewport', function () {
    el.css({
      width: '100%',
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0
    });

    subject.adjustViewport();
    assertViewport(subject);
  });

  it('adjusts viewport with absolute css layout', function () {
    subject.adjustViewportAbsolute();
    const el = subject.$();
    expect(el.css('width')).to.eql(el.width() + 'px');
    expect(el.css('height')).to.eql(el.height() + 'px');
    expect(el.css('position')).to.eql('absolute');
    expect(el.css('left')).to.eql('0px');
    expect(el.css('top')).to.eql('0px');
    assertViewport(subject);
  });

  it('gets pixels', function () {
    subject.$().width(32);
    subject.$().height(32);
    subject.adjustViewport();
    subject.clear();
    const pixels = subject.getPixelsRGBA();
    expect(pixels.length).to.eql(1024 * 4);

    const result = [
      pixels[0],
      pixels[1],
      pixels[2],
      pixels[3],
      pixels[pixels.length - 4],
      pixels[pixels.length - 3],
      pixels[pixels.length - 2],
      pixels[pixels.length - 1]
    ];

    const expected = [
      0,
      0,
      0,
      255,
      0,
      0,
      0,
      255
    ];

    // first and last pixel
    expect(result).to.eql(expected);
  });

  it('gets histogram', function () {
    subject.$().width(32);
    subject.$().height(32);
    subject.adjustViewport();
    subject.clear();
    const pixels = subject.getHistogramRGBA();

    expect(pixels).to.eql({
      r: [1024, 0, 0, 0, 0, 0, 0, 0],
      g: [1024, 0, 0, 0, 0, 0, 0, 0],
      b: [1024, 0, 0, 0, 0, 0, 0, 0],
      a: [0, 0, 0, 0, 0, 0, 0, 1024]
    });
  });

  it('gets max attributes', function () {
    const checkMethod = (method) => {
      const val = subject[method]();
      expect(val).to.be.a('number');
      expect(val).to.be.above(0);
    };

    [
      'maxCombinedTextureImageUnits',
      'maxCubeMapTextureSize',
      'maxFragmentUniformVectors',
      'maxRenderbufferSize',
      'maxTextureImageUnits',
      'maxTextureSize',
      'maxVaryingVectors',
      'maxVertexTextureImageUnits',
      'maxVertexUniformVectors'
    ].forEach((getMaxMethod) => {
      checkMethod(getMaxMethod);
    });

    const val = subject.maxViewportDims();
    expect(val[0]).to.be.above(0);
    expect(val[1]).to.be.above(1);
  });

  it('creates a vertex shader', function () {
    const shader = subject.vertexShader(vertexShaderSrc);

    expect(shader instanceof WebGLShader).to.eql(true);
  });

  it('throws for bad vertex shader source', () => {
    expect(() => {
      subject.vertexShader('asdf');
    }).to.throw();
  });

  it('creates a fragment shader', function () {
    const shader = subject.fragmentShader(fragmentShaderSrc);

    expect(shader instanceof WebGLShader).to.eql(true);
  });

  it('throws for bad fragment shader source', function () {
    expect(() => {
      subject.fragmentShader('asdf');
    }).to.throw();
  });

  it('creates a program', function () {
    expect(subject.shaderProgram() instanceof WebGLProgram).to.eql(true);
  });

  it('links a program', function () {
    const ctx = subject.get('ctx');
    const program = subject.shaderProgram();

    subject.linkProgram(program, [
      subject.vertexShader(vertexShaderSrc),
      subject.fragmentShader(fragmentShaderSrc)
    ]);

    const num = ctx.getProgramParameter(program, ctx.ATTACHED_SHADERS);
    expect(num).to.eql(2);
  });

  it('links when creating a program', function () {
    const ctx = subject.get('ctx');

    const program = subject.shaderProgram([
      subject.vertexShader(vertexShaderSrc),
      subject.fragmentShader(fragmentShaderSrc)
    ]);

    const num = ctx.getProgramParameter(program, ctx.ATTACHED_SHADERS);
    expect(num).to.eql(2);
  });

  it('uses a program', function () {
    const program = subject.shaderProgram([
      subject.vertexShader(vertexShaderSrc),
      subject.fragmentShader(fragmentShaderSrc)
    ]);

    subject.useProgram(program);
  });
});