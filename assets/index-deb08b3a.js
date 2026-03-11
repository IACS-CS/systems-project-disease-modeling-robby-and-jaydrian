true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(script) {
        const fetchOpts = {};
        if (script.integrity)
            fetchOpts.integrity = script.integrity;
        if (script.referrerpolicy)
            fetchOpts.referrerPolicy = script.referrerpolicy;
        if (script.crossorigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (script.crossorigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

const style = '';

class p {
  /**
   * Creates a new GameCanvas instance.
   *
   * @param id - The Canvas Element OR the ID of the canvas element we will render the game in.
   * @param config - Optional configuration object
   * @param config.size - Optional size for canvas. Otherwise size is taken from explicitly set width/height OR from the element's size on the page.
   * @param config.autoresize - Whether to resize the game canvas to the DOM canvas automatically (defaults to true)
   */
  constructor(t, e = {}) {
    if (this.isRunning = !1, this.tick = (i) => {
      this.doDrawing(i ?? performance.now()), this.isRunning && (this.animationFrameId = window.requestAnimationFrame(this.tick));
    }, !t)
      throw new Error(
        `GameCanvas must be called with the ID of a canvas, like this

const game=new GameCanvas("mycanvasid")`
      );
    if (this.canvas = typeof t == "string" ? document.getElementById(t) : t, !this.canvas)
      throw new Error("No canvas element found at ID=" + t);
    this.ctx = this.canvas.getContext("2d"), this.drawings = [], this.drawingMetadata = [], this.handlers = { resize: [] }, this.autoresize = e.autoresize ?? !e.size, this.setInitialCanvasSize(e.size), this.setupHandlers();
  }
  setInitialCanvasSize(t) {
    t != null && t.width ? (this.canvas.width = t.width, this.width = t.width) : this.canvas.getAttribute("width") ? this.width = this.canvas.width : (this.width = this.canvas.clientWidth, this.canvas.width = this.width), t != null && t.height ? (this.canvas.height = t.height, this.height = t.height) : this.canvas.getAttribute("height") ? this.height = this.canvas.height : (this.height = this.canvas.clientHeight, this.canvas.height = this.height);
  }
  setupHandlers() {
    const t = [
      "click",
      "dblclick",
      "mousedown",
      "mousemove",
      "mouseup",
      "keyup",
      "keydown",
      "keypress"
    ];
    for (const e of t)
      this.handlers[e] = [], this.canvas.tabIndex = 1e3, this.canvas.addEventListener(e, (i) => {
        const s = i.offsetX, n = i.offsetY;
        for (const r of this.handlers[e])
          if (r({ x: s, y: n, type: e, event: i })) return;
      });
  }
  observeCanvasResize() {
    new window.ResizeObserver((e) => {
      for (let i of e) {
        this.autoresize && this.setCanvasSize(i.contentRect.width, i.contentRect.height);
        for (const s of this.handlers.resize)
          if (s({
            width: i.contentRect.width,
            height: i.contentRect.height,
            canvas: this.canvas,
            setCanvasSize: this.setCanvasSize.bind(this),
            ctx: this.ctx
          })) return;
      }
    }).observe(this.canvas);
  }
  setCanvasSize(t, e) {
    this.width = t, this.height = e, this.canvas.width = t, this.canvas.height = e;
  }
  doDrawing(t) {
    this.ctx.clearRect(0, 0, this.width, this.height), this.drawings.forEach((e, i) => {
      const s = () => {
        this.drawingMetadata[i].off = !0;
      }, n = this.drawingMetadata[i];
      if (n.off) return;
      let r, a = n.__lastTime ? t - n.__lastTime : 0;
      n.__lastTime = t, n.__startTime ? r = t - n.__startTime : (r = 0, n.__startTime = t), e.draw ? e.draw({
        ctx: this.ctx,
        width: this.width,
        height: this.height,
        remove: s,
        timestamp: t,
        elapsed: r,
        stepTime: a
      }) : e({
        ctx: this.ctx,
        width: this.width,
        height: this.height,
        remove: s,
        timestamp: t,
        elapsed: r,
        stepTime: a
      });
    });
  }
  /**
   * run the game (start animations, listen for events).
   * @method
   */
  run() {
    this.autoresize && (this.observeCanvasResize(), this.setCanvasSize(this.canvas.clientWidth, this.canvas.clientHeight)), this.isRunning = !0, this.tick();
  }
  /**
   * Stop the game animation loop.
   * @method
   */
  stop() {
    this.isRunning = !1, this.animationFrameId && (window.cancelAnimationFrame(this.animationFrameId), this.animationFrameId = void 0);
  }
  /**
   * Check if the game is currently running.
   * @returns Whether the game is running
   */
  getIsRunning() {
    return this.isRunning;
  }
  /**
   * Add a drawing to our drawing queue (it will remain until we remove it).
   *
   * @param d - draw function OR an object with a draw callback method
   * @returns ID that can be used in removeDrawing callback to remove drawing.
   *
   * @example <caption>Passing a draw function</caption>
   * ```typescript
   * game.addDrawing(
   *     function ({ctx,elapsed}) {
   *         ctx.beginPath();
   *         ctx.moveTo(200,200);
   *         ctx.lineTo(100,200+Math.sin(elapsed/10)*200);
   *         ctx.stroke();
   *     }
   * );
   * ```
   *
   * @example <caption>Passing an object with a draw method</caption>
   * ```typescript
   * game.addDrawing(
   *      { x : 0,
   *        y : 0,
   *        w : 100,
   *        h : 100,
   *        draw ({ctx,stepTime,width,height}) {
   *           this.x += stepTime/20;
   *           this.y += stepTime/20;
   *           if (this.x > width) { this.x = 0 }
   *           if (this.y > height) { this.y = 0 }
   *           ctx.fillRect(this.x,this.y,this.w,this.h)
   *        },
   *      }
   * );
   * ```
   *
   * @example <caption>A drawing that will remove itself when it leaves the screen</caption>
   * ```typescript
   * game.addDrawing(
   *     function ({ctx,elapsed,width,remove}) {
   *         const x = elapsed / 20
   *         ctx.fillRect(x,20,20,20);
   *         if (x > width) { remove() }
   *     }
   * );
   * ```
   */
  addDrawing(t) {
    return this.drawings.push(t), this.drawingMetadata.push({}), this.drawings.length - 1;
  }
  /**
   * Remove a drawing by its ID.
   *
   * @param idx - drawing ID to remove (return value from addDrawing).
   */
  removeDrawing(t) {
    if (typeof t != "number")
      throw new Error(
        `removeDrawing must have a numeric ID as an argument. Received ${typeof t} ${t}`
      );
    this.drawingMetadata[t] ? this.drawingMetadata[t].off = !0 : console.log("WARNING: Attempt to remove non-existent drawing: %s", t);
  }
  /**
   * Restore a previously removed drawing (start drawing again).
   *
   * @param idx - drawing ID to restore (start drawing again).
   */
  restoreDrawing(t) {
    if (typeof t != "number")
      throw new Error(
        `restoreDrawing must have a numeric ID as an argument. Received ${typeof t} ${t}`
      );
    this.drawingMetadata[t].off = !1;
  }
  /**
   * Replace a drawing by id
   */
  replaceDrawing(t, e) {
    return this.drawings[t] = e, t;
  }
  addHandler(t, e) {
    if (!this.handlers[t])
      throw new Error(
        `No eventType ${t}: SimpleCanvasLibrary only supports events of type: ${Object.keys(
          this.handlers
        ).join(",")}`
      );
    if (typeof e != "function")
      throw new Error(
        `addHandler requires a function as second argument. ${e} is a ${typeof e}, not a function.`
      );
    return this.handlers[t].push(e), this.handlers[t].length - 1;
  }
  /**
   * Remove handler for eventType.
   */
  removeHandler(t, e) {
    if (!this.handlers[t])
      throw new Error(
        `No eventType ${t}: SimpleCanvasLibrary only supports events of type: ${Object.keys(
          this.handlers
        ).join(",")}`
      );
    this.handlers[t][e] = () => {
    };
  }
  /**
   * Syntactic sugar for addHandler('click',h).
   *
   * @param h - A function to handle click events
   * @returns ID that can be used to remove handler with removeClickHandler
   *
   * @example <caption>Make a drawing move whenever there is a click</caption>
   * ```typescript
   * let xpos = 100;
   * let ypos = 100;
   * // Register a handler to update our variable each time
   * // there is a click.
   * game.addClickHandler(
   *     function ({x,y}) {
   *       // set variables...
   *       xpos = x;
   *       ypos = y;
   *     }
   * )
   * // Now create a drawing that uses the variable we set.
   * game.addDrawing(
   *     function ({ctx}) {ctx.fillRect(xpos,ypos,30,30)}
   * )
   * ```
   */
  addClickHandler(t) {
    if (typeof t != "function")
      throw new Error(
        `addClickHandler requires a function as an argument. ${t} is a ${typeof t}, not a function.`
      );
    return this.handlers.click.push(t), this.handlers.click.length - 1;
  }
  /**
   * Syntactic sugar for removeHandler('click',h)
   */
  removeClickHandler(t) {
    this.handlers.click[t] = () => {
    };
  }
  /**
   * Register a handler h for resize
   */
  addResizeHandler(t) {
    return this.addHandler("resize", t);
  }
  /**
   * Syntactic sugar for removeHandler('resize',h)
   */
  removeResizeHandler(t) {
    return this.removeHandler("resize", t);
  }
  /**
   * Get current canvas size
   */
  getSize() {
    return { width: this.width, height: this.height };
  }
}
console.log("Importing Sprite.ts");
class d {
  constructor(t) {
    this.isVisible = !0, this.isEnabled = !0, this.element = t;
  }
  /**
   * Show the component
   */
  show() {
    return this.isVisible = !0, this.element.style.display = "", this;
  }
  /**
   * Hide the component
   */
  hide() {
    return this.isVisible = !1, this.element.style.display = "none", this;
  }
  /**
   * Enable the component
   */
  enable() {
    return this.isEnabled = !0, this.element.style.opacity = "1", this.element.style.pointerEvents = "auto", (this.element instanceof HTMLInputElement || this.element instanceof HTMLButtonElement) && (this.element.disabled = !1), this;
  }
  /**
   * Disable the component
   */
  disable() {
    return this.isEnabled = !1, this.element.style.opacity = "0.5", this.element.style.pointerEvents = "none", (this.element instanceof HTMLInputElement || this.element instanceof HTMLButtonElement) && (this.element.disabled = !0), this;
  }
  /**
   * Get the underlying DOM element
   */
  getElement() {
    return this.element;
  }
  /**
   * Check if the component is visible
   */
  getIsVisible() {
    return this.isVisible;
  }
  /**
   * Check if the component is enabled
   */
  getIsEnabled() {
    return this.isEnabled;
  }
}
class f extends d {
  constructor(t) {
    const e = document.createElement("button");
    if (e.textContent = t.text, e.addEventListener("click", t.onclick), super(e), this.config = t, t.class)
      e.className = t.class;
    else {
      if (e.style.cssText = `
        padding: 8px 16px;
        margin: 4px;
        border: 1px solid var(--button-border-color, #ccc);
        border-radius: 4px;
        background: var(--button-background, #f0f0f0);
        color: var(--button-text-color, #222);
        cursor: pointer;
        font-size: var(--button-font-size, 14px);
        font-family: var(--button-font-family, inherit);
        transition: background 0.15s;
      `, t.style) {
        const i = {
          color: "--button-background",
          textColor: "--button-text-color",
          fontSize: "--button-font-size",
          fontFamily: "--button-font-family",
          borderColor: "--button-border-color",
          hoverColor: "--button-hover-background"
        };
        for (const [s, n] of Object.entries(t.style))
          i[s] && e.style.setProperty(i[s], n);
      }
      if (t.cssVars)
        for (const [i, s] of Object.entries(t.cssVars))
          e.style.setProperty(i, s);
      e.addEventListener("mouseenter", () => {
        this.isEnabled && (e.style.background = getComputedStyle(e).getPropertyValue(
          "--button-hover-background"
        ) || "#e0e0e0");
      }), e.addEventListener("mouseleave", () => {
        this.isEnabled && (e.style.background = getComputedStyle(e).getPropertyValue("--button-background") || "#f0f0f0");
      });
    }
  }
  /**
   * Update the button text
   */
  setText(t) {
    return this.config.text = t, this.element.textContent = t, this;
  }
  /**
   * Get the current button text
   */
  getText() {
    return this.config.text;
  }
}
class g extends d {
  constructor(t) {
    const e = document.createElement("div");
    t.class ? e.className = t.class : e.style.cssText = `
        display: inline-flex;
        align-items: center;
        margin: 4px;
        gap: 8px;
        background: var(--input-container-background, transparent);
      `;
    let i;
    t.label && (i = document.createElement("label"), i.textContent = t.label + ":", i.style.cssText = `
        font-size: 14px;
        font-weight: bold;
        color: var(--label-color, #222);
      `, e.appendChild(i));
    const s = document.createElement("input");
    s.type = "number", t.min !== void 0 && (s.min = t.min.toString()), t.max !== void 0 && (s.max = t.max.toString()), t.step !== void 0 && (s.step = t.step.toString()), t.value !== void 0 && (s.value = t.value.toString()), t.class || (s.style.cssText = `
        padding: 4px 8px;
        border: 1px solid var(--input-border-color, #ccc);
        border-radius: 4px;
        font-size: 14px;
        width: 80px;
        background: var(--input-background, #fff);
        color: var(--input-text-color, #222);
      `), s.addEventListener("input", () => {
      const n = parseFloat(s.value);
      isNaN(n) || t.oninput(n);
    }), e.appendChild(s), super(e), this.config = t, this.input = s, this.label = i;
  }
  /**
   * Get the current value
   */
  getValue() {
    return parseFloat(this.input.value) || 0;
  }
  /**
   * Set the value
   */
  setValue(t) {
    return this.input.value = t.toString(), this.config.oninput(t), this;
  }
  /**
   * Update the label text
   */
  setLabel(t) {
    return this.label && (this.label.textContent = t + ":"), this;
  }
  /**
   * Enable the input
   */
  enable() {
    return super.enable(), this.input.disabled = !1, this;
  }
  /**
   * Disable the input
   */
  disable() {
    return super.disable(), this.input.disabled = !0, this;
  }
}
class b extends d {
  constructor(t = {}) {
    const e = document.createElement("div");
    if (e.style.cssText = `
      display: flex;
      align-items: center;
      margin: 5px 10px;
      gap: 8px;
      /* host CSS variables (overridable) */
      font-family: var(--scl-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial);
      color: var(--scl-color-text, #e6e6e6);
      background: var(--scl-input-bg, transparent);
    `, super(e), this.config = t, z(this.element, this.config.theme), this.config.cssVars)
      for (const [i, s] of Object.entries(this.config.cssVars))
        this.element.style.setProperty(i, s);
    this.createSlider();
  }
  createSlider() {
    if (this.config.label) {
      const t = document.createElement("label");
      t.textContent = this.config.label + ":", t.style.cssText = `
        font-size: var(--scl-font-size, 14px);
        font-weight: 500;
        color: var(--scl-color-text, #e6e6e6);
        margin-right: 8px;
        white-space: nowrap;
      `, this.element.appendChild(t);
    }
    this.input = document.createElement("input"), this.input.type = "range", this.input.min = String(this.config.min ?? 0), this.input.max = String(this.config.max ?? 100), this.input.step = String(this.config.step ?? 1), this.input.disabled = this.config.disabled ?? !1, this.input.value = String(this.config.value ?? 50), this.input.style.cssText = `
      flex: 1;
      min-width: 100px;
      height: 20px;
      background: var(--scl-color, #5a5a5a);      
      color: var(--scl-color-text, #777777ff);
    `, this.valueDisplay = document.createElement("span"), this.valueDisplay.textContent = this.input.value, this.valueDisplay.style.cssText = `
      font-size: var(--scl-font-size, 14px);
      color: var(--scl-color-muted, #9ca3af);
      min-width: 30px;
      text-align: right;
      font-family: var(--scl-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial);
    `, this.input.addEventListener("input", () => {
      const t = parseFloat(this.input.value);
      this.valueDisplay.textContent = String(t), this.config.oninput && this.config.oninput(t);
    }), this.element.appendChild(this.input), this.element.appendChild(this.valueDisplay);
  }
  /**
   * Get the current value
   */
  getValue() {
    return parseFloat(this.input.value);
  }
  /**
   * Set the value
   */
  setValue(t) {
    return this.input.value = String(t), this.valueDisplay.textContent = String(t), this;
  }
  /**
   * Get whether the slider is enabled
   */
  getIsEnabled() {
    return !this.input.disabled;
  }
  /**
   * Enable the slider
   */
  enable() {
    return this.input.disabled = !1, this;
  }
  /**
   * Disable the slider
   */
  disable() {
    return this.input.disabled = !0, this;
  }
  /**
   * Set the min value
   */
  setMin(t) {
    return this.input.min = String(t), this;
  }
  /**
   * Set the max value
   */
  setMax(t) {
    return this.input.max = String(t), this;
  }
  /**
   * Set the step value
   */
  setStep(t) {
    return this.input.step = String(t), this;
  }
}
function z(o, t) {
  if (!t) return;
  const e = {
    "--scl-font-family": t.fontFamily,
    "--scl-color-text": t.color,
    "--scl-color-muted": t.mutedColor,
    "--scl-color-accent": t.accentColor,
    "--scl-input-bg": t.inputBackground,
    "--scl-input-track-bg": t.trackBackground,
    "--scl-input-thumb-bg": t.thumbBackground,
    "--scl-input-thumb-border": t.thumbBorder
  };
  for (const [i, s] of Object.entries(e))
    s != null && o.style.setProperty(i, s);
}
class v extends d {
  constructor(t) {
    super(t), this.components = [];
  }
  /**
   * Set foreground and background colors for the bar using CSS variables.
   * @param foreground - Text color
   * @param background - Background color
   */
  setColor(t, e) {
    return this.element.style.setProperty("--bar-background", e), this.element.style.setProperty("--bar-text-color", t), this;
  }
  /**
   * Set alignment of items within the bar.
   * @param justifyContent - Justify content value (CSS flexbox)
   */
  setAlignment(t) {
    return this.element.style.setProperty("--bar-justify-content", t), this;
  }
  /**
   * Add a title (non-interactive text) to the bar.
   * Inherits bar foreground/background colors.
   * @param text - Title text
   * @param options - Optional style overrides
   */
  addTitle(t, e) {
    const i = document.createElement("span");
    return i.textContent = t, i.style.cssText = `
      color: var(--bar-text-color, inherit);
      background: var(--bar-background, inherit);      
      font-weight: bold;
      font-size: 1.1em;
      margin-right: 16px;
      padding: 2px 8px;
      border-radius: 4px;
      user-select: none;
      pointer-events: none;
      display: inline-block;
    `, e && Object.assign(i.style, e), this.element.appendChild(i), i;
  }
  /**
   * Add arbitrary HTML or an HTMLElement to the bar.
   * @param html - HTML string or HTMLElement
   */
  addHTML(t) {
    let e;
    if (typeof t == "string") {
      const i = document.createElement("span");
      i.innerHTML = t, e = i;
    } else
      e = t;
    return this.element.appendChild(e), e;
  }
  /**
   * Add a button to the bar
   */
  addButton(t) {
    const e = new f(t);
    return this.components.push(e), this.element.appendChild(e.getElement()), e;
  }
  /**
   * Add a number input to the bar
   */
  addNumberInput(t) {
    const e = new g(t);
    return this.components.push(e), this.element.appendChild(e.getElement()), e;
  }
  /**
   * Add a slider to the bar
   */
  addSlider(t) {
    const e = new b(t);
    return this.components.push(e), this.element.appendChild(e.getElement()), e;
  }
  /**
   * Remove all components from the bar
   */
  clear() {
    return this.components.forEach((t) => {
      const e = t.getElement();
      e.parentNode && e.parentNode.removeChild(e);
    }), this.components = [], this;
  }
  /**
   * Get all components in the bar
   */
  getComponents() {
    return [...this.components];
  }
}
class x extends v {
  constructor() {
    const t = document.createElement("div");
    t.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px;
      background: var(--bar-background, #f8f8f8);
      border-bottom: 1px solid var(--bar-border-color, #ddd);
      min-height: 40px;
      flex-wrap: wrap;
      justify-content: var(--bar-justify-content, start);
    `, super(t);
  }
}
class y extends v {
  constructor() {
    const t = document.createElement("div");
    t.style.cssText = `
      display: flex;
      align-items: center;      
      padding: 8px;
      background: var(--bar-background, #f8f8f8);
      border-top: 1px solid var(--bar-border-color, #ddd);
      min-height: 40px;
      flex-wrap: wrap;
      justify-content: var(--bar-justify-content, start);
    `, super(t);
  }
}
class T extends p {
  constructor(t = {}) {
    const e = document.createElement("canvas"), i = !!t.canvasSize, s = t.autoresize !== void 0, n = !!(t.scaleToFit && i);
    i && s && t.autoresize && console.warn(
      "GameInterface: Both canvasSize and autoresize:true were specified. This is contradictory - autoresize will be ignored and canvas will use the specified size. Did you mean to use scaleToFit:true instead?"
    ), t.scaleToFit && !i && console.warn(
      "GameInterface: scaleToFit requires canvasSize to be specified. Falling back to autoresize mode."
    );
    const r = n || i ? !1 : t.autoresize ?? !0;
    i && (e.width = t.canvasSize.width, e.height = t.canvasSize.height), super(e, {
      size: t.canvasSize,
      autoresize: r
    }), this.gameState = "stopped", this.config = t, this.setupContainer(
      e,
      i,
      r,
      n
    );
  }
  setupContainer(t, e, i, s) {
    this.container = document.createElement("div");
    const n = `
      --container-background: #18181b;
      --container-border-color: #222;
      --canvas-container-background: #232326;
      --canvas-background: #18181b;
      --bar-background: #232326;
      --bar-text-color: #e6e6e6;
      --bar-border-color: #333;
      --button-background: #232326;
      --button-hover-background: #333;
      --button-border-color: #333;
      --button-text-color: #e6e6e6;
      --input-background: #232326;
      --input-border-color: #333;
      --input-text-color: #e6e6e6;
      --input-container-background: transparent;
      --label-color: #e6e6e6;
      --dialog-background: #232326;
      --dialog-title-color: #e6e6e6;
      --dialog-message-color: #b3b3b3;
      --close-button-background: #22c55e;
      --close-button-color: #18181b;
      --scl-font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      --scl-font-size: 14px;
      --scl-color-text: #e6e6e6;
      --scl-color-muted: #9ca3af;
      --scl-color-accent: #22c55e;
      --scl-input-bg: transparent;
      --scl-input-track-bg: #444;
      --scl-input-thumb-bg: #22c55e;
      --scl-input-thumb-border: #18181b;
    `;
    if (this.config.containerClass)
      this.container.className = this.config.containerClass;
    else if (this.config.fullscreen)
      this.container.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        border: none;
        border-radius: 0;
        overflow: hidden;
        background: var(--container-background);
        width: 100vw;
        height: 100vh;
        margin: 0;
        ${n}
      `, document.body.style.overflow = "hidden";
    else {
      const c = !e && i;
      this.container.style.cssText = `
        display: ${c ? "flex" : "inline-flex"};
        flex-direction: column;
        border: 1px solid var(--container-border-color);
        border-radius: 4px;
        overflow: hidden;
        background: var(--container-background);
        margin: 0 auto;
        box-sizing: border-box;
        ${c ? "width: 100%; height: 100%;" : ""}
        ${n}
      `;
    }
    if (this.config.cssVars)
      for (const [c, u] of Object.entries(this.config.cssVars))
        this.container.style.setProperty(c, u);
    this.canvasContainer = document.createElement("div");
    const r = this.config.fullscreen;
    let a = "", l = "";
    s ? (a = `
        flex: 1;
        min-height: 0;
        container-type: size;
        aspect-ratio: ${this.config.canvasSize.width / this.config.canvasSize.height};
        max-width: ${this.config.canvasSize.width}px;
        max-height: ${this.config.canvasSize.height}px;
        height: min(calc(100vh - 128px), ${this.config.canvasSize.height}px);
      `, l = `
        width: 100cqw;
        height: 100cqh;
      `) : (r || i) && (a = "flex: 1; min-height: 0;", l = `
        width: 100%;
        height: 100%;
        ${r ? "max-width: 100vw; max-height: 100vh;" : ""}
      `), this.canvasContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--canvas-container-background);
      padding: ${r ? "0" : "10px"};
      box-sizing: border-box;
      ${a}
    `, t.style.cssText = `
      border: ${r ? "none" : "1px solid #ddd"};
      border-radius: ${r ? "0" : "4px"};
      background: var(--canvas-background);
      display: block;
      ${l}
    `, this.canvasContainer.appendChild(t), this.container.appendChild(this.canvasContainer), (this.config.parent || document.body).appendChild(this.container);
  }
  /**
   * Add and return a top bar for UI components.
   * If a top bar already exists, returns the existing one.
   */
  addTopBar() {
    return this.topBar || (this.topBar = new x(), this.container.insertBefore(
      this.topBar.getElement(),
      this.container.firstChild
    )), this.topBar;
  }
  /**
   * Add and return a bottom bar for UI components.
   * If a bottom bar already exists, returns the existing one.
   */
  addBottomBar() {
    return this.bottomBar || (this.bottomBar = new y(), this.container.appendChild(this.bottomBar.getElement())), this.bottomBar;
  }
  /**
   * Get the top bar if it exists
   */
  getTopBar() {
    return this.topBar;
  }
  /**
   * Get the bottom bar if it exists
   */
  getBottomBar() {
    return this.bottomBar;
  }
  /**
   * Remove the top bar
   */
  removeTopBar() {
    if (this.topBar) {
      const t = this.topBar.getElement();
      t.parentNode && t.parentNode.removeChild(t), this.topBar = void 0;
    }
    return this;
  }
  /**
   * Remove the bottom bar
   */
  removeBottomBar() {
    if (this.bottomBar) {
      const t = this.bottomBar.getElement();
      t.parentNode && t.parentNode.removeChild(t), this.bottomBar = void 0;
    }
    return this;
  }
  /**
   * Show a simple dialog with a message
   */
  dialog(t, e, i) {
    const s = document.createElement("dialog");
    s.style.cssText = `
      border: none;
      border-radius: 8px;
      padding: 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      background: var(--dialog-background, #fff);
    `;
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px;
      text-align: center;
    `;
    const r = document.createElement("h3");
    if (r.textContent = t, r.style.cssText = `
      margin: 0 0 10px 0;
      color: var(--dialog-title-color, #333);
    `, n.appendChild(r), e) {
      const l = document.createElement("p");
      l.textContent = e, l.style.cssText = `
        margin: 0 0 20px 0;
        color: var(--dialog-message-color, #666);
        line-height: 1.4;
      `, n.appendChild(l);
    }
    const a = document.createElement("button");
    return a.textContent = "OK", a.style.cssText = `
      padding: 8px 20px;
      background: var(--close-button-background, #007cba);
      color: var(--close-button-color, #fff);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `, a.addEventListener("click", () => {
      s.close(), i && i();
    }), n.appendChild(a), s.appendChild(n), s.addEventListener("click", (l) => {
      l.target === s && (s.close(), i && i());
    }), document.body.appendChild(s), s.showModal(), s.addEventListener("close", () => {
      document.body.removeChild(s);
    }), s;
  }
  /**
   * Get the main container element
   */
  getContainer() {
    return this.container;
  }
  /**
   * Get the current game state
   */
  getGameState() {
    return this.gameState;
  }
  /**
   * Start the game (override parent to track state)
   */
  run() {
    super.run(), this.gameState = "running";
  }
  /**
   * Pause the game
   */
  pause() {
    super.stop(), this.gameState = "paused";
  }
  /**
   * Resume the game
   */
  resume() {
    super.run(), this.gameState = "running";
  }
  /**
   * Stop the game completely
   */
  stop() {
    super.stop(), this.gameState = "stopped";
  }
  /**
   * Reset the game (alias for stop)
   */
  reset() {
    this.stop();
  }
  /**
   * Destroy the interface and clean up DOM elements
   */
  destroy() {
    this.container.parentNode && this.container.parentNode.removeChild(this.container);
  }
}

/* Main game file: main.js */

let gi = new T();


/* --- STATE ------------------------------------------------------------ */

let infectionRate = 0.5;
// let population = [];
// let roundCount = 0;
// let infectedPerRound = [1];


/* --- COORDINATE HELPER ------------------------------------------------
 *
 * Positions in your simulation are "percent coordinates": x and y
 * run from 0 to 100, where (0,0) is the top-left of any region.
 * percentToPixels() converts those to actual canvas pixels for a
 * given bounds object: { top, bottom, left, right }
 *
 * Examples (bounds = { top:0, bottom:400, left:0, right:800 }):
 *   percentToPixels(  0,   0, bounds) --> { x:   0, y:   0 }
 *   percentToPixels(100, 100, bounds) --> { x: 800, y: 400 }
 *   percentToPixels( 50,  50, bounds) --> { x: 400, y: 200 }
 *
 * @param {number} x
 * @param {number} y
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @returns {{x:number, y:number}}
 */
function percentToPixels(x, y, bounds) {
  return {
    x: bounds.left + (x / 100) * (bounds.right - bounds.left),
    y: bounds.top + (y / 100) * (bounds.bottom - bounds.top),
  };
}


/* --- DRAWING: SIMULATION ----------------------------------------------
 *
 * Draw your agents inside the simulation area.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 * @param {number} elapsed - ms since simulation started
 */
function drawSimulation(ctx, bounds, elapsed) {

  // Draw a border around the simulation area...
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = 'orange';
  ctx.lineWidth = 2;
  ctx.strokeRect(topLeft.x, topLeft.y,
    bottomRight.x - topLeft.x,
    bottomRight.y - topLeft.y);

  // Example: utility function to draw a person as a circle
  function drawPerson(px, py, color) {
    let { x, y } = percentToPixels(px, py, bounds);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Now we draw some people...
  // (in your real code you'll replace this with a loop)
  // like...
  // for (let person of population) {...}

  drawPerson(50, 50, 'green');
  drawPerson(35, 80, 'red');

  // YOUR CODE HERE

}


/* --- DRAWING: GRAPH ---------------------------------------------------
 *
 * Draw a bar chart in the graph area.
 * data[] is a list of values (e.g. infectedPerRound).
 * dataMax is the largest possible value (e.g. population.length).
 *
 * This is a good CREATE task candidate -- try calling it with
 * fake data to see how changing the arguments changes the output.
 *
 * @param {number[]} data
 * @param {number} dataMax
 * @param {CanvasRenderingContext2D} ctx
 * @param {{top:number, bottom:number, left:number, right:number}} bounds
 */
function drawGraph(data, dataMax, ctx, bounds) {

  // Axes
  let topLeft = percentToPixels(0, 0, bounds);
  let bottomLeft = percentToPixels(0, 100, bounds);
  let bottomRight = percentToPixels(100, 100, bounds);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.stroke();

  // YOUR CODE HERE
  // Hint: let pct = (data[i] / dataMax) * 100;

}


/* --- DRAWING: HUD -----------------------------------------------------
 *
 * Optional text overlay. Delete if you don't need it.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 */
function drawHUD(ctx, width, height) {

  // YOUR CODE HERE
  ctx.textAlign = 'left';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'red';
  let text = `Simulation - Infection Rate: ${infectionRate.toFixed(2)}`;
  ctx.font = '16pt sans-serif';
  ctx.strokeText(text, 15, 25);
  ctx.fillText(text, 15, 25);

}


/* --- REGISTERED DRAWING CALLBACKS -------------------------------------
 * You shouldn't need to change these.
 * Adjust the bounds values if you want to resize the regions.
 */

gi.addDrawing(function ({ ctx, width, height, elapsed }) {
  let simBounds = {
    top: 30,
    bottom: height / 2 - 10,
    left: 10,
    right: width - 10,
  };
  drawSimulation(ctx, simBounds);
});

gi.addDrawing(function ({ ctx, width, height }) {
  let graphBounds = {
    top: height / 2 + 10,
    bottom: height - 50,
    left: 50,
    right: width - 50,
  };
  drawGraph([], 1, ctx, graphBounds);  // <- replace [] and 1 with your real data
});

gi.addDrawing(function ({ ctx, width, height }) {
  drawHUD(ctx);
});


/* --- SIMULATION LOGIC -------------------------------------------------
 *
 * Write functions to update your population each round.
 * Your CREATE task function must have a parameter that affects
 * its behavior, sequencing, selection (if/else), iteration (loop),
 * and an explicit call with arguments somewhere in your code.
 */

// YOUR CODE HERE


/* --- CONTROLS --------------------------------------------------------- */

let topBar = gi.addTopBar();

topBar.addButton({
  text: 'Next Round',
  onclick: function () {
    window.alert('Replace me: call your simulation update function');
  }
});

topBar.addSlider({
  label: 'Infection Rate',
  min: 0, max: 1, step: 0.01,
  value: infectionRate,
  oninput: function (value) { infectionRate = value; }
});

topBar.addSlider({
  label: 'Initial Population',
  min: 16, max: 2048,
  oninput: function (value) {
    window.alert('Replace me: call your generatePopulation function with size ' + value);
  }
});

topBar.addButton({
  text: 'Reset',
  onclick: function () {
    window.alert('Replace me: call your generatePopulation function');
  }
});

// TODO: add sliders or inputs for your own parameters here


gi.run();
//# sourceMappingURL=index-deb08b3a.js.map
