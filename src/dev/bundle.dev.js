/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports) {

	Date.prototype.Format = function (fmt) {
	    var o = {
	        "m+": this.getMonth() + 1,
	        "d+": this.getDate(),
	        "h+": this.getHours(),
	        "i+": this.getMinutes(),
	        "s+": this.getSeconds(),
	        "q+": Math.floor((this.getMonth() + 3) / 3),
	        "S": this.getMilliseconds()
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	(function(window) {
	    var re = {
	        not_string: /[^s]/,
	        number: /[diefg]/,
	        json: /[j]/,
	        not_json: /[^j]/,
	        text: /^[^\x25]+/,
	        modulo: /^\x25{2}/,
	        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
	        key: /^([a-z_][a-z_\d]*)/i,
	        key_access: /^\.([a-z_][a-z_\d]*)/i,
	        index_access: /^\[(\d+)\]/,
	        sign: /^[\+\-]/
	    }

	    function sprintf() {
	        var key = arguments[0], cache = sprintf.cache
	        if (!(cache[key] && cache.hasOwnProperty(key))) {
	            cache[key] = sprintf.parse(key)
	        }
	        return sprintf.format.call(null, cache[key], arguments)
	    }

	    sprintf.format = function(parse_tree, argv) {
	        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = ""
	        for (i = 0; i < tree_length; i++) {
	            node_type = get_type(parse_tree[i])
	            if (node_type === "string") {
	                output[output.length] = parse_tree[i]
	            }
	            else if (node_type === "array") {
	                match = parse_tree[i] // convenience purposes only
	                if (match[2]) { // keyword argument
	                    arg = argv[cursor]
	                    for (k = 0; k < match[2].length; k++) {
	                        if (!arg.hasOwnProperty(match[2][k])) {
	                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]))
	                        }
	                        arg = arg[match[2][k]]
	                    }
	                }
	                else if (match[1]) { // positional argument (explicit)
	                    arg = argv[match[1]]
	                }
	                else { // positional argument (implicit)
	                    arg = argv[cursor++]
	                }

	                if (get_type(arg) == "function") {
	                    arg = arg()
	                }

	                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && (get_type(arg) != "number" && isNaN(arg))) {
	                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)))
	                }

	                if (re.number.test(match[8])) {
	                    is_positive = arg >= 0
	                }

	                switch (match[8]) {
	                    case "b":
	                        arg = arg.toString(2)
	                    break
	                    case "c":
	                        arg = String.fromCharCode(arg)
	                    break
	                    case "d":
	                    case "i":
	                        arg = parseInt(arg, 10)
	                    break
	                    case "j":
	                        arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0)
	                    break
	                    case "e":
	                        arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential()
	                    break
	                    case "f":
	                        arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg)
	                    break
	                    case "g":
	                        arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg)
	                    break
	                    case "o":
	                        arg = arg.toString(8)
	                    break
	                    case "s":
	                        arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg)
	                    break
	                    case "u":
	                        arg = arg >>> 0
	                    break
	                    case "x":
	                        arg = arg.toString(16)
	                    break
	                    case "X":
	                        arg = arg.toString(16).toUpperCase()
	                    break
	                }
	                if (re.json.test(match[8])) {
	                    output[output.length] = arg
	                }
	                else {
	                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
	                        sign = is_positive ? "+" : "-"
	                        arg = arg.toString().replace(re.sign, "")
	                    }
	                    else {
	                        sign = ""
	                    }
	                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " "
	                    pad_length = match[6] - (sign + arg).length
	                    pad = match[6] ? (pad_length > 0 ? str_repeat(pad_character, pad_length) : "") : ""
	                    output[output.length] = match[5] ? sign + arg + pad : (pad_character === "0" ? sign + pad + arg : pad + sign + arg)
	                }
	            }
	        }
	        return output.join("")
	    }

	    sprintf.cache = {}

	    sprintf.parse = function(fmt) {
	        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0
	        while (_fmt) {
	            if ((match = re.text.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = match[0]
	            }
	            else if ((match = re.modulo.exec(_fmt)) !== null) {
	                parse_tree[parse_tree.length] = "%"
	            }
	            else if ((match = re.placeholder.exec(_fmt)) !== null) {
	                if (match[2]) {
	                    arg_names |= 1
	                    var field_list = [], replacement_field = match[2], field_match = []
	                    if ((field_match = re.key.exec(replacement_field)) !== null) {
	                        field_list[field_list.length] = field_match[1]
	                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
	                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1]
	                            }
	                            else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
	                                field_list[field_list.length] = field_match[1]
	                            }
	                            else {
	                                throw new SyntaxError("[sprintf] failed to parse named argument key")
	                            }
	                        }
	                    }
	                    else {
	                        throw new SyntaxError("[sprintf] failed to parse named argument key")
	                    }
	                    match[2] = field_list
	                }
	                else {
	                    arg_names |= 2
	                }
	                if (arg_names === 3) {
	                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported")
	                }
	                parse_tree[parse_tree.length] = match
	            }
	            else {
	                throw new SyntaxError("[sprintf] unexpected placeholder")
	            }
	            _fmt = _fmt.substring(match[0].length)
	        }
	        return parse_tree
	    }

	    var vsprintf = function(fmt, argv, _argv) {
	        _argv = (argv || []).slice(0)
	        _argv.splice(0, 0, fmt)
	        return sprintf.apply(null, _argv)
	    }

	    /**
	     * helpers
	     */
	    function get_type(variable) {
	        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase()
	    }

	    function str_repeat(input, multiplier) {
	        return Array(multiplier + 1).join(input)
	    }

	    /**
	     * export to either browser or node.js
	     */
	    if (true) {
	        exports.sprintf = sprintf
	        exports.vsprintf = vsprintf
	    }
	    else {
	        window.sprintf = sprintf
	        window.vsprintf = vsprintf

	        if (typeof define === "function" && define.amd) {
	            define(function() {
	                return {
	                    sprintf: sprintf,
	                    vsprintf: vsprintf
	                }
	            })
	        }
	    }
	})(typeof window === "undefined" ? this : window);


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* Zepto v1.0rc1 - polyfill zepto event detect fx ajax form touch - zeptojs.com/license */
	;(function(undefined){
	  if (String.prototype.trim === undefined) // fix for iOS 3.2
	    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') }

	  // For iOS 3.x
	  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
	  if (Array.prototype.reduce === undefined)
	    Array.prototype.reduce = function(fun){
	      if(this === void 0 || this === null) throw new TypeError()
	      var t = Object(this), len = t.length >>> 0, k = 0, accumulator
	      if(typeof fun != 'function') throw new TypeError()
	      if(len == 0 && arguments.length == 1) throw new TypeError()

	      if(arguments.length >= 2)
	       accumulator = arguments[1]
	      else
	        do{
	          if(k in t){
	            accumulator = t[k++]
	            break
	          }
	          if(++k >= len) throw new TypeError()
	        } while (true)

	      while (k < len){
	        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
	        k++
	      }
	      return accumulator
	    }

	})()
	var Zepto = (function() {
	  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice,
	    document = window.document,
	    elementDisplay = {}, classCache = {},
	    getComputedStyle = document.defaultView.getComputedStyle,
	    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
	    fragmentRE = /^\s*<(\w+|!)[^>]*>/,

	    // Used by `$.zepto.init` to wrap elements, text/comment nodes, document,
	    // and document fragment node types.
	    elementTypes = [1, 3, 8, 9, 11],

	    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
	    table = document.createElement('table'),
	    tableRow = document.createElement('tr'),
	    containers = {
	      'tr': document.createElement('tbody'),
	      'tbody': table, 'thead': table, 'tfoot': table,
	      'td': tableRow, 'th': tableRow,
	      '*': document.createElement('div')
	    },
	    readyRE = /complete|loaded|interactive/,
	    classSelectorRE = /^\.([\w-]+)$/,
	    idSelectorRE = /^#([\w-]+)$/,
	    tagSelectorRE = /^[\w-]+$/,
	    toString = ({}).toString,
	    zepto = {},
	    camelize, uniq,
	    tempParent = document.createElement('div')

	  zepto.matches = function(element, selector) {
	    if (!element || element.nodeType !== 1) return false
	    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
	                          element.oMatchesSelector || element.matchesSelector
	    if (matchesSelector) return matchesSelector.call(element, selector)
	    // fall back to performing a selector:
	    var match, parent = element.parentNode, temp = !parent
	    if (temp) (parent = tempParent).appendChild(element)
	    match = ~zepto.qsa(parent, selector).indexOf(element)
	    temp && tempParent.removeChild(element)
	    return match
	  }

	  function isFunction(value) { return toString.call(value) == "[object Function]" }
	  function isObject(value) { return value instanceof Object }
	  function isPlainObject(value) {
	    var key, ctor
	    if (toString.call(value) !== "[object Object]") return false
	    ctor = (isFunction(value.constructor) && value.constructor.prototype)
	    if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) return false
	    for (key in value);
	    return key === undefined || hasOwnProperty.call(value, key)
	  }
	  function isArray(value) { return value instanceof Array }
	  function likeArray(obj) { return typeof obj.length == 'number' }

	  function compact(array) { return array.filter(function(item){ return item !== undefined && item !== null }) }
	  function flatten(array) { return array.length > 0 ? [].concat.apply([], array) : array }
	  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
	  function dasherize(str) {
	    return str.replace(/::/g, '/')
	           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	           .replace(/_/g, '-')
	           .toLowerCase()
	  }
	  uniq = function(array){ return array.filter(function(item, idx){ return array.indexOf(item) == idx }) }

	  function classRE(name) {
	    return name in classCache ?
	      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
	  }

	  function maybeAddPx(name, value) {
	    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
	  }

	  function defaultDisplay(nodeName) {
	    var element, display
	    if (!elementDisplay[nodeName]) {
	      element = document.createElement(nodeName)
	      document.body.appendChild(element)
	      display = getComputedStyle(element, '').getPropertyValue("display")
	      element.parentNode.removeChild(element)
	      display == "none" && (display = "block")
	      elementDisplay[nodeName] = display
	    }
	    return elementDisplay[nodeName]
	  }

	  // `$.zepto.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overriden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  zepto.fragment = function(html, name) {
	    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
	    if (!(name in containers)) name = '*'
	    var container = containers[name]
	    container.innerHTML = '' + html
	    return $.each(slice.call(container.childNodes), function(){
	      container.removeChild(this)
	    })
	  }

	  // `$.zepto.Z` swaps out the prototype of the given `dom` array
	  // of nodes with `$.fn` and thus supplying all the Zepto functions
	  // to the array. Note that `__proto__` is not supported on Internet
	  // Explorer. This method can be overriden in plugins.
	  zepto.Z = function(dom, selector) {
	    dom = dom || []
	    dom.__proto__ = arguments.callee.prototype
	    dom.selector = selector || ''
	    return dom
	  }

	  // `$.zepto.isZ` should return `true` if the given object is a Zepto
	  // collection. This method can be overriden in plugins.
	  zepto.isZ = function(object) {
	    return object instanceof zepto.Z
	  }

	  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	  // takes a CSS selector and an optional context (and handles various
	  // special cases).
	  // This method can be overriden in plugins.
	  zepto.init = function(selector, context) {
	    // If nothing given, return an empty Zepto collection
	    if (!selector) return zepto.Z()
	    // If a function is given, call it when the DOM is ready
	    else if (isFunction(selector)) return $(document).ready(selector)
	    // If a Zepto collection is given, juts return it
	    else if (zepto.isZ(selector)) return selector
	    else {
	      var dom
	      // normalize array if an array of nodes is given
	      if (isArray(selector)) dom = compact(selector)
	      // if a JavaScript object is given, return a copy of it
	      // this is a somewhat peculiar option, but supported by
	      // jQuery so we'll do it, too
	      else if (isPlainObject(selector))
	        dom = [$.extend({}, selector)], selector = null
	      // wrap stuff like `document` or `window`
	      else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
	        dom = [selector], selector = null
	      // If it's a html fragment, create nodes from it
	      else if (fragmentRE.test(selector))
	        dom = zepto.fragment(selector.trim(), RegExp.$1), selector = null
	      // If there's a context, create a collection on that context first, and select
	      // nodes from there
	      else if (context !== undefined) return $(context).find(selector)
	      // And last but no least, if it's a CSS selector, use it to select nodes.
	      else dom = zepto.qsa(document, selector)
	      // create a new Zepto collection from the nodes found
	      return zepto.Z(dom, selector)
	    }
	  }

	  // `$` will be the base `Zepto` object. When calling this
	  // function just call `$.zepto.init, whichs makes the implementation
	  // details of selecting nodes and creating Zepto collections
	  // patchable in plugins.
	  $ = function(selector, context){
	    return zepto.init(selector, context)
	  }

	  // Copy all but undefined properties from one or more
	  // objects to the `target` object.
	  $.extend = function(target){
	    slice.call(arguments, 1).forEach(function(source) {
	      for (key in source)
	        if (source[key] !== undefined)
	          target[key] = source[key]
	    })
	    return target
	  }

	  // `$.zepto.qsa` is Zepto's CSS selector implementation which
	  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	  // This method can be overriden in plugins.
	  zepto.qsa = function(element, selector){
	    var found
	    return (element === document && idSelectorRE.test(selector)) ?
	      ( (found = element.getElementById(RegExp.$1)) ? [found] : emptyArray ) :
	      (element.nodeType !== 1 && element.nodeType !== 9) ? emptyArray :
	      slice.call(
	        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
	        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
	        element.querySelectorAll(selector)
	      )
	  }

	  function filtered(nodes, selector) {
	    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
	  }

	  function funcArg(context, arg, idx, payload) {
	   return isFunction(arg) ? arg.call(context, idx, payload) : arg
	  }

	  $.isFunction = isFunction
	  $.isObject = isObject
	  $.isArray = isArray
	  $.isPlainObject = isPlainObject

	  $.inArray = function(elem, array, i){
	    return emptyArray.indexOf.call(array, elem, i)
	  }

	  $.trim = function(str) { return str.trim() }

	  // plugin compatibility
	  $.uuid = 0

	  $.map = function(elements, callback){
	    var value, values = [], i, key
	    if (likeArray(elements))
	      for (i = 0; i < elements.length; i++) {
	        value = callback(elements[i], i)
	        if (value != null) values.push(value)
	      }
	    else
	      for (key in elements) {
	        value = callback(elements[key], key)
	        if (value != null) values.push(value)
	      }
	    return flatten(values)
	  }

	  $.each = function(elements, callback){
	    var i, key
	    if (likeArray(elements)) {
	      for (i = 0; i < elements.length; i++)
	        if (callback.call(elements[i], i, elements[i]) === false) return elements
	    } else {
	      for (key in elements)
	        if (callback.call(elements[key], key, elements[key]) === false) return elements
	    }

	    return elements
	  }

	  // Define methods that will be available on all
	  // Zepto collections
	  $.fn = {
	    // Because a collection acts like an array
	    // copy over these useful array functions.
	    forEach: emptyArray.forEach,
	    reduce: emptyArray.reduce,
	    push: emptyArray.push,
	    indexOf: emptyArray.indexOf,
	    concat: emptyArray.concat,

	    // `map` and `slice` in the jQuery API work differently
	    // from their array counterparts
	    map: function(fn){
	      return $.map(this, function(el, i){ return fn.call(el, i, el) })
	    },
	    slice: function(){
	      return $(slice.apply(this, arguments))
	    },

	    ready: function(callback){
	      if (readyRE.test(document.readyState)) callback($)
	      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
	      return this
	    },
	    get: function(idx){
	      return idx === undefined ? slice.call(this) : this[idx]
	    },
	    toArray: function(){ return this.get() },
	    size: function(){
	      return this.length
	    },
	    remove: function(){
	      return this.each(function(){
	        if (this.parentNode != null)
	          this.parentNode.removeChild(this)
	      })
	    },
	    each: function(callback){
	      this.forEach(function(el, idx){ callback.call(el, idx, el) })
	      return this
	    },
	    filter: function(selector){
	      return $([].filter.call(this, function(element){
	        return zepto.matches(element, selector)
	      }))
	    },
	    add: function(selector,context){
	      return $(uniq(this.concat($(selector,context))))
	    },
	    is: function(selector){
	      return this.length > 0 && zepto.matches(this[0], selector)
	    },
	    not: function(selector){
	      var nodes=[]
	      if (isFunction(selector) && selector.call !== undefined)
	        this.each(function(idx){
	          if (!selector.call(this,idx)) nodes.push(this)
	        })
	      else {
	        var excludes = typeof selector == 'string' ? this.filter(selector) :
	          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
	        this.forEach(function(el){
	          if (excludes.indexOf(el) < 0) nodes.push(el)
	        })
	      }
	      return $(nodes)
	    },
	    eq: function(idx){
	      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
	    },
	    first: function(){
	      var el = this[0]
	      return el && !isObject(el) ? el : $(el)
	    },
	    last: function(){
	      var el = this[this.length - 1]
	      return el && !isObject(el) ? el : $(el)
	    },
	    find: function(selector){
	      var result
	      if (this.length == 1) result = zepto.qsa(this[0], selector)
	      else result = this.map(function(){ return zepto.qsa(this, selector) })
	      return $(result)
	    },
	    closest: function(selector, context){
	      var node = this[0]
	      while (node && !zepto.matches(node, selector))
	        node = node !== context && node !== document && node.parentNode
	      return $(node)
	    },
	    parents: function(selector){
	      var ancestors = [], nodes = this
	      while (nodes.length > 0)
	        nodes = $.map(nodes, function(node){
	          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
	            ancestors.push(node)
	            return node
	          }
	        })
	      return filtered(ancestors, selector)
	    },
	    parent: function(selector){
	      return filtered(uniq(this.pluck('parentNode')), selector)
	    },
	    children: function(selector){
	      return filtered(this.map(function(){ return slice.call(this.children) }), selector)
	    },
	    siblings: function(selector){
	      return filtered(this.map(function(i, el){
	        return slice.call(el.parentNode.children).filter(function(child){ return child!==el })
	      }), selector)
	    },
	    empty: function(){
	      return this.each(function(){ this.innerHTML = '' })
	    },
	    // `pluck` is borrowed from Prototype.js
	    pluck: function(property){
	      return this.map(function(){ return this[property] })
	    },
	    show: function(){
	      return this.each(function(){
	        this.style.display == "none" && (this.style.display = null)
	        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
	          this.style.display = defaultDisplay(this.nodeName)
	      })
	    },
	    replaceWith: function(newContent){
	      return this.before(newContent).remove()
	    },
	    wrap: function(newContent){
	      return this.each(function(){
	        $(this).wrapAll($(newContent)[0].cloneNode(false))
	      })
	    },
	    wrapAll: function(newContent){
	      if (this[0]) {
	        $(this[0]).before(newContent = $(newContent))
	        newContent.append(this)
	      }
	      return this
	    },
	    unwrap: function(){
	      this.parent().each(function(){
	        $(this).replaceWith($(this).children())
	      })
	      return this
	    },
	    clone: function(){
	      return $(this.map(function(){ return this.cloneNode(true) }))
	    },
	    hide: function(){
	      return this.css("display", "none")
	    },
	    toggle: function(setting){
	      return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide()
	    },
	    prev: function(){ return $(this.pluck('previousElementSibling')) },
	    next: function(){ return $(this.pluck('nextElementSibling')) },
	    html: function(html){
	      return html === undefined ?
	        (this.length > 0 ? this[0].innerHTML : null) :
	        this.each(function(idx){
	          var originHtml = this.innerHTML
	          $(this).empty().append( funcArg(this, html, idx, originHtml) )
	        })
	    },
	    text: function(text){
	      return text === undefined ?
	        (this.length > 0 ? this[0].textContent : null) :
	        this.each(function(){ this.textContent = text })
	    },
	    attr: function(name, value){
	      var result
	      return (typeof name == 'string' && value === undefined) ?
	        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
	          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
	          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	        ) :
	        this.each(function(idx){
	          if (this.nodeType !== 1) return
	          if (isObject(name)) for (key in name) this.setAttribute(key, name[key])
	          else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)))
	        })
	    },
	    removeAttr: function(name){
	      return this.each(function(){ if (this.nodeType === 1) this.removeAttribute(name) })
	    },
	    prop: function(name, value){
	      return (value === undefined) ?
	        (this[0] ? this[0][name] : undefined) :
	        this.each(function(idx){
	          this[name] = funcArg(this, value, idx, this[name])
	        })
	    },
	    data: function(name, value){
	      var data = this.attr('data-' + dasherize(name), value)
	      return data !== null ? data : undefined
	    },
	    val: function(value){
	      return (value === undefined) ?
	        (this.length > 0 ? this[0].value : undefined) :
	        this.each(function(idx){
	          this.value = funcArg(this, value, idx, this.value)
	        })
	    },
	    offset: function(){
	      if (this.length==0) return null
	      var obj = this[0].getBoundingClientRect()
	      return {
	        left: obj.left + window.pageXOffset,
	        top: obj.top + window.pageYOffset,
	        width: obj.width,
	        height: obj.height
	      }
	    },
	    css: function(property, value){
	      if (value === undefined && typeof property == 'string')
	        return (
	          this.length == 0
	            ? undefined
	            : this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

	      var css = ''
	      for (key in property)
	        if(typeof property[key] == 'string' && property[key] == '')
	          this.each(function(){ this.style.removeProperty(dasherize(key)) })
	        else
	          css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'

	      if (typeof property == 'string')
	        if (value == '')
	          this.each(function(){ this.style.removeProperty(dasherize(property)) })
	        else
	          css = dasherize(property) + ":" + maybeAddPx(property, value)

	      return this.each(function(){ this.style.cssText += ';' + css })
	    },
	    index: function(element){
	      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
	    },
	    hasClass: function(name){
	      if (this.length < 1) return false
	      else return classRE(name).test(this[0].className)
	    },
	    addClass: function(name){
	      return this.each(function(idx){
	        classList = []
	        var cls = this.className, newName = funcArg(this, name, idx, cls)
	        newName.split(/\s+/g).forEach(function(klass){
	          if (!$(this).hasClass(klass)) classList.push(klass)
	        }, this)
	        classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
	      })
	    },
	    removeClass: function(name){
	      return this.each(function(idx){
	        if (name === undefined)
	          return this.className = ''
	        classList = this.className
	        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
	          classList = classList.replace(classRE(klass), " ")
	        })
	        this.className = classList.trim()
	      })
	    },
	    toggleClass: function(name, when){
	      return this.each(function(idx){
	        var newName = funcArg(this, name, idx, this.className)
	        ;(when === undefined ? !$(this).hasClass(newName) : when) ?
	          $(this).addClass(newName) : $(this).removeClass(newName)
	      })
	    }
	  }

	  // Generate the `width` and `height` functions
	  ;['width', 'height'].forEach(function(dimension){
	    $.fn[dimension] = function(value){
	      var offset, Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
	      if (value === undefined) return this[0] == window ? window['inner' + Dimension] :
	        this[0] == document ? document.documentElement['offset' + Dimension] :
	        (offset = this.offset()) && offset[dimension]
	      else return this.each(function(idx){
	        var el = $(this)
	        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
	      })
	    }
	  })

	  function insert(operator, target, node) {
	    var parent = (operator % 2) ? target : target.parentNode
	    parent ? parent.insertBefore(node,
	      !operator ? target.nextSibling :      // after
	      operator == 1 ? parent.firstChild :   // prepend
	      operator == 2 ? target :              // before
	      null) :                               // append
	      $(node).remove()
	  }

	  function traverseNode(node, fun) {
	    fun(node)
	    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
	  }

	  // Generate the `after`, `prepend`, `before`, `append`,
	  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	  adjacencyOperators.forEach(function(key, operator) {
	    $.fn[key] = function(){
	      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	      var nodes = $.map(arguments, function(n){ return isObject(n) ? n : zepto.fragment(n) })
	      if (nodes.length < 1) return this
	      var size = this.length, copyByClone = size > 1, inReverse = operator < 2

	      return this.each(function(index, target){
	        for (var i = 0; i < nodes.length; i++) {
	          var node = nodes[inReverse ? nodes.length-i-1 : i]
	          traverseNode(node, function(node){
	            if (node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' && (!node.type || node.type === 'text/javascript'))
	              window['eval'].call(window, node.innerHTML)
	          })
	          if (copyByClone && index < size - 1) node = node.cloneNode(true)
	          insert(operator, target, node)
	        }
	      })
	    }

	    $.fn[(operator % 2) ? key+'To' : 'insert'+(operator ? 'Before' : 'After')] = function(html){
	      $(html)[key](this)
	      return this
	    }
	  })

	  zepto.Z.prototype = $.fn

	  // Export internal API functions in the `$.zepto` namespace
	  zepto.camelize = camelize
	  zepto.uniq = uniq
	  $.zepto = zepto

	  return $
	})()

	// If `$` is not yet defined, point it to `Zepto`
	window.Zepto = Zepto
	'$' in window || (window.$ = Zepto)
	;(function($){
	  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={}

	  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

	  function zid(element) {
	    return element._zid || (element._zid = _zid++)
	  }
	  function findHandlers(element, event, fn, selector) {
	    event = parse(event)
	    if (event.ns) var matcher = matcherFor(event.ns)
	    return (handlers[zid(element)] || []).filter(function(handler) {
	      return handler
	        && (!event.e  || handler.e == event.e)
	        && (!event.ns || matcher.test(handler.ns))
	        && (!fn       || zid(handler.fn) === zid(fn))
	        && (!selector || handler.sel == selector)
	    })
	  }
	  function parse(event) {
	    var parts = ('' + event).split('.')
	    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
	  }
	  function matcherFor(ns) {
	    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
	  }

	  function eachEvent(events, fn, iterator){
	    if ($.isObject(events)) $.each(events, iterator)
	    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
	  }

	  function add(element, events, fn, selector, getDelegate, capture){
	    capture = !!capture
	    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
	    eachEvent(events, fn, function(event, fn){
	      var delegate = getDelegate && getDelegate(fn, event),
	        callback = delegate || fn
	      var proxyfn = function (event) {
	        var result = callback.apply(element, [event].concat(event.data))
	        if (result === false) event.preventDefault()
	        return result
	      }
	      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length})
	      set.push(handler)
	      element.addEventListener(handler.e, proxyfn, capture)
	    })
	  }
	  function remove(element, events, fn, selector){
	    var id = zid(element)
	    eachEvent(events || '', fn, function(event, fn){
	      findHandlers(element, event, fn, selector).forEach(function(handler){
	        delete handlers[id][handler.i]
	        element.removeEventListener(handler.e, handler.proxy, false)
	      })
	    })
	  }

	  $.event = { add: add, remove: remove }

	  $.proxy = function(fn, context) {
	    if ($.isFunction(fn)) {
	      var proxyFn = function(){ return fn.apply(context, arguments) }
	      proxyFn._zid = zid(fn)
	      return proxyFn
	    } else if (typeof context == 'string') {
	      return $.proxy(fn[context], fn)
	    } else {
	      throw new TypeError("expected function")
	    }
	  }

	  $.fn.bind = function(event, callback){
	    return this.each(function(){
	      add(this, event, callback)
	    })
	  }
	  $.fn.unbind = function(event, callback){
	    return this.each(function(){
	      remove(this, event, callback)
	    })
	  }
	  $.fn.one = function(event, callback){
	    return this.each(function(i, element){
	      add(this, event, callback, null, function(fn, type){
	        return function(){
	          var result = fn.apply(element, arguments)
	          remove(element, type, fn)
	          return result
	        }
	      })
	    })
	  }

	  var returnTrue = function(){return true},
	      returnFalse = function(){return false},
	      eventMethods = {
	        preventDefault: 'isDefaultPrevented',
	        stopImmediatePropagation: 'isImmediatePropagationStopped',
	        stopPropagation: 'isPropagationStopped'
	      }
	  function createProxy(event) {
	    var proxy = $.extend({originalEvent: event}, event)
	    $.each(eventMethods, function(name, predicate) {
	      proxy[name] = function(){
	        this[predicate] = returnTrue
	        return event[name].apply(event, arguments)
	      }
	      proxy[predicate] = returnFalse
	    })
	    return proxy
	  }

	  // emulates the 'defaultPrevented' property for browsers that have none
	  function fix(event) {
	    if (!('defaultPrevented' in event)) {
	      event.defaultPrevented = false
	      var prevent = event.preventDefault
	      event.preventDefault = function() {
	        this.defaultPrevented = true
	        prevent.call(this)
	      }
	    }
	  }

	  $.fn.delegate = function(selector, event, callback){
	    var capture = false
	    if(event == 'blur' || event == 'focus'){
	      if($.iswebkit)
	        event = event == 'blur' ? 'focusout' : event == 'focus' ? 'focusin' : event
	      else
	        capture = true
	    }

	    return this.each(function(i, element){
	      add(element, event, callback, selector, function(fn){
	        return function(e){
	          var evt, match = $(e.target).closest(selector, element).get(0)
	          if (match) {
	            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
	            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
	          }
	        }
	      }, capture)
	    })
	  }
	  $.fn.undelegate = function(selector, event, callback){
	    return this.each(function(){
	      remove(this, event, callback, selector)
	    })
	  }

	  $.fn.live = function(event, callback){
	    $(document.body).delegate(this.selector, event, callback)
	    return this
	  }
	  $.fn.die = function(event, callback){
	    $(document.body).undelegate(this.selector, event, callback)
	    return this
	  }

	  $.fn.on = function(event, selector, callback){
	    return selector == undefined || $.isFunction(selector) ?
	      this.bind(event, selector) : this.delegate(selector, event, callback)
	  }
	  $.fn.off = function(event, selector, callback){
	    return selector == undefined || $.isFunction(selector) ?
	      this.unbind(event, selector) : this.undelegate(selector, event, callback)
	  }

	  $.fn.trigger = function(event, data){
	    if (typeof event == 'string') event = $.Event(event)
	    fix(event)
	    event.data = data
	    return this.each(function(){
	      // items in the collection might not be DOM elements
	      // (todo: possibly support events on plain old objects)
	      if('dispatchEvent' in this) this.dispatchEvent(event)
	    })
	  }

	  // triggers event handlers on current element just as if an event occurred,
	  // doesn't trigger an actual event, doesn't bubble
	  $.fn.triggerHandler = function(event, data){
	    var e, result
	    this.each(function(i, element){
	      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
	      e.data = data
	      e.target = element
	      $.each(findHandlers(element, event.type || event), function(i, handler){
	        result = handler.proxy(e)
	        if (e.isImmediatePropagationStopped()) return false
	      })
	    })
	    return result
	  }

	  // shortcut methods for `.bind(event, fn)` for each event type
	  ;('focusin focusout load resize scroll unload click dblclick '+
	  'mousedown mouseup mousemove mouseover mouseout '+
	  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
	    $.fn[event] = function(callback){ return this.bind(event, callback) }
	  })

	  ;['focus', 'blur'].forEach(function(name) {
	    $.fn[name] = function(callback) {
	      if (callback) this.bind(name, callback)
	      else if (this.length) try { this.get(0)[name]() } catch(e){}
	      return this
	    }
	  })

	  $.Event = function(type, props) {
	    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
	    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
	    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
	    return event
	  }

	})(Zepto)
	;(function($){
	  function detect(ua){
	    var os = this.os = {}, browser = this.browser = {},
	      webkit = ua.match(/WebKit\/([\d.]+)/),
	      android = ua.match(/(Android)\s+([\d.]+)/),
	      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
	      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
	      touchpad = webos && ua.match(/TouchPad/),
	      kindle = ua.match(/Kindle\/([\d.]+)/),
	      silk = ua.match(/Silk\/([\d._]+)/),
	      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/)

	    // todo clean this up with a better OS/browser
	    // separation. we need to discern between multiple
	    // browsers on android, and decide if kindle fire in
	    // silk mode is android or not

	    if (browser.webkit = !!webkit) browser.version = webkit[1]

	    if (android) os.android = true, os.version = android[2]
	    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
	    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
	    if (webos) os.webos = true, os.version = webos[2]
	    if (touchpad) os.touchpad = true
	    if (blackberry) os.blackberry = true, os.version = blackberry[2]
	    if (kindle) os.kindle = true, os.version = kindle[1]
	    if (silk) browser.silk = true, browser.version = silk[1]
	    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
	  }

	  detect.call($, navigator.userAgent)
	  // make available to unit tests
	  $.__detect = detect

	})(Zepto)
	;(function($, undefined){
	  var prefix = '', eventPrefix, endEventName, endAnimationName,
	    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
	    document = window.document, testEl = document.createElement('div'),
	    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	    clearProperties = {}

	  function downcase(str) { return str.toLowerCase() }
	  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

	  $.each(vendors, function(vendor, event){
	    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
	      prefix = '-' + downcase(vendor) + '-'
	      eventPrefix = event
	      return false
	    }
	  })

	  clearProperties[prefix + 'transition-property'] =
	  clearProperties[prefix + 'transition-duration'] =
	  clearProperties[prefix + 'transition-timing-function'] =
	  clearProperties[prefix + 'animation-name'] =
	  clearProperties[prefix + 'animation-duration'] = ''

	  $.fx = {
	    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
	    cssPrefix: prefix,
	    transitionEnd: normalizeEvent('TransitionEnd'),
	    animationEnd: normalizeEvent('AnimationEnd')
	  }

	  $.fn.animate = function(properties, duration, ease, callback){
	    if ($.isObject(duration))
	      ease = duration.easing, callback = duration.complete, duration = duration.duration
	    if (duration) duration = duration / 1000
	    return this.anim(properties, duration, ease, callback)
	  }

	  $.fn.anim = function(properties, duration, ease, callback){
	    var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd
	    if (duration === undefined) duration = 0.4
	    if ($.fx.off) duration = 0

	    if (typeof properties == 'string') {
	      // keyframe animation
	      cssProperties[prefix + 'animation-name'] = properties
	      cssProperties[prefix + 'animation-duration'] = duration + 's'
	      endEvent = $.fx.animationEnd
	    } else {
	      // CSS transitions
	      for (key in properties)
	        if (supportedTransforms.test(key)) {
	          transforms || (transforms = [])
	          transforms.push(key + '(' + properties[key] + ')')
	        }
	        else cssProperties[key] = properties[key]

	      if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ')
	      if (!$.fx.off && typeof properties === 'object') {
	        cssProperties[prefix + 'transition-property'] = Object.keys(properties).join(', ')
	        cssProperties[prefix + 'transition-duration'] = duration + 's'
	        cssProperties[prefix + 'transition-timing-function'] = (ease || 'linear')
	      }
	    }

	    wrappedCallback = function(event){
	      if (typeof event !== 'undefined') {
	        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
	        $(event.target).unbind(endEvent, arguments.callee)
	      }
	      $(this).css(clearProperties)
	      callback && callback.call(this)
	    }
	    if (duration > 0) this.bind(endEvent, wrappedCallback)

	    setTimeout(function() {
	      that.css(cssProperties)
	      if (duration <= 0) setTimeout(function() {
	        that.each(function(){ wrappedCallback.call(this) })
	      }, 0)
	    }, 0)

	    return this
	  }

	  testEl = null
	})(Zepto)
	;(function($){
	  var jsonpID = 0,
	      isObject = $.isObject,
	      document = window.document,
	      key,
	      name,
	      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	      scriptTypeRE = /^(?:text|application)\/javascript/i,
	      xmlTypeRE = /^(?:text|application)\/xml/i,
	      jsonType = 'application/json',
	      htmlType = 'text/html',
	      blankRE = /^\s*$/

	  // trigger a custom event and return false if it was cancelled
	  function triggerAndReturn(context, eventName, data) {
	    var event = $.Event(eventName)
	    $(context).trigger(event, data)
	    return !event.defaultPrevented
	  }

	  // trigger an Ajax "global" event
	  function triggerGlobal(settings, context, eventName, data) {
	    if (settings.global) return triggerAndReturn(context || document, eventName, data)
	  }

	  // Number of active Ajax requests
	  $.active = 0

	  function ajaxStart(settings) {
	    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
	  }
	  function ajaxStop(settings) {
	    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
	  }

	  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	  function ajaxBeforeSend(xhr, settings) {
	    var context = settings.context
	    if (settings.beforeSend.call(context, xhr, settings) === false ||
	        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
	      return false

	    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
	  }
	  function ajaxSuccess(data, xhr, settings) {
	    var context = settings.context, status = 'success'
	    settings.success.call(context, data, status, xhr)
	    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
	    ajaxComplete(status, xhr, settings)
	  }
	  // type: "timeout", "error", "abort", "parsererror"
	  function ajaxError(error, type, xhr, settings) {
	    var context = settings.context
	    settings.error.call(context, xhr, type, error)
	    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
	    ajaxComplete(type, xhr, settings)
	  }
	  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	  function ajaxComplete(status, xhr, settings) {
	    var context = settings.context
	    settings.complete.call(context, xhr, status)
	    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
	    ajaxStop(settings)
	  }

	  // Empty function, used as default callback
	  function empty() {}

	  $.ajaxJSONP = function(options){
	    var callbackName = 'jsonp' + (++jsonpID),
	      script = document.createElement('script'),
	      abort = function(){
	        $(script).remove()
	        if (callbackName in window) window[callbackName] = empty
	        ajaxComplete('abort', xhr, options)
	      },
	      xhr = { abort: abort }, abortTimeout

	    if (options.error) script.onerror = function() {
	      xhr.abort()
	      options.error()
	    }

	    window[callbackName] = function(data){
	      clearTimeout(abortTimeout)
	      $(script).remove()
	      delete window[callbackName]
	      ajaxSuccess(data, xhr, options)
	    }

	    serializeData(options)
	    script.src = options.url.replace(/=\?/, '=' + callbackName)
	    $('head').append(script)

	    if (options.timeout > 0) abortTimeout = setTimeout(function(){
	        xhr.abort()
	        ajaxComplete('timeout', xhr, options)
	      }, options.timeout)

	    return xhr
	  }

	  $.ajaxSettings = {
	    // Default type of request
	    type: 'GET',
	    // Callback that is executed before request
	    beforeSend: empty,
	    // Callback that is executed if the request succeeds
	    success: empty,
	    // Callback that is executed the the server drops error
	    error: empty,
	    // Callback that is executed on request complete (both: error and success)
	    complete: empty,
	    // The context for the callbacks
	    context: null,
	    // Whether to trigger "global" Ajax events
	    global: true,
	    // Transport
	    xhr: function () {
	      return new window.XMLHttpRequest()
	    },
	    // MIME types mapping
	    accepts: {
	      script: 'text/javascript, application/javascript',
	      json:   jsonType,
	      xml:    'application/xml, text/xml',
	      html:   htmlType,
	      text:   'text/plain'
	    },
	    // Whether the request is to another domain
	    crossDomain: false,
	    // Default timeout
	    timeout: 0
	  }

	  function mimeToDataType(mime) {
	    return mime && ( mime == htmlType ? 'html' :
	      mime == jsonType ? 'json' :
	      scriptTypeRE.test(mime) ? 'script' :
	      xmlTypeRE.test(mime) && 'xml' ) || 'text'
	  }

	  function appendQuery(url, query) {
	    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
	  }

	  // serialize payload and append it to the URL for GET requests
	  function serializeData(options) {
	    if (isObject(options.data)) options.data = $.param(options.data)
	    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
	      options.url = appendQuery(options.url, options.data)
	  }

	  $.ajax = function(options){
	    var settings = $.extend({}, options || {})
	    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

	    ajaxStart(settings)

	    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
	      RegExp.$2 != window.location.host

	    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
	    if (dataType == 'jsonp' || hasPlaceholder) {
	      if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
	      return $.ajaxJSONP(settings)
	    }

	    if (!settings.url) settings.url = window.location.toString()
	    serializeData(settings)

	    var mime = settings.accepts[dataType],
	        baseHeaders = { },
	        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	        xhr = $.ajaxSettings.xhr(), abortTimeout

	    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
	    if (mime) {
	      baseHeaders['Accept'] = mime
	      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
	      xhr.overrideMimeType && xhr.overrideMimeType(mime)
	    }
	    if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET'))
	      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
	    settings.headers = $.extend(baseHeaders, settings.headers || {})

	    xhr.onreadystatechange = function(){
	      if (xhr.readyState == 4) {
	        clearTimeout(abortTimeout)
	        var result, error = false
	        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
	          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
	          result = xhr.responseText

	          try {
	            if (dataType == 'script')    (1,eval)(result)
	            else if (dataType == 'xml')  result = xhr.responseXML
	            else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
	          } catch (e) { error = e }

	          if (error) ajaxError(error, 'parsererror', xhr, settings)
	          else ajaxSuccess(result, xhr, settings)
	        } else {
	          ajaxError(null, 'error', xhr, settings)
	        }
	      }
	    }

	    var async = 'async' in settings ? settings.async : true
	    xhr.open(settings.type, settings.url, async)

	    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

	    if (ajaxBeforeSend(xhr, settings) === false) {
	      xhr.abort()
	      return false
	    }

	    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
	        xhr.onreadystatechange = empty
	        xhr.abort()
	        ajaxError(null, 'timeout', xhr, settings)
	      }, settings.timeout)

	    // avoid sending empty string (#319)
	    xhr.send(settings.data ? settings.data : null)
	    return xhr
	  }

	  $.get = function(url, success){ return $.ajax({ url: url, success: success }) }

	  $.post = function(url, data, success, dataType){
	    if ($.isFunction(data)) dataType = dataType || success, success = data, data = null
	    return $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType })
	  }

	  $.getJSON = function(url, success){
	    return $.ajax({ url: url, success: success, dataType: 'json' })
	  }

	  $.fn.load = function(url, success){
	    if (!this.length) return this
	    var self = this, parts = url.split(/\s/), selector
	    if (parts.length > 1) url = parts[0], selector = parts[1]
	    $.get(url, function(response){
	      self.html(selector ?
	        $(document.createElement('div')).html(response.replace(rscript, "")).find(selector).html()
	        : response)
	      success && success.call(self)
	    })
	    return this
	  }

	  var escape = encodeURIComponent

	  function serialize(params, obj, traditional, scope){
	    var array = $.isArray(obj)
	    $.each(obj, function(key, value) {
	      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
	      // handle data in serializeArray() format
	      if (!scope && array) params.add(value.name, value.value)
	      // recurse into nested objects
	      else if (traditional ? $.isArray(value) : isObject(value))
	        serialize(params, value, traditional, key)
	      else params.add(key, value)
	    })
	  }

	  $.param = function(obj, traditional){
	    var params = []
	    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
	    serialize(params, obj, traditional)
	    return params.join('&').replace('%20', '+')
	  }
	})(Zepto)
	;(function ($) {
	  $.fn.serializeArray = function () {
	    var result = [], el
	    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
	      el = $(this)
	      var type = el.attr('type')
	      if (this.nodeName.toLowerCase() != 'fieldset' &&
	        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
	        ((type != 'radio' && type != 'checkbox') || this.checked))
	        result.push({
	          name: el.attr('name'),
	          value: el.val()
	        })
	    })
	    return result
	  }

	  $.fn.serialize = function () {
	    var result = []
	    this.serializeArray().forEach(function (elm) {
	      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
	    })
	    return result.join('&')
	  }

	  $.fn.submit = function (callback) {
	    if (callback) this.bind('submit', callback)
	    else if (this.length) {
	      var event = $.Event('submit')
	      this.eq(0).trigger(event)
	      if (!event.defaultPrevented) this.get(0).submit()
	    }
	    return this
	  }

	})(Zepto)
	;(function($){
	  var touch = {}, touchTimeout

	  function parentIfText(node){
	    return 'tagName' in node ? node : node.parentNode
	  }

	  function swipeDirection(x1, x2, y1, y2){
	    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
	    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
	  }

	  var longTapDelay = 750, longTapTimeout

	  function longTap(){
	    longTapTimeout = null
	    if (touch.last) {
	      touch.el.trigger('longTap')
	      touch = {}
	    }
	  }

	  function cancelLongTap(){
	    if (longTapTimeout) clearTimeout(longTapTimeout)
	    longTapTimeout = null
	  }

	  $(document).ready(function(){
	    var now, delta

	    $(document.body).bind('touchstart', function(e){
	      now = Date.now()
	      delta = now - (touch.last || now)
	      touch.el = $(parentIfText(e.touches[0].target))
	      touchTimeout && clearTimeout(touchTimeout)
	      touch.x1 = e.touches[0].pageX
	      touch.y1 = e.touches[0].pageY
	      if (delta > 0 && delta <= 250) touch.isDoubleTap = true
	      touch.last = now
	      longTapTimeout = setTimeout(longTap, longTapDelay)
	    }).bind('touchmove', function(e){
	      cancelLongTap()
	      touch.x2 = e.touches[0].pageX
	      touch.y2 = e.touches[0].pageY
	    }).bind('touchend', function(e){
	       cancelLongTap()

	      // double tap (tapped twice within 250ms)
	      if (touch.isDoubleTap) {
	        touch.el.trigger('doubleTap')
	        touch = {}

	      // swipe
	      } else if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
	                 (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
	        touch.el.trigger('swipe') &&
	          touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
	        touch = {}

	      // normal tap
	      } else if ('last' in touch) {
	        touch.el.trigger('tap')

	        touchTimeout = setTimeout(function(){
	          touchTimeout = null
	          touch.el.trigger('singleTap')
	          touch = {}
	        }, 250)
	      }
	    }).bind('touchcancel', function(){
	      if (touchTimeout) clearTimeout(touchTimeout)
	      if (longTapTimeout) clearTimeout(longTapTimeout)
	      longTapTimeout = touchTimeout = null
	      touch = {}
	    })
	  })

	  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
	    $.fn[m] = function(callback){ return this.bind(m, callback) }
	  })
	})(Zepto)


