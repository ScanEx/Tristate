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

function insert(target, node, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function createElement(name) {
	return document.createElement(name);
}

function addListener(node, event, handler, options) {
	node.addEventListener(event, handler, options);
}

function removeListener(node, event, handler, options) {
	node.removeEventListener(event, handler, options);
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

function data() {
	return {
		items: [],
		state: 0
	};
}
var methods = {
	toggle: function toggle(e) {
		e.stopPropagation();

		var _get = this.get(),
		    state = _get.state,
		    items = _get.items;

		switch (state) {
			case 0:
			case 2:
				items.forEach(function (item) {
					item.checked = true;
				});
				this.set({ items: items });
				break;
			case 1:
				items.forEach(function (item) {
					item.checked = false;
				});
				this.set({ items: items });
				break;
			default:
				break;
		}
	}
};

function onupdate(_ref) {
	var changed = _ref.changed,
	    current = _ref.current;

	if (changed.items) {
		if (current.items.every(function (_ref2) {
			var checked = _ref2.checked;
			return checked;
		})) {
			this.set({ state: 1 });
		} else if (current.items.every(function (_ref3) {
			var checked = _ref3.checked;
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

Tristate.prototype._checkReadOnly = function _checkReadOnly(newState) {};

module.exports = Tristate;
//# sourceMappingURL=scanex-tristate.cjs.js.map