var Demo = (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function noop() {}

  function assign(tar, src) {
  	for (var k in src) {
  		tar[k] = src[k];
  	}return tar;
  }

  function assignTrue(tar, src) {
  	for (var k in src) {
  		tar[k] = 1;
  	}return tar;
  }

  function addLoc(element, file, line, column, char) {
  	element.__svelte_meta = {
  		loc: { file: file, line: line, column: column, char: char }
  	};
  }

  function run(fn) {
  	fn();
  }

  function append(target, node) {
  	target.appendChild(node);
  }

  function insert(target, node, anchor) {
  	target.insertBefore(node, anchor);
  }

  function detachNode(node) {
  	node.parentNode.removeChild(node);
  }

  function destroyEach(iterations, detach) {
  	for (var i = 0; i < iterations.length; i += 1) {
  		if (iterations[i]) iterations[i].d(detach);
  	}
  }

  function createElement(name) {
  	return document.createElement(name);
  }

  function createText(data) {
  	return document.createTextNode(data);
  }

  function createComment() {
  	return document.createComment('');
  }

  function addListener(node, event, handler, options) {
  	node.addEventListener(event, handler, options);
  }

  function removeListener(node, event, handler, options) {
  	node.removeEventListener(event, handler, options);
  }

  function setData(text, data) {
  	text.data = '' + data;
  }

  function toggleClass(element, name, toggle) {
  	element.classList[toggle ? 'add' : 'remove'](name);
  }

  function blankObject() {
  	return Object.create(null);
  }

  function destroy(detach) {
  	this.destroy = noop;
  	this.fire('destroy');
  	this.set = noop;

  	this._fragment.d(detach !== false);
  	this._fragment = null;
  	this._state = {};
  }

  function destroyDev(detach) {
  	destroy.call(this, detach);
  	this.destroy = function () {
  		console.warn('Component was already destroyed');
  	};
  }

  function _differs(a, b) {
  	return a != a ? b == b : a !== b || a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || typeof a === 'function';
  }

  function fire(eventName, data) {
  	var handlers = eventName in this._handlers && this._handlers[eventName].slice();
  	if (!handlers) return;

  	for (var i = 0; i < handlers.length; i += 1) {
  		var handler = handlers[i];

  		if (!handler.__calling) {
  			try {
  				handler.__calling = true;
  				handler.call(this, data);
  			} finally {
  				handler.__calling = false;
  			}
  		}
  	}
  }

  function flush(component) {
  	component._lock = true;
  	callAll(component._beforecreate);
  	callAll(component._oncreate);
  	callAll(component._aftercreate);
  	component._lock = false;
  }

  function get$1() {
  	return this._state;
  }

  function init(component, options) {
  	component._handlers = blankObject();
  	component._slots = blankObject();
  	component._bind = options._bind;
  	component._staged = {};

  	component.options = options;
  	component.root = options.root || component;
  	component.store = options.store || component.root.store;

  	if (!options.root) {
  		component._beforecreate = [];
  		component._oncreate = [];
  		component._aftercreate = [];
  	}
  }

  function on(eventName, handler) {
  	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
  	handlers.push(handler);

  	return {
  		cancel: function cancel() {
  			var index = handlers.indexOf(handler);
  			if (~index) handlers.splice(index, 1);
  		}
  	};
  }

  function set$1(newState) {
  	this._set(assign({}, newState));
  	if (this.root._lock) return;
  	flush(this.root);
  }

  function _set(newState) {
  	var oldState = this._state,
  	    changed = {},
  	    dirty = false;

  	newState = assign(this._staged, newState);
  	this._staged = {};

  	for (var key in newState) {
  		if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
  	}
  	if (!dirty) return;

  	this._state = assign(assign({}, oldState), newState);
  	this._recompute(changed, this._state);
  	if (this._bind) this._bind(changed, this._state);

  	if (this._fragment) {
  		this.fire("state", { changed: changed, current: this._state, previous: oldState });
  		this._fragment.p(changed, this._state);
  		this.fire("update", { changed: changed, current: this._state, previous: oldState });
  	}
  }

  function _stage(newState) {
  	assign(this._staged, newState);
  }

  function setDev(newState) {
  	if ((typeof newState === 'undefined' ? 'undefined' : _typeof(newState)) !== 'object') {
  		throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
  	}

  	this._checkReadOnly(newState);
  	set$1.call(this, newState);
  }

  function callAll(fns) {
  	while (fns && fns.length) {
  		fns.shift()();
  	}
  }

  function _mount(target, anchor) {
  	this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
  }

  var protoDev = {
  	destroy: destroyDev,
  	get: get$1,
  	fire: fire,
  	on: on,
  	set: setDev,
  	_recompute: noop,
  	_set: _set,
  	_stage: _stage,
  	_mount: _mount,
  	_differs: _differs
  };

  /* src\Tristate.html generated by Svelte v2.16.1 */

  function included(_ref) {
  	var items = _ref.items,
  	    exclude$$1 = _ref.exclude;

  	return items.filter(function (_ref2, i) {
  		var checked = _ref2.checked;
  		return exclude$$1.indexOf(i) === -1;
  	});
  }

  function data() {
  	return {
  		items: [],
  		exclude: [],
  		state: 0
  	};
  }
  var methods = {
  	toggle: function toggle(e) {
  		e.stopPropagation();

  		var _get = this.get(),
  		    state = _get.state,
  		    included = _get.included,
  		    items = _get.items;

  		switch (state) {
  			case 0:
  			case 2:
  				included.forEach(function (item) {
  					item.checked = true;
  				});
  				this.set({ items: items });
  				break;
  			case 1:
  				included.forEach(function (item) {
  					item.checked = false;
  				});
  				this.set({ items: items });
  				break;
  			default:
  				break;
  		}
  	}
  };

  function onupdate(_ref3) {
  	var changed = _ref3.changed,
  	    current = _ref3.current;

  	if (changed.included) {
  		if (current.included.every(function (_ref4) {
  			var checked = _ref4.checked;
  			return checked;
  		})) {
  			this.set({ state: 1 });
  		} else if (current.included.every(function (_ref5) {
  			var checked = _ref5.checked;
  			return !checked;
  		})) {
  			this.set({ state: 0 });
  		} else {
  			this.set({ state: 2 });
  		}
  	}
  }
  var file = "src\\Tristate.html";

  function create_main_fragment(component, ctx) {
  	var i, current;

  	function click_handler(event) {
  		component.toggle(event);
  	}

  	return {
  		c: function create() {
  			i = createElement("i");
  			addListener(i, "click", click_handler);
  			i.className = "scanex-tristate";
  			toggleClass(i, "selected", ctx.state === 1);
  			toggleClass(i, "unselected", ctx.state === 0);
  			toggleClass(i, "indeterminate", ctx.state === 2);
  			addLoc(i, file, 0, 0, 0);
  		},

  		m: function mount(target, anchor) {
  			insert(target, i, anchor);
  			current = true;
  		},

  		p: function update(changed, ctx) {
  			if (changed.state) {
  				toggleClass(i, "selected", ctx.state === 1);
  				toggleClass(i, "unselected", ctx.state === 0);
  				toggleClass(i, "indeterminate", ctx.state === 2);
  			}
  		},

  		i: function intro(target, anchor) {
  			if (current) return;

  			this.m(target, anchor);
  		},

  		o: run,

  		d: function destroy$$1(detach) {
  			if (detach) {
  				detachNode(i);
  			}

  			removeListener(i, "click", click_handler);
  		}
  	};
  }

  function Tristate(options) {
  	var _this = this;

  	this._debugName = '<Tristate>';
  	if (!options || !options.target && !options.root) {
  		throw new Error("'target' is a required option");
  	}

  	init(this, options);
  	this._state = assign(data(), options.data);

  	this._recompute({ items: 1, exclude: 1 }, this._state);
  	if (!('items' in this._state)) console.warn("<Tristate> was created without expected data property 'items'");
  	if (!('exclude' in this._state)) console.warn("<Tristate> was created without expected data property 'exclude'");
  	if (!('state' in this._state)) console.warn("<Tristate> was created without expected data property 'state'");
  	this._intro = !!options.intro;
  	this._handlers.update = [onupdate];

  	this._fragment = create_main_fragment(this, this._state);

  	this.root._oncreate.push(function () {
  		_this.fire("update", { changed: assignTrue({}, _this._state), current: _this._state });
  	});

  	if (options.target) {
  		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		this._fragment.c();
  		this._mount(options.target, options.anchor);

  		flush(this);
  	}

  	this._intro = true;
  }

  assign(Tristate.prototype, protoDev);
  assign(Tristate.prototype, methods);

  Tristate.prototype._checkReadOnly = function _checkReadOnly(newState) {
  	if ('included' in newState && !this._updatingReadonlyProperty) throw new Error("<Tristate>: Cannot set read-only property 'included'");
  };

  Tristate.prototype._recompute = function _recompute(changed, state) {
  	if (changed.items || changed.exclude) {
  		if (this._differs(state.included, state.included = included(state))) changed.included = true;
  	}
  };

  /* demo\App.html generated by Svelte v2.16.1 */

  var items = [];
  var count = 10;

  for (var i = 0, c = 'A'.charCodeAt(0); i < count; ++i, ++c) {
  	items.push({ name: String.fromCharCode(c), checked: false });
  }

  function exclude$1(_ref) {
  	var source = _ref.source;

  	return [source];
  }

  function data$1() {
  	return {
  		items: items,
  		source: 0
  	};
  }
  var methods$1 = {
  	toggle: function toggle(e, i) {
  		e.stopPropagation();

  		var _get = this.get(),
  		    items = _get.items;

  		items[i].checked = !items[i].checked;
  		this.set({ items: items });
  	}
  };

  var file$1 = "demo\\App.html";

  function click_handler(event) {
  	var _svelte = this._svelte,
  	    component = _svelte.component,
  	    ctx = _svelte.ctx;


  	component.toggle(event, ctx.i);
  }

  function get_each_context(ctx, list, i) {
  	var child_ctx = Object.create(ctx);
  	child_ctx.item = list[i];
  	child_ctx.i = i;
  	return child_ctx;
  }

  function create_main_fragment$1(component, ctx) {
  	var div1,
  	    div0,
  	    tristate_updating = {},
  	    text,
  	    ul,
  	    current;

  	var tristate_initial_data = {};
  	if (ctx.items !== void 0) {
  		tristate_initial_data.items = ctx.items;
  		tristate_updating.items = true;
  	}
  	if (ctx.exclude !== void 0) {
  		tristate_initial_data.exclude = ctx.exclude;
  		tristate_updating.exclude = true;
  	}
  	var tristate = new Tristate({
  		root: component.root,
  		store: component.store,
  		data: tristate_initial_data,
  		_bind: function _bind(changed, childState) {
  			var newState = {};
  			if (!tristate_updating.items && changed.items) {
  				newState.items = childState.items;
  			}

  			if (!tristate_updating.exclude && changed.exclude) {
  				newState.exclude = childState.exclude;
  			}
  			component._set(newState);
  			tristate_updating = {};
  		}
  	});

  	component.root._beforecreate.push(function () {
  		tristate._bind({ items: 1, exclude: 1 }, tristate.get());
  	});

  	var each_value = ctx.items;

  	var each_blocks = [];

  	for (var i_1 = 0; i_1 < each_value.length; i_1 += 1) {
  		each_blocks[i_1] = create_each_block(component, get_each_context(ctx, each_value, i_1));
  	}

  	return {
  		c: function create() {
  			div1 = createElement("div");
  			div0 = createElement("div");
  			tristate._fragment.c();
  			text = createText("\r\n    ");
  			ul = createElement("ul");

  			for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
  				each_blocks[i_1].c();
  			}
  			addLoc(div0, file$1, 1, 4, 11);
  			ul.className = "items";
  			addLoc(ul, file$1, 4, 4, 80);
  			addLoc(div1, file$1, 0, 0, 0);
  		},

  		m: function mount(target, anchor) {
  			insert(target, div1, anchor);
  			append(div1, div0);
  			tristate._mount(div0, null);
  			append(div1, text);
  			append(div1, ul);

  			for (var i_1 = 0; i_1 < each_blocks.length; i_1 += 1) {
  				each_blocks[i_1].m(ul, null);
  			}

  			current = true;
  		},

  		p: function update(changed, _ctx) {
  			ctx = _ctx;
  			var tristate_changes = {};
  			if (!tristate_updating.items && changed.items) {
  				tristate_changes.items = ctx.items;
  				tristate_updating.items = ctx.items !== void 0;
  			}
  			if (!tristate_updating.exclude && changed.exclude) {
  				tristate_changes.exclude = ctx.exclude;
  				tristate_updating.exclude = ctx.exclude !== void 0;
  			}
  			tristate._set(tristate_changes);
  			tristate_updating = {};

  			if (changed.source || changed.items) {
  				each_value = ctx.items;

  				for (var i_1 = 0; i_1 < each_value.length; i_1 += 1) {
  					var child_ctx = get_each_context(ctx, each_value, i_1);

  					if (each_blocks[i_1]) {
  						each_blocks[i_1].p(changed, child_ctx);
  					} else {
  						each_blocks[i_1] = create_each_block(component, child_ctx);
  						each_blocks[i_1].c();
  						each_blocks[i_1].m(ul, null);
  					}
  				}

  				for (; i_1 < each_blocks.length; i_1 += 1) {
  					each_blocks[i_1].d(1);
  				}
  				each_blocks.length = each_value.length;
  			}
  		},

  		i: function intro(target, anchor) {
  			if (current) return;

  			this.m(target, anchor);
  		},

  		o: function outro(outrocallback) {
  			if (!current) return;

  			if (tristate) tristate._fragment.o(outrocallback);
  			current = false;
  		},

  		d: function destroy$$1(detach) {
  			if (detach) {
  				detachNode(div1);
  			}

  			tristate.destroy();

  			destroyEach(each_blocks, detach);
  		}
  	};
  }

  // (7:8) {#if i !== source}
  function create_if_block(component, ctx) {
  	var li,
  	    i_1,
  	    text0,
  	    span,
  	    text1_value = ctx.item.name,
  	    text1,
  	    text2;

  	return {
  		c: function create() {
  			li = createElement("li");
  			i_1 = createElement("i");
  			text0 = createText("\r\n            ");
  			span = createElement("span");
  			text1 = createText(text1_value);
  			text2 = createText("\r\n        ");
  			toggleClass(i_1, "selected", ctx.item.checked);
  			addLoc(i_1, file$1, 8, 12, 216);
  			addLoc(span, file$1, 9, 12, 267);

  			li._svelte = { component: component, ctx: ctx };

  			addListener(li, "click", click_handler);
  			addLoc(li, file$1, 7, 8, 170);
  		},

  		m: function mount(target, anchor) {
  			insert(target, li, anchor);
  			append(li, i_1);
  			append(li, text0);
  			append(li, span);
  			append(span, text1);
  			append(li, text2);
  		},

  		p: function update(changed, _ctx) {
  			ctx = _ctx;
  			if (changed.items) {
  				toggleClass(i_1, "selected", ctx.item.checked);
  			}

  			if (changed.items && text1_value !== (text1_value = ctx.item.name)) {
  				setData(text1, text1_value);
  			}

  			li._svelte.ctx = ctx;
  		},

  		d: function destroy$$1(detach) {
  			if (detach) {
  				detachNode(li);
  			}

  			removeListener(li, "click", click_handler);
  		}
  	};
  }

  // (6:8) {#each items as item, i}
  function create_each_block(component, ctx) {
  	var if_block_anchor;

  	var if_block = ctx.i !== ctx.source && create_if_block(component, ctx);

  	return {
  		c: function create() {
  			if (if_block) if_block.c();
  			if_block_anchor = createComment();
  		},

  		m: function mount(target, anchor) {
  			if (if_block) if_block.m(target, anchor);
  			insert(target, if_block_anchor, anchor);
  		},

  		p: function update(changed, ctx) {
  			if (ctx.i !== ctx.source) {
  				if (if_block) {
  					if_block.p(changed, ctx);
  				} else {
  					if_block = create_if_block(component, ctx);
  					if_block.c();
  					if_block.m(if_block_anchor.parentNode, if_block_anchor);
  				}
  			} else if (if_block) {
  				if_block.d(1);
  				if_block = null;
  			}
  		},

  		d: function destroy$$1(detach) {
  			if (if_block) if_block.d(detach);
  			if (detach) {
  				detachNode(if_block_anchor);
  			}
  		}
  	};
  }

  function App(options) {
  	this._debugName = '<App>';
  	if (!options || !options.target && !options.root) {
  		throw new Error("'target' is a required option");
  	}

  	init(this, options);
  	this._state = assign(data$1(), options.data);

  	this._recompute({ source: 1 }, this._state);
  	if (!('source' in this._state)) console.warn("<App> was created without expected data property 'source'");
  	if (!('items' in this._state)) console.warn("<App> was created without expected data property 'items'");
  	this._intro = !!options.intro;

  	this._fragment = create_main_fragment$1(this, this._state);

  	if (options.target) {
  		if (options.hydrate) throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
  		this._fragment.c();
  		this._mount(options.target, options.anchor);

  		flush(this);
  	}

  	this._intro = true;
  }

  assign(App.prototype, protoDev);
  assign(App.prototype, methods$1);

  App.prototype._checkReadOnly = function _checkReadOnly(newState) {
  	if ('exclude' in newState && !this._updatingReadonlyProperty) throw new Error("<App>: Cannot set read-only property 'exclude'");
  };

  App.prototype._recompute = function _recompute(changed, state) {
  	if (changed.source) {
  		if (this._differs(state.exclude, state.exclude = exclude$1(state))) changed.exclude = true;
  	}
  };

  return App;

}());
//# sourceMappingURL=main.js.map