/***/ },
/* 4 */
/***/ function(module, exports) {

	Zepto.fn.parseDOM = (function ($) {
	    return function () {
	        var nodes = {};
	        this.find('[node-type]').each(function () {
	            var el = $(this);
	            nodes[el.attr('node-type')] = el;
	        });
	        return nodes;
	    }
	})(Zepto);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(14);
	__webpack_require__(15);

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, $) {

	    var Channel = __webpack_require__(7);

	    var name = 'config';
	    var config = $.extend({}, global.__CONFIG__ || {}, JSON.parse(global.localStorage.getItem(name)));

	    function set(key, value) {
	        config[key] = value;
	        global.localStorage.setItem(name, JSON.stringify(config));
	    }

	    function get(key) {
	        return key != null ? config[key] : config;
	    }

	    function clear() {
	        return global.localStorage.removeItem(name);
	    }

	    function update(c) {
	        config = $.extend({}, c);
	        global.localStorage.setItem(name, JSON.stringify(config));
	    }

	    Channel.register(name, 'set', set);
	    Channel.register(name, 'get', get);
	    Channel.register(name, 'clear', clear);
	    Channel.register(name, 'update', update);

	    global.__CONFIG__ = config;

	    module.exports = {
	        get: get,
	        set: set,
	        clear: clear,
	        update: update
	    }

	})(window, Zepto);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function (global) {

	    var dispatchList = global['__CHANNEL__'] != null ? global['__CHANNEL__'] : (global['__CHANNEL__'] = {});
	    var bindList = global['__CHANNEL_BIND__'] != null ? global['__CHANNEL_BIND__'] : (global['__CHANNEL_BIND__'] = {});
	    var fireTaskList = [];

	    function runFireTaskList() {
	        if (fireTaskList.length == 0) {
	            return;
	        }
	        var curFireTask = fireTaskList.splice(0, 1)[0];
	        try {
	            curFireTask['func'].apply(curFireTask, [].concat(curFireTask['data']));
	        }
	        catch (exp) {
	        }
	        runFireTaskList();
	    }

	    function register(channelName, eventType, callBack) {
	        if (!dispatchList.hasOwnProperty(channelName)) {
	            dispatchList[channelName] = {};
	        }
	        if (!dispatchList[channelName].hasOwnProperty(eventType)) {
	            dispatchList[channelName][eventType] = [];
	        }
	        dispatchList[channelName][eventType].push(callBack);
	    }

	    function fire(channelName, eventType, data) {
	        if (dispatchList[channelName] && dispatchList[channelName][eventType] && dispatchList[channelName][eventType].length) {
	            var fList = dispatchList[channelName][eventType];
	            fList.cache = data;
	            for (var i = 0, len = fList.length; i < len; i++) {
	                fireTaskList.push({
	                    channel: channelName,
	                    evt: eventType,
	                    func: fList[i],
	                    data: data
	                });
	            }
	            runFireTaskList();
	        }
	    }

	    function remove(channelName, eventType, callBack) {
	        if (dispatchList[channelName]) {
	            if (dispatchList[channelName][eventType]) {
	                for (var i = 0, len = dispatchList[channelName][eventType].length; i < len; i++) {
	                    if (dispatchList[channelName][eventType][i] === callBack) {
	                        dispatchList[channelName][eventType].splice(i, 1);
	                        break;
	                    }
	                }
	            }
	        }
	    }

	    function list() {
	        return dispatchList;
	    }

	    function cache(channelName, eventType) {
	        if (dispatchList[channelName] && dispatchList[channelName][eventType]) {
	            return dispatchList[channelName][eventType].cache;
	        }
	    }

	    function bind(source, target, append) {
	        if (!(
	                source != null
	                && source instanceof Array
	                && source.length === 2
	                && target != null
	                && target instanceof Array
	                && target.length === 2
	            )) {
	            throw new Error('Parameter error, must be Array(2), Array(2)');
	        }
	        function callBack() {
	            fire(target[0], target[1], [].concat(Array.prototype.slice.call(arguments), append || []));
	        }

	        var hashKey = [].concat(source, target).join('|');
	        if (!(bindList[hashKey] instanceof Array)) {
	            bindList[hashKey] = [];
	        }
	        bindList[hashKey].push(callBack);
	        register(source[0], source[1], callBack);
	    }

	    function unBind(listen, fire) {
	        if (!(
	                listen != null
	                && listen instanceof Array
	                && listen.length === 2
	                && fire != null
	                && fire instanceof Array
	                && fire.length === 2
	            )) {
	            throw new Error('Parameter error, must be Array(2), Array(2)');
	        }
	        var hashKey = [].concat(listen, fire).join('|');
	        if ((bindList[hashKey] instanceof Array) && bindList[hashKey].length) {
	            for (var i = 0, len = bindList[hashKey].length; i < len; i++) {
	                remove(listen[0], listen[1], bindList[hashKey][i]);
	            }
	            delete bindList[hashKey];
	        }
	    }

	    var Channel = {};

	    Channel.version = "1.0.0";
	    Channel.register = register;
	    Channel.fire = fire;
	    Channel.remove = remove;
	    Channel.list = list;
	    Channel.cache = cache;
	    Channel.bind = bind;
	    Channel.unbind = unBind;

	    if (true)
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return Channel;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    else if (typeof module === "object" && module.exports)
	        module.exports = Channel;
	    else
	        global.Channel = Channel;

	})(window);

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function (global) {

	    var config = __webpack_require__(6);

	    var lang = config.get('language');

	    function i18n(word) {
	        if (global.hasOwnProperty('__LANG__') && lang in global.__LANG__ && global.__LANG__[lang][word] != null) {
	            return global.__LANG__[lang][word];
	        }
	        return word;
	    }

	    if (true)
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return i18n;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    else if (typeof module === "object" && module.exports)
	        module.exports = i18n;
	    else
	        global.i18n = i18n;

	})(window);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	(function ($, global) {

	    var Channel = __webpack_require__(7);
	    var _ = __webpack_require__(8);
	    var config = __webpack_require__(6);

	    var name = 'view';
	    var it = {};
	    var nodes = {};
	    var lock = {};
	    var cache = {};
	    var LSN = {};

	    var closeBtn = '' +
	        '<nav action-type="closeBtn" class="closeBtn">' +
	        '<button class="fa fa-angle-double-right"></button>' +
	        '<b class="fa fa-circle"></b>' +
	        '</nav>';

	    it.init = function () {
	        it.parseDOM();
	        it.bind();
	    };

	    it.parseDOM = function () {


	        nodes = {};
	        nodes.bar = $('#bar');
	        nodes.platform = $('#platform');
	        it.renderFrame();

	        nodes.body = $(document.body);

	        nodes.platform.children().prepend($(closeBtn));

	        nodes.body.addClass('right');

	        it.reset();
	    };

	    it.renderFrame = function () {

	        nodes.bar.html([
	            '<li><button title="' + _('Upload') + '" node-type="uploadBtn" action-type="uploadBtn" class="fa fa-cloud-upload"></button></li>',
	            '<li><button title="' + _('Copy all links') + '" node-type="copyBtn" action-type="copyBtn" class="fa fa-copy"></button></li>',
	            '<li><button title="' + _('Edit links') + '" node-type="urlsTextBtn" action-type="urlsTextBtn" class="fa fa-clipboard"></button></li>',
	            '<li><button title="' + _('History') + '" node-type="historyBtn" action-type="historyBtn" class="fa fa-history"></button></li>',
	            '<li><button title="' + _('Clear') + '" node-type="trashBtn" action-type="trashBtn" class="fa fa-trash"></button></li>',
	            '<li><button title="' + _('Settings') + '" node-type="settingBtn" action-type="settingBtn" class="fa fa-cog"></button></li>'
	        ].join(''));

	        nodes.platform.html([
	            '<li node-type="upload">',
	            '<div node-type="uploadDrop">',
	            '<div class="drop-pictures-here">',
	            '<i class="fa fa-picture-o"></i>',
	            '<i class="fa fa-folder-open-o"></i>',
	            '<b>' + _('Drop picture(s) here OR click to open a file picker') + '</b>',
	            '</div>',
	            '<input node-type="uploadBox" type="file" multiple="true" title="' + _('Drop picture(s) here OR click to open a file picker') + '">',
	            '</div>',
	            '</li>',

	            '<li node-type="urlsText">',
	            '<div>',
	            '<nav class="toolbar">',
	            '<button action-type="copy" class="fl fa fa-copy" title="' + _('Copy to clipboard') + '"></button>',
	            '<button action-type="markdown" class="fl" title="' + _('Convert to Markdown') + '">![Markdown</button>',
	            '<button action-type="image" class="fl" title="' + _('Convert to HTML') + '">&lt;IMG</button>',
	            '<button action-type="ubb" class="fl" title="' + _('Convert to UBB') + '">[UBB]</button>',
	            '<button action-type="undo" class="fr fa fa-undo" title="' + _('Restore') + '"></button>',
	            '</nav>',
	            '<textarea action-type="selectAll" readonly node-type="urlsTextBox"></textarea>',
	            '</div>',
	            '</li>',

	            '<li node-type="history">',
	            '<ul node-type="historyBox"></ul>',
	            '</li>',

	            '<li node-type="settings">',
	            '<ul node-type="settingsBox"></ul>',
	            '</li>'
	        ].join(''));

	        $.extend(nodes, nodes.bar.parseDOM(), nodes.platform.parseDOM());
	    };

	    it.bind = function () {
	        var evts, type;

	        evts = it.evts.bar;
	        for (var type in evts) {
	            if (evts.hasOwnProperty(type)) {
	                nodes.bar.on('click', '[action-type="' + type + '"]', evts[type]);
	            }
	        }

	        evts = it.evts.platform;
	        for (var type in evts) {
	            if (evts.hasOwnProperty(type)) {
	                nodes.platform.on('click', '[action-type="' + type + '"]', evts[type]);
	            }
	        }

	        evts = it.evts.upload;
	        for (var type in evts) {
	            if (evts.hasOwnProperty(type)) {
	                nodes.uploadBox.on(type, evts[type]);
	            }
	        }

	        evts = it.evts.uploadBox;
	        for (var type in evts) {
	            if (evts.hasOwnProperty(type)) {
	                nodes.uploadBox.on(type, evts[type]);
	            }
	        }

	        evts = it.evts.bodyBlock;
	        for (var type in evts) {
	            if (evts.hasOwnProperty(type)) {
	                nodes.body.on(type, evts[type]);
	            }
	        }

	        evts = it.custEvts;
	        for (var type in evts) {
	            if (evts.hasOwnProperty(type)) {
	                Channel.register(name, type, evts[type]);
	            }
	        }
	    };

	    it.evts = {
	        bar: {
	            copyBtn: function (e) {
	                e.preventDefault();
	                if (!lock.copyBtn) {
	                    if (cache.urls && cache.urls.length) {
	                        Channel.fire(name, 'copyAllToClipboard', cache.urls.join('\n'));
	                    }
	                }
	                return false;
	            },
	            uploadBtn: function (e) {
	                e.preventDefault();
	                if (!lock.uploadBtn) {
	                    it.switchPlatform('upload');
	                }
	                return false;
	            },
	            urlsTextBtn: function (e) {
	                e.preventDefault();
	                if (!lock.urlsTextBtn) {
	                    if (cache.urls && cache.urls.length) {
	                        it.switchPlatform('urlsText');
	                    }
	                }
	                return false;
	            },
	            historyBtn: function (e) {
	                e.preventDefault();
	                it.renderHistory();
	                return false;
	            },
	            trashBtn: function (e) {
	                e.preventDefault();
	                if (!lock.trashBtn) {
	                    it.reset();
	                    Channel.fire(name, 'reset');
	                }
	                return false;
	            },
	            settingBtn: function (e) {
	                e.preventDefault();
	                it.renderSettings();
	                return false;
	            }
	        },
	        bodyBlock: {
	            dragenter: function (e) {
	                e.preventDefault();
	                if (!nodes.upload.hasClass('show')) {
	                    it.switchPlatform('upload');
	                }
	                return false;
	            },
	            dragover: function (e) {
	                e.preventDefault();
	                return false;
	            },
	            dragleave: function (e) {
	                e.preventDefault();
	                return false;
	            },
	            drop: function (e) {
	                e.preventDefault();
	                return false;
	            }
	        },
	        upload: {
	            dragenter: function (e) {
	                e.preventDefault();
	                nodes.uploadDrop.addClass('active');
	                return false;
	            },
	            dragover: function (e) {
	                e.preventDefault();
	                return false;
	            },
	            dragleave: function (e) {
	                e.preventDefault();
	                nodes.uploadDrop.removeClass('active');
	                return false;
	            },
	            drop: function (e) {
	                e.preventDefault();
	                nodes.uploadDrop.removeClass('active');
	                Channel.fire(name, 'dropedFiles', e.dataTransfer.files);
	                return false;
	            }
	        },
	        uploadBox: {
	            change: function () {
	                Channel.fire(name, 'selectedFiles', nodes.uploadBox.get(0).files);
	            }
	        },
	        platform: {
	            markdown: function (e) {
	                e.preventDefault();
	                nodes.urlsTextBox.val(cache.urls.map(function (url) {
	                    return '![](' + url + ')';
	                }).join('\n'));
	                return false;
	            },
	            image: function (e) {
	                e.preventDefault();
	                nodes.urlsTextBox.val(cache.urls.map(function (url) {
	                    return '<img src="' + url + '" />';
	                }).join('\n'));
	                return false;
	            },
	            ubb: function (e) {
	                e.preventDefault();
	                nodes.urlsTextBox.val(cache.urls.map(function (url) {
	                    return '[IMG]' + url + '[/IMG]';
	                }).join('\n'));
	                return false;
	            },
	            copy: function (e) {
	                e.preventDefault();
	                Channel.fire(name, 'copyAllToClipboard', nodes.urlsTextBox.val());
	                return false;
	            },
	            undo: function (e) {
	                e.preventDefault();
	                nodes.urlsTextBox.val(cache.urls.join('\n'));
	                return false;
	            },
	            closeBtn: function (e) {
	                e.preventDefault();
	                it.switchPlatform();
	                return false;
	            },
	            selectAll: function (e) {
	                e.preventDefault();
	                $(this).get(0).select();
	                return false;
	            },
	            saveSettings: function (e) {
	                e.preventDefault();
	                it.saveSettings();
	                return false;
	            }
	        }
	    };

	    it.custEvts = {
	        closePlat: function () {
	            it.switchPlatform();
	        },
	        updateUrlsText: function (urls) {
	            if (urls.length) {
	                cache.urls = urls;
	                nodes.urlsTextBox.val(urls.join('\n'));
	                it.custEvts.copyUnlock();
	                it.custEvts.urlsTextUnlock();
	                it.custEvts.trashUnlock();
	            }
	        },
	        showUrlsText: function () {
	            it.switchPlatform('urlsText');
	        },
	        uploadLock: function () {
	            lock.uploadBtn = true;
	            nodes.uploadBtn.addClass('disable');
	            it.custEvts.copyLock();
	            it.custEvts.urlsTextLock();
	            it.custEvts.trashLock();
	        },
	        uploadUnlock: function () {
	            lock.uploadBtn = false;
	            nodes.uploadBtn.removeClass('disable');
	        },
	        copyLock: function () {
	            lock.copyBtn = true;
	            nodes.copyBtn.addClass('disable');
	        },
	        copyUnlock: function () {
	            lock.copyBtn = false;
	            nodes.copyBtn.removeClass('disable');
	        },
	        urlsTextLock: function () {
	            lock.urlsTextBtn = true;
	            nodes.urlsTextBtn.addClass('disable');
	        },
	        urlsTextUnlock: function () {
	            lock.urlsTextBtn = false;
	            nodes.urlsTextBtn.removeClass('disable');
	        },
	        trashLock: function () {
	            lock.trashBtn = true;
	            nodes.trashBtn.addClass('disable');
	        },
	        trashUnlock: function () {
	            lock.trashBtn = false;
	            nodes.trashBtn.removeClass('disable');
	        }
	    };

	    it.switchPlatform = function (name) {
	        var els, target;
	        if (LSN.mask) {
	            global.clearTimeout(LSN.mask);
	        }
	        if (!name) {
	            els = nodes.platform.children();
	            nodes.body.css('overflow', '');
	        } else {
	            target = nodes.platform.find('[node-type="' + name + '"]');
	            target.addClass('show');
	            nodes.body.css('overflow', 'hidden');
	            els = nodes.platform.find('li:not([node-type="' + name + '"])');
	            LSN.mask = global.setTimeout(function () {
	                target.addClass('mask');
	            }, 500);
	        }
	        els.each(function () {
	            var el = $(this);
	            if (el.hasClass('show')) {
	                el.addClass('hide').removeClass('mask');
	                global.setTimeout(function () {
	                    el.removeClass('hide').removeClass('show');
	                }, 500);
	            }
	        });
	    };

	    it.renderHistory = function () {
	        Channel.fire(name, 'loadHistory', function (history) {
	            if (history.length) {
	                nodes.historyBox.html(history.reverse().map(function (item) {
	                    return '<li class="clearfix">' +
	                        '<div class="preview" style="background-image:url(' + item.src + ')"></div>' +
	                        '<div class="detail">' +
	                        '<div class="url">' +
	                        '<input action-type="selectAll" readonly value="' + item.src + '">' +
	                        '</div>' +
	                        (item.time ? '<p class="time">' + new Date(item.time).Format('yyyy-mm-dd h:i:s') + '</p>' : '') +
	                        '</div>' +
	                        '</li>';
	                }).join('\n'));
	                it.switchPlatform('history');
	            } else {
	                Channel.fire('tips', 'show', _('No history found'));
	            }
	        });
	    };

	    it.renderSettings = function () {

	        var settings = config.get();

	        var TPL = [];

	        var allowedLanguage = global.__ALLOWED_LANGUAGE__;
	        if (allowedLanguage.indexOf('en') < 0) {
	            allowedLanguage = ['en'].concat(allowedLanguage);
	        }

	        Object.keys(settings).forEach(function (option) {

	            TPL.push('<li class="clearfix">');
	            TPL.push('<label>' + _(option) + ':</label>');
	            if (option === 'language') {
	                TPL.push('<select name="language">');
	                allowedLanguage.forEach(function (lang) {
	                    TPL.push('' +
	                        '<option value="' + lang + '"' + (settings.language === lang ? ' selected="selected"' : '') + '>' +
	                        _(lang) +
	                        '</option>'
	                    );
	                });
	                TPL.push('</select>');
	            } else {
	                TPL.push('<input name="' + option + '"');
	                switch (typeof settings.option) {
	                    case 'string':
	                        TPL.push(' type="text"');
	                        break;
	                    case 'number':
	                        TPL.push(' type="number"');
	                        break;
	                }
	                TPL.push(' value="' + settings[option] + '" />');
	            }

	            TPL.push('</li>');
	        });

	        TPL.push('<li><label>&nbsp;</label><button action-type="saveSettings">' + _('SAVE') + '</button></li>');

	        nodes.settingsBox.html(TPL.join(''));
	        it.switchPlatform('settings');
	    };

	    it.saveSettings = function () {
	        var cfg = {};
	        var name, value, type, el;
	        nodes.settingsBox.find('[name]').each(function () {
	            el = $(this);
	            name = el.attr('name');
	            type = el.attr('type');
	            value = el.val();
	            if (type === 'number') {
	                value = value.indexOf('.') > -1 ? parseFloat(value) : parseInt(value);
	            }
	            cfg[name] = value;
	        });
	        config.update(cfg);
	        setTimeout(function () {
	            window.location.reload();
	        }, 0);
	    };

	    it.reset = function () {
	        nodes.urlsTextBox.val('');
	        cache.urls = null;
	        it.switchPlatform('upload');
	        it.custEvts.copyLock();
	        it.custEvts.urlsTextLock();
	        it.custEvts.trashLock();
	    }

	    it.init();

	})(Zepto, window);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {

	    var Channel = __webpack_require__(7);

	    var name = 'historyManager';

	    function add(list) {
	        if (list == null || typeof list === 'string' || (list instanceof Array) && list.length === 0) {
	            return 0;
	        }

	        if (Object.prototype.toString.call(list) === '[object Object]') {
	            list = [list];
	        }
	        global.localStorage.setItem('history', JSON.stringify([].concat(load(), list)));
	    }

	    function load() {
	        var list = global.localStorage.getItem('history')
	        return list ? JSON.parse(list) : [];
	    }

	    function clear() {
	        return global.localStorage.removeItem('history');
	    }

	    Channel.register(name, 'add', add);
	    Channel.register(name, 'clear', clear);

	    Channel.register(name, 'load', function (cb) {
	        cb(load());
	    });

	})(window);

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, $) {

	    var Channel = __webpack_require__(7);

	    var Z = 10000;
	    var defaultTime = 2000;
	    var body = $(document.body);

	    var name = 'tips';
	    var lsn;

	    var tipEl = $('<div id="tips" class="tips"><p></p></div>');
	    body.append(tipEl);
	    tipEl.on('mouseenter', clearTimer).on('mouseleave', autoHide);

	    function autoHide(time) {
	        lsn = global.setTimeout(function () {
	            //tip.addClass('hide');
	            tipEl.removeClass('show');
	        }, time || defaultTime);
	    }

	    function clearTimer() {
	        lsn && clearTimeout(lsn);
	    }

	    function tip(content, time) {
	        if ($.trim(content)) {
	            clearTimer();
	            tipEl.find('p').html(content);
	            tipEl.css('z-index', Z++);
	            tipEl.addClass('show');
	            autoHide(time || defaultTime);
	        }
	    }

	    Channel.register(name, 'show', tip);

	})(window, Zepto);

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by shinate on 15/12/15.
	 * Depends: queue, copyToClipboard
	 */

	(function ($, global) {

	    var Channel = __webpack_require__(7);
	    var config = __webpack_require__(6);
	    var sprintf = __webpack_require__(2).sprintf;
	    var queue = __webpack_require__(13);
	    var _ = __webpack_require__(8);

	    var name = 'uploader';

	    var it = {};
	    var nodes = {};
	    var previewList = [];
	    var taskManager = {};

	    var uploadTimeout = config.get('upload_timeout')

	    var ALLOWED_TYPE = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

	    it.init = function () {
	        it.parseDOM();
	        it.bind();
	    };

	    it.parseDOM = function () {
	        nodes.body = $(document.body);
	        nodes.list = $('#list');
	    };

	    it.bind = function () {
	        var type;

	        for (type in it.custEvts) {
	            if (it.custEvts.hasOwnProperty(type)) {
	                Channel.register(name, type, it.custEvts[type]);
	            }
	        }

	        for (type in it.evts) {
	            if (it.evts.hasOwnProperty(type)) {
	                nodes.list.on('click', '[action-type="' + type + '"]', it.evts[type]);
	            }
	        }
	    };

	    it.evts = {
	        copy: function (e) {
	            e.preventDefault();
	            it.copyToClipboard($(this).parents('.preview').data('url'));
	            return false;
	        },
	        retry: function (e) {
	            e.preventDefault();
	            it.retry($(this).parent());
	            return false;
	        }
	    };

	    it.custEvts = {
	        upload: function (files) {
	            it.startUpload(files);
	        },
	        reset: function () {
	            it.reset();
	        }
	    };

	    it.getImageList = function (files) {
	        var imageList = [];
	        for (var i = 0; i < files.length; i++) {
	            if (ALLOWED_TYPE.indexOf(files[i].type) > -1) {
	                imageList.push(files[i]);
	            }
	        }
	        return imageList;
	    };

	    it.retry = function (el) {
	        if (!taskManager.hasOwnProperty('uploadStatus')) {
	            taskManager.uploadStatus = [];
	        }
	        el.removeClass('uploaderr');
	        taskManager.uploadStatus.push('pending');
	        previewList.push(el);
	        it.uploadTask(el.find('.picture').data('image'), previewList.length - 1);
	    };

	    it.startUpload = function (files) {
	        it.resetTaskList();
	        var sl = files.length;
	        files = it.getImageList(files);
	        if (files.length) {
	            Channel.fire(name, 'uploadStart');
	            it.createUploadQueue(files);
	        }

	        if (files.length === 0)
	            Channel.fire('tips', 'show', _('No picture detected'));
	        else if (files.length === sl)
	            Channel.fire('tips', 'show', sprintf(_('Start uploading %d pictures'), files.length));
	        else
	            Channel.fire('tips', 'show', sprintf(_('Start uploading %d pictures, with %d invalid file ignored'), files.length, sl - files.length));
	    };

	    it.createUploadQueue = function (images) {
	        taskManager.uploadStatus = new Array(images.length).fill('pending');
	        images.forEach(it.previewTask);
	    };

	    it.uploadQueueCompleteScan = function () {
	        var s = taskManager.uploadStatus;
	        var reject = s.filter(function (v) {
	            return v === 'rejected';
	        });
	        var newPics = [];
	        var reslove = s.filter(function (v, i) {
	            if (v === 'resloved') {
	                newPics.push(previewList[i].data('url'));
	                return true;
	            } else {
	                return false;
	            }
	        });

	        // Queue accomplished!!!
	        if (s.length === reject.length + reslove.length) {
	            var allUrls = it.getAllUrls();

	            Channel.fire(name, 'uploadComplete', [allUrls]);

	            if (reject.length === 0) {
	                Channel.fire('tips', 'show', sprintf(_('Upload successfully (%d/%d)'), reslove.length, s.length));
	                Channel.fire(name, 'uploadAllSuccess', [allUrls]);
	            } else {
	                // Channel.fire('tips', 'show', '上传成功(' + reslove.length + '/' + s.length + '), ' + '失败(' + reject.length + ')');
	            }

	            if (newPics.length) {
	                Channel.fire(name, 'saveToHistory', [
	                    newPics.map(function (item) {
	                        return {
	                            src: item,
	                            time: +new Date
	                        };
	                    })
	                ]);
	            }
	            it.resetTaskList();
	        }
	    };

	    it.previewTask = function (file, i) {
	        if (taskManager.preview == null) {
	            taskManager.preview = queue(1);
	        }
	        taskManager.preview.defer(function (next) {
	            var reader = new FileReader();
	            reader.onload = function (e) {
	                // console.log(i, file, e.target.result);
	                it.createPreview(e.target.result);
	                it.uploadTask(e.target.result, i);
	                next();
	            };
	            reader.readAsDataURL(file);
	        });
	    };

	    it.uploadTask = function (imageData, i) {
	        if (taskManager.upload == null) {
	            taskManager.upload = queue(3);
	        }
	        taskManager.upload.defer(function (next) {
	            it.uploading(i);
	            Channel.fire(name, 'uploadTo', [
	                imageData, function (url) {
	                    if (url != null) {
	                        it.uploaded(i, url);
	                    } else {
	                        it.uploaderr(i);
	                    }
	                    next();
	                }
	            ]);
	            taskManager.uploadStatus[i] = global.setTimeout(function () {
	                it.uploaderr(i);
	                uploadTimeout *= 1.5;
	                next();
	            }, uploadTimeout);
	        });
	    };

	    it.createPreview = function (dp) {
	        var preview = $('' +
	            '<li class="preview">' +
	            '<div data-image="' + dp + '" class="picture" style="background-image:url(' + dp + ')"></div>' +
	                //'<button title="' + _('Retry') + '" action-type="b64" class="b64"></button>' +
	            '<button title="' + _('Copy to clipboard') + '" action-type="copy" class="copy fa fa-copy"></button>' +
	            '<button title="' + _('Retry') + '" action-type="retry" class="retry fa fa-cloud-upload"></button>' +
	            '</li>');
	        nodes.list.append(preview);
	        previewList.push(preview);
	    };

	    it.uploading = function (i) {
	        previewList[i].addClass('uploading');
	    };

	    it.uploaderr = function (i) {
	        if (taskManager.uploadStatus && taskManager.uploadStatus[i] !== 'resloved') {
	            global.clearTimeout(taskManager.uploadStatus[i]);
	            previewList[i].addClass('uploaderr');
	            taskManager.uploadStatus[i] = 'rejected';
	            it.uploadQueueCompleteScan();
	        }
	    };

	    it.uploaded = function (i, url) {
	        if (url && taskManager.uploadStatus && taskManager.uploadStatus[i] !== 'rejected') {
	            global.clearTimeout(taskManager.uploadStatus[i]);
	            var previewEL = previewList[i];
	            previewEL.data('url', url);
	            var p = new Image;
	            p.onload = function () {
	                previewEL.addClass('uploaded');
	                previewEL.find('.picture').css('background-image', 'url(' + url + ')');
	                taskManager.uploadStatus[i] = 'resloved';
	                it.uploadQueueCompleteScan();
	            };
	            p.src = url;
	        }
	    };

	    it.copyToClipboard = function (text) {
	        Channel.fire(name, 'copyToClipboard', text);
	    };

	    it.getAllUrls = function () {
	        var urls = [];
	        nodes.list.find('.preview.uploaded').each(function () {
	            urls.push($(this).data('url'));
	        });
	        return urls;
	    };

	    it.resetTaskList = function () {
	        previewList = [];
	        taskManager = {};
	    };

	    it.reset = function () {
	        it.resetTaskList();
	        nodes.list.empty();
	    };

	    it.init();

	})(Zepto, window);

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function() {
	  var slice = [].slice;

	  function queue(parallelism) {
	    var q,
	        tasks = [],
	        started = 0, // number of tasks that have been started (and perhaps finished)
	        active = 0, // number of tasks currently being executed (started but not finished)
	        remaining = 0, // number of tasks not yet finished
	        popping, // inside a synchronous task callback?
	        error = null,
	        await = noop,
	        all;

	    if (!parallelism) parallelism = Infinity;

	    function pop() {
	      while (popping = started < tasks.length && active < parallelism) {
	        var i = started++,
	            t = tasks[i],
	            a = slice.call(t, 1);
	        a.push(callback(i));
	        ++active;
	        t[0].apply(null, a);
	      }
	    }

	    function callback(i) {
	      return function(e, r) {
	        --active;
	        if (error != null) return;
	        if (e != null) {
	          error = e; // ignore new tasks and squelch active callbacks
	          started = remaining = NaN; // stop queued tasks from starting
	          notify();
	        } else {
	          tasks[i] = r;
	          if (--remaining) popping || pop();
	          else notify();
	        }
	      };
	    }

	    function notify() {
	      if (error != null) await(error);
	      else if (all) await(error, tasks);
	      else await.apply(null, [error].concat(tasks));
	    }

	    return q = {
	      defer: function() {
	        if (!error) {
	          tasks.push(arguments);
	          ++remaining;
	          pop();
	        }
	        return q;
	      },
	      await: function(f) {
	        await = f;
	        all = false;
	        if (!remaining) notify();
	        return q;
	      },
	      awaitAll: function(f) {
	        await = f;
	        all = true;
	        if (!remaining) notify();
	        return q;
	      }
	    };
	  }

	  function noop() {}

	  queue.version = "1.0.7";
	  if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return queue; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  else if (typeof module === "object" && module.exports) module.exports = queue;
	  else this.queue = queue;
	})();


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {

	    var Channel = __webpack_require__(7);
	    var _ = __webpack_require__(8);

	    var name = 'clipboard';

	    function copyTextToClipboard(text) {

	        var el = document.createElement('textarea');
	        el.value = text;
	        el.style.cssText = 'position:absolute;left:-10000px';

	        document.body.appendChild(el);

	        el.select();

	        try {
	            var successful = document.execCommand('copy');
	            Channel.fire('tips', 'show', successful ? _('Copy to clipboard successfully') : _('Copy failed, please retry manually'));
	        } catch (err) {
	            Channel.fire('tips', 'show', _('Copy failed, please retry manually'));
	        }

	        document.body.removeChild(el);
	    };

	    Channel.register(name, 'copy', copyTextToClipboard);

	})(window);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Channel = __webpack_require__(7);
	var config = __webpack_require__(6);

	Channel.bind(['view', 'dropedFiles'], ['uploader', 'upload']);
	Channel.bind(['view', 'selectedFiles'], ['uploader', 'upload']);
	Channel.bind(['view', 'copyAllToClipboard'], ['clipboard', 'copy']);
	Channel.bind(['view', 'reset'], ['uploader', 'reset']);
	Channel.bind(['view', 'loadHistory'], ['historyManager', 'load']);
	Channel.bind(['view', 'loadSettings'], ['config', 'get']);
	Channel.bind(['view', 'updateSettings'], ['config', 'update']);

	Channel.bind(['uploader', 'uploadStart'], ['view', 'closePlat']);
	Channel.bind(['uploader', 'uploadStart'], ['view', 'uploadLock']);
	Channel.bind(['uploader', 'uploadComplete'], ['view', 'uploadUnlock']);
	Channel.bind(['uploader', 'uploadAllSuccess'], ['view', 'showUrlsText']);
	Channel.bind(['uploader', 'uploadComplete'], ['view', 'updateUrlsText']);
	Channel.bind(['uploader', 'copyToClipboard'], ['clipboard', 'copy']);
	Channel.bind(['uploader', 'saveToHistory'], ['historyManager', 'add']);

	// TODO support more apps
	var APPS = {
	    weibo: __webpack_require__(16)
	};
	Channel.bind(['uploader', 'uploadTo'], [APPS[config.get('default_storage')].name, 'upload']);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {

	    var Channel = __webpack_require__(7);

	    var name = 'weibo';
	    var UP_URL = "http://picupload.service.weibo.com/interface/pic_upload.php?&mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog";

	    function pid2url(pid, type) {

	        function crc32(str) {
	            str = String(str);
	            var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
	            if (typeof(crc) == "undefined") {
	                crc = 0;
	            }
	            var x = 0;
	            var y = 0;

	            crc = crc ^ (-1);
	            for (var i = 0, iTop = str.length; i < iTop; i++) {
	                y = (crc ^ str.charCodeAt(i)) & 0xFF;
	                x = "0x" + table.substr(y * 9, 8);
	                crc = (crc >>> 8) ^ x;
	            }
	            return crc ^ (-1);
	        }

	        var url, zone;
	        if (typeof(type) == "undefined") type = 'bmiddle';
	        if (pid[9] == 'w') {
	            zone = (crc32(pid) & 3) + 1;
	            var ext = (pid[21] == 'g') ? 'gif' : 'jpg';
	            url = 'http://ww' + zone + '.sinaimg.cn/' + type + '/' + pid + '.' + ext;
	        } else {
	            zone = ((pid.substr(-2, 2), 16) & 0xf) + 1;
	            url = 'http://ss' + zone + '.sinaimg.cn/' + type + '/' + pid + '&690';
	        }
	        return url;
	    }

	    function upload(imageData, onComplete) {
	        var data = new FormData();
	        data.append("b64_data", imageData.split(',')[1]);
	        var xhr = new XMLHttpRequest();
	        xhr.onreadystatechange = function () {
	            if (xhr.readyState === 4 && xhr.status === 200) {
	                var rs = JSON.parse(xhr.responseText.substring(xhr.responseText.indexOf('{"')));
	                if (rs.code === 'A00006') {
	                    onComplete(pid2url(rs.data.pics.pic_1.pid, 'large'));
	                } else {
	                    onComplete(null);
	                    Channel.fire('tips', 'show', [
	                        '上传失败, 请先<a href="http://weibo.com/" target="_blank">登录</a>围脖',
	                        5000
	                    ]);
	                }
	            }
	        };
	        xhr.open("POST", UP_URL);
	        xhr.send(data);
	    }

	    Channel.register(name, 'upload', upload);

	    exports.upload = upload;
	    exports.name = name;

	})(window);

/***/ }
/******/ ]);