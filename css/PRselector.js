(function(global,factory){
	if(typeof global.PRselector !== 'undefined'){   //检测是否存在PRselector,如果存在则不再进行创建
        PRselector.trace('Too many PRselector');
	}else{
        factory(global);
    }
})(typeof window !== "undefined" ? window : this,function(window){

    var emptyArray = [];
    var emptyObject = {};

    var slice = emptyArray.slice;
    var concat = emptyArray.concat;
    var push = emptyArray.push;
    var indexOf = emptyArray.indexOf;
    var toString = emptyObject.toString;
    var hasOwn = emptyObject.hasOwnProperty;


    var version = '1.1.0007',

    PRselector = function(selector,context){
        return new PRselector.fn.init(selector,context);
    }

    //以下是模拟数组的内置方法
    PRselector.fn = PRselector.prototype = {
        version: version,
        constructor:PRselector,
        selector:'',
        length:0,


        toArray: function () {
            return slice.call(this);
        },
        pushStack: function (elems) {
            var ret = PRselector.merge(this.constructor(), elems);

            ret.prevObject = this;
            ret.context = this.context;

            return ret;
        },
        each: function (callback) {
            return PRselector.each(this, callback);
        },

        get: function (num) {
            return num != null ?
                ( num < 0 ? this[num + this.length] : this[num] ) :
                slice.call(this);
        },

        slice: function () {
            return this.pushStack(slice.apply(this, arguments));
        },

        indexOf: function(){
            return indexOf.apply(this,arguments);
        },

        first: function () {
            return this.eq(0);
        },

        last: function () {
            return this.eq(-1);
        },

        eq: function (i) {
            var len = this.length,
                j = +i + ( i < 0 ? len : 0 );
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        }



    }
    PRselector.extend = PRselector.fn.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && !PRselector.isFunction(target)) {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && ( PRselector.isPlainObject(copy) || (copyIsArray = PRselector.isArray(copy)) )) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && PRselector.isArray(src) ? src : [];

                        } else {
                            clone = src && PRselector.isPlainObject(src) ? src : {};
                        }

                        target[name] = PRselector.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    //以下是判断及抛错的内置方法
    PRselector.extend({
        isReady: true,

        error: function (msg) {
            throw new Error(msg);
        },
        trace: function(){
            if(!arguments[0]) return;
            var arg = (arguments.length && arguments.length>1)?slice.call(arguments):arguments[0];
            window.console && window.console.log && window.console.log(arg);
        },
        isFunction: function (obj) {
            return typeof obj === "function";
        },

        isArray: Array.isArray || function (obj) {
            return PRselector.type(obj) === "array";
        },

        isArrayLike: function (obj) {
            var length = obj.length,
                type = PRselector.type(obj);

            if(type === "function" || obj != null && obj == obj.window){
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && ( length - 1 ) in obj;
        },

        isWindow: function (obj) {
            return obj != null && obj == obj.window;
        },

        isNumeric: function (obj) {
            return !PRselector.isArray(obj) && (obj - parseFloat(obj) + 1) >= 0;
        },

        isEmptyObject: function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        isPlainObject: function (obj) {
            var key;
            if (!obj || PRselector.type(obj) !== "object" || obj.nodeType || PRselector.isWindow(obj)) {
                return false;
            }

            try {
                if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            for (key in obj) {
            }
            return key === undefined || hasOwn.call(obj, key);
        },

        type: function (obj) {
            if (obj == null) {
                return obj + "";
            }
            return typeof obj === "object" || typeof obj === "function" ?
            emptyObject[toString.call(obj)] || "object" :
                typeof obj;
        },
        map: function (elems, callback, arg) {
            var value,
                i = 0,
                length = elems.length,
                isArray = PRselector.isArrayLike(elems),
                ret = [];

            if (isArray) {
                for (; i < length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }
            }
            return concat.apply([], ret);
        },

        each: function(obj,callback){
            var value, i = 0, length = obj.length, isArray = PRselector.isArrayLike(obj);
            if(isArray){
                for(; i<length; i++){
                    value = callback.call(obj[i], i, obj[i]);
                    if(value === false) break;
                }
            }else{
                for(i in obj){
                    value = callback.call(obj[i], i, obj[i]);
                    if(value === false) break;
                }
            }
            return obj;
        }

    });

    var merge = PRselector.merge = function(a,b){
        var len = +b.length,
            j = 0,
            i = a.length;

        while(j<len){
            a[i++] = b[j++];
        }
        a.length = i;
        return a;
    }

    var rootSelector,
        document = window.document,
        domReg = /<[\w]+(?=[\s]?[\w\s\(\)="'-_:;\%#\/]*>)/,

    selectDom = function(selector,parent){
        var nodeList = [];

        if(typeof selector === 'object' && (selector.tagName || selector.nodeType === 9 || selector === window)){
            nodeList = [selector];
        }else{
            nodeList = slice.call(parent.querySelectorAll(selector));
        }
        return nodeList;
    },
    filter = PRselector.filter = function(selector,group){
        var isArray = PRselector.isArrayLike(group),
            i = 0,
            ret = [];

        if(isArray){
            for(;i<group.length; i++){
                if(matchesSelector.call(group[i],selector)){
                    ret.push(group[i]);
                }
            }
        }
        return ret;

    },
    unique = PRselector.unique = function(group){//判断是否有重复，方法可以继续优化
        var i = 0, j = 0,ret = [],duplicate = false;
        for(;i<group.length; i++){
            duplicate = false,j = 0;
            for(;j<ret.length; j++){
                if(ret[j] === group[i]){
                    duplicate = true;
                    break;
                }
            }
            if(!duplicate){
                ret.push(group[i]);
            }
        }
        return ret;
    },
    createDom = function(html){
        var div = document.createElement('div'),node,i=0;
        div.innerHTML = html;
        node = PRselector.sibling(div.firstChild);
        for(;i<node.length;i++){
            div.removeChild(node[i]);
        }
        div = null;
        return node;
    },
    init = PRselector.fn.init = function(selector,context){
        var parseGroup = [],parent;
        if(!selector) return this;
        //检测context的类型并赋值给parent，不符合的类型将取document作为parent
        parent = !!context ? (typeof context==='string' && document.selectDom(context) || context.tagName && context || PRselector.isArrayLike(context) && context) || document :document;
        if(!PRselector.isArrayLike(parent)){
            parent = [parent];
        }
        this.context = parent[0];
        if(typeof selector === 'string' && selector.match(domReg)){
            merge(this, createDom(selector));
        }else if (PRselector.isFunction(selector)) {
            return typeof rootSelector.ready !== "undefined" ?
                rootSelector.ready(selector) :
                // Execute immediately if ready is not present
                selector(PRselector);
        }else{
            for(var i = 0; i<parent.length; i++){
                if(!parent[i] || parent[i]!== document && !parent[i].tagName){
                    continue;
                }
                if(parent[i].contentWindow) {
                    parent[i] = parent[i].contentWindow;
                }
                if(typeof selector === 'object'){
                    if(PRselector.isArrayLike(selector) && (typeof selector.tagName === 'undefined' || (typeof selector.tagName === 'string' && selector.tagName.toLowerCase() != 'select'))){
                        for(var j = 0; j<selector.length; j++){
                            parseGroup = parseGroup.concat(selectDom(selector[j],parent[i]));
                        }
                        merge(this, parseGroup);
                    }else{
                        merge(this, selectDom(selector,parent[i]));
                    }
                }else{
                    merge(this, selectDom(selector,parent[i]));
                }

            }
        }
        return this;

    };
    init.prototype = PRselector.fn;
    rootSelector = PRselector(document);

    var matchesSelector = function() {
        var body = document.body
        return body.webkitMatchesSelector || body.msMatchesSelector || body.mozMatchesSelector || body.oMatchesSelector
    }();

    //以下是事件处理,不完善

    PRselector._eventsCallback = {};
    PRselector.fn.extend({
        _enterEvent: function (key,evt){
            var baseCode = new Date().getTime(),prcode = {};
            this.each(function(i){
                var thiscode = this.prcode;
                if(!thiscode){
                    thiscode = baseCode + '' + Math.floor( Math.random()*100000 ) + i;
                    this.prcode = thiscode;
                }
                prcode[thiscode] = true;
            });
            evt.prcode = prcode;
            if (!PRselector._eventsCallback[key]) {
                PRselector._eventsCallback[key] = [];
            }
            PRselector._eventsCallback[key].push(evt);
        },
        on: function (evt, selector, fn, useCapture, current) {
            if (typeof selector === 'function') {
                if (typeof fn !== 'undefined') {
                    useCapture = !!fn;
                    current = !!useCapture;
                }
                fn = selector, selector = undefined;
            }
            useCapture = useCapture || false;
            current = current || false;

            if (typeof evt === 'string'){
                evt = ( evt || "" ).match(/\S+/g) || [""];
                if(evt.length === 1){
                    evt = evt[0];
                }
            }
            if (typeof evt === 'object') {
                if (PRselector.isArray(evt)) {
                    for (var i in evt) {
                        this.on(evt[i], selector, fn, useCapture, current);
                    }
                } else {
                    for (var e in evt) {
                        this.on(e, selector, evt[e], useCapture, current);
                    }
                }
            }else{
                this.addEvent(evt, selector, fn, useCapture, current);
            }
            return this;
        },
        addEvent: function (evt, selector, fn, useCapture, current) {
            var event, callback = null;
            event = {
                evt: evt,
                selector: selector,
                fn: fn,
                current: current,
                useCapture: useCapture
            };
            callback = (function (event) {
                return function (e) {
                    if(!e){
                        return event.fn.apply(this,[null,this]);
                    }
                    var target = e.target || e.srcElement, flag = true, useRelated = false;

                    if(event.current){
                        if(e.relatedTarget){
                            if(this.contains(e.relatedTarget)){
                                flag = false;
                            }
                            useRelated = true;
                        }
                    }

                    if (flag && !!event.selector) {
                        flag = false;
                        if(event.selector instanceof PRselector){
                            event.selector.each(function(){
                                if(target === this || (e.bubbles && this.contains(target) && (!event.current || useRelated))){
                                    target = this;
                                    flag = true;
                                    return false;
                                }
                            })
                        }else if(typeof event.selector === 'object' && event.selector.nodeType && (event.selector.nodeType === 1 || event.selector.nodeType === 9)){
                            if(target === this || (e.bubbles && this.contains(target) && (!event.current || useRelated))) {
                                target = this;
                                flag = true;
                            }
                        }else if(typeof event.selector ==='string'){
                            if(e.bubbles && (!event.current || useRelated)){
                                do{
                                    if(matchesSelector.call(target, event.selector)) {
                                        flag = true;
                                        break;
                                    }
                                } while ((target = target.parentNode) && ((this.parentNode && target !== this.parentNode) || (!this.parentNode && target !== this)));
                            }else{
                                if(matchesSelector.call(target, event.selector)){
                                    flag = true;
                                }
                            }
                        }
                    }
                    if (flag) {
                        return event.fn.apply(this,[e,target]);
                    }
                }
            })(event);
            event.callback = callback;
            this._enterEvent(evt,event);
            this.each(function () {
                this.addEventListener(event.evt.split('.')[0], event.callback, event.useCapture);
            });
        },
        off: function (evt, selector, fn) {
            var flag = !!evt;
            if (typeof selector === 'function') {
                fn = selector, selector = undefined;
            }
            if (typeof evt === 'string'){
                evt = ( evt || "" ).match(/\S+/g) || [""];
            }
            if (flag) {
                for (var i in evt) {
                    if(!evt[i].split('.')[0]){
                        this._removeAllEvents(evt[i].split('.')[1]);
                    }
                    this._removeCurrentEvent(evt[i], selector, fn);
                }
            } else {
                this._removeAllEvents();
            }
            return this;
        },
        _removeCurrentEvent: function (evt, selector, fn) {
            var _this = this;
            if(!PRselector._eventsCallback[evt])return;
            for (var i in PRselector._eventsCallback[evt]) {
                if (!!selector) {
                    if (PRselector._eventsCallback[evt][i].selector != selector) {
                        continue;
                    }
                } else if (!!fn) {
                    if (PRselector._eventsCallback[evt][i].fn != fn) {
                        continue;
                    }
                }
                this.each(function () {
                    var thiscode = this.prcode;
                    if(thiscode && PRselector._eventsCallback[evt][i].prcode[thiscode]){
                        this.removeEventListener(evt.split('.')[0], PRselector._eventsCallback[evt][i].callback, PRselector._eventsCallback[evt][i].useCapture);
                        delete PRselector._eventsCallback[evt][i].prcode[thiscode];
                    }
                });
                if(PRselector.isEmptyObject(PRselector._eventsCallback[evt][i].prcode)){
                    PRselector._eventsCallback[evt].splice(i,1);
                    i--;
                }
            }
        },
        _removeAllEvents: function (key) {
            for (var i in PRselector._eventsCallback) {
                if(!key || (i.split('.')[1] && i.split('.')[1] === key)){
                    this._removeCurrentEvent(i);
                }
            }
        },

        trigger: function(evt){
            var fn,prcode,i;
            if(typeof evt !== 'string') return;
            if(evt.match(/click|mouseup|mousedown|focus|blur/)){
                (this.get(0)[evt])();
            }else{
                fn = this.get(0)['on'+evt.toLowerCase()];
                if(fn){
                    fn.call(this.get(0));
                }
                if(PRselector._eventsCallback[evt] && this.get(0).prcode){
                    prcode = this.get(0).prcode;
                    for(i in PRselector._eventsCallback[evt]){
                        if(PRselector._eventsCallback[evt][i].prcode[prcode]){
                            PRselector._eventsCallback[evt][i].callback.call(this.get(0));
                        }
                    }
                }
            }
            return this;
        },

        bind: function (evt, fn, useCapture) {
            return this.on(evt, undefined, fn, useCapture);
        },
        unbind: function (evt, fn) {
            return this.off(evt, undefined, fn);
        }
    });

    //以下是内置方法
    PRselector.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error contextmenu").split(" "),function(i,evt){
        PRselector.fn[evt] = function(fn){
            return arguments.length > 0 ?
                this.on(evt, null, fn) :
                this.trigger(evt);
        }
    })

    PRselector.fn.extend({
        mouseenter: function(fn){
            return this.each(function(){
                PRselector(this).on('mouseover',this,fn,true,true);
            });
        },
        mouseleave: function(fn){
            return this.each(function(){
                PRselector(this).on('mouseout',this,fn,true,true);
            });
        },
        hover: function(fnOver, fnOut){
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        }
    });
	
	
	
    //下面是动画，抄自zepTo
    var prefix = '', eventPrefix,
        vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
        document = window.document, testEl = document.createElement('div'),
        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
        clearProperties = {}

    function downcase(str) { return str.toLowerCase() }
    function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

    PRselector.each(vendors, function(vendor, event){
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
                    clearProperties[prefix + 'animation-duration'] = '';

    PRselector.fx = {
        off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
        cssPrefix: prefix,
        transitionEnd: normalizeEvent('TransitionEnd'),
        animationEnd: normalizeEvent('AnimationEnd')
    };

    PRselector.fn.extend({
        animate: function(properties, duration, ease, callback){
            if (PRselector.isPlainObject(duration))
                ease = duration.easing, callback = duration.complete, duration = duration.duration;
            if (duration) duration = duration / 1000;
            return this.anim(properties, duration, ease, callback)
        },

        anim: function(properties, duration, ease, callback){
            var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = PRselector.fx.transitionEnd;
            if (duration === undefined) duration = 0.4;
            if (PRselector.fx.off) duration = 0;

            if (typeof properties == 'string') {
                // keyframe animation
                cssProperties[prefix + 'animation-name'] = properties;
                cssProperties[prefix + 'animation-duration'] = duration + 's';
                endEvent = PRselector.fx.animationEnd
            } else {
                // CSS transitions
                for (key in properties)
                    if (supportedTransforms.test(key)) {
                        transforms || (transforms = []);
                        transforms.push(key + '(' + properties[key] + ')')
                    }
                    else cssProperties[key] = properties[key];

                if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ');
                if (!PRselector.fx.off && typeof properties === 'object') {
                    cssProperties[prefix + 'transition-property'] = Object.keys(properties).join(', ');
                    cssProperties[prefix + 'transition-duration'] = duration + 's';
                    cssProperties[prefix + 'transition-timing-function'] = (ease || 'linear')
                }
            }

            wrappedCallback = function(event){
                if (typeof event !== 'undefined') {
                    if (event.target !== event.currentTarget) return; // makes sure the event didn't bubble from "below"
                    PRselector(event.target).unbind(endEvent, arguments.callee)
                }
                PRselector(this).css(clearProperties);
                callback && callback.call(this)
            }
            if (duration > 0) this.bind(endEvent, wrappedCallback);

            setTimeout(function() {
                that.css(cssProperties);
                if (duration <= 0) setTimeout(function() {
                    that.each(function(){ wrappedCallback.call(this) });
                }, 0)
            }, 0);

            return this;
        }
    });



    //以下是DOM操作

    PRselector.extend({
        removeNode: function(child,parent){
            parent.each(function(){
                var _parent = this;
                child.each(function(){
                    if(this.parentNode === _parent){
                        _parent.removeChild(this);
                    }
                });
            });
        },
        dir: function (elem, dir, until) {
            var matched = [],
                cur = elem[dir];

            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !PRselector(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },

        sibling: function (n, elem) {
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        }
    });

    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);

        return cur;
    }

    var rparentsprev = /^(?:parents|prev(?:Until|All))/;
    PRselector.each({
        parent: function (elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function (elem) {
            return PRselector.dir(elem, "parentNode");
        },
        closest: function(elem){
            var dir = PRselector.dir(elem, "parentNode");
            dir.unshift(elem);
            return dir;
        },
        parentsUntil: function (elem, i, until) {
            return PRselector.dir(elem, "parentNode", until);
        },
        next: function (elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function (elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function (elem) {
            return PRselector.dir(elem, "nextSibling");
        },
        prevAll: function (elem) {
            return PRselector.dir(elem, "previousSibling");
        },
        nextUntil: function (elem, i, until) {
            return PRselector.dir(elem, "nextSibling", until);
        },
        prevUntil: function (elem, i, until) {
            return PRselector.dir(elem, "previousSibling", until);
        },
        siblings: function (elem) {
            return PRselector.sibling(( elem.parentNode || {} ).firstChild, elem);
        },
        children: function (elem) {
            return PRselector.sibling(elem.firstChild);
        },
        contents: function (elem) {
            return PRselector.nodeName(elem, "iframe") ?
            elem.contentDocument || elem.contentWindow.document :
                PRselector.merge([], elem.childNodes);
        }
    }, function (name, fn) {
        PRselector.fn[name] = function (until, selector) {
            var ret = PRselector.map(this, fn, until);

            if (name.slice(-5) !== "Until") {
                selector = until;
            }

            if (selector && typeof selector === "string") {
                ret = PRselector.filter(selector, ret);
            }
            if (this.length > 1) {
                ret = PRselector.unique(ret);
                if (rparentsprev.test(name)) {
                    ret = ret.reverse();
                }
            }

            return this.pushStack(ret);
        };
    });


    var funcArg = function(context, arg, idx, payload) {
        return PRselector.isFunction(arg) ? arg.call(context, idx, payload) : arg
    },dasherize = function(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    };
    PRselector.fn.extend({
        find: function(selector) {
            return PRselector(selector,this,true);
        },
        is: function(selector) {
            var hasSelector = false;
            this.each(function(i,obj){
                if(this === selector || matchesSelector.call(this,selector)){
                    hasSelector = true;
                    return false;
                }
            });
            return hasSelector;
        },
        addClass: function(className){
            className = ( className || "" ).match(/\S+/g) || [""];
            this.each(function(){
                for(var i in className){
                    if(!this.classList.contains(className[i])){
                        this.classList.add(className[i]);
                    }
                }
            });
            return this;
        },
        removeClass: function(className){
            className = ( className || "" ).match(/\S+/g) || [""];
            this.each(function(){
                for(var i in className) {
                    if (this.classList.contains(className[i])) {
                        this.classList.remove(className[i]);
                    }
                }
            });
            return this;
        },
        hasClass: function(className){
            var flag = this.length>0;
            this.each(function(){
                if(!this.classList.contains(className)){
                    flag = false;
                    return flag;
                }
            });
            return flag;
        },
        index: function(element){
            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },/*
        attr: function(att,val){
            if(!att){
                return this;
            }else if(typeof val == 'undefined'){
                return this._getAttr(att);
            }else{
                return this._setAttr(att,val);
            }
        },
        val: function (val) {
            if (typeof val === 'undefined') {
				  return this._getAttr('value');
            } else {
                return this.each(function(){
					  this.value = val
				  });
            }
        },
        _getAttr: function (att) {
            var val;
            if(this.get(0)){
                if (typeof this.get(0)[att] != 'undefined') {
                    val = this.get(0)[att];
                } else if (typeof this.get(0).getAttribute(att) != 'undefined') {
                    val = this.get(0).getAttribute(att)
                }
            }
            return val;
        },
        removeAttr: function(att){
            return this.each(function(i){
                this.removeAttribute(att);
            });
        },*/

        _setAttr: function(att,val){
            return this.each(function(){
                this.setAttribute(att,val);
            });
        },
        text: function(text){
            return text === undefined ?
                (this.length > 0 ? this[0].textContent : null) :
                this.each(function(){ this.textContent = text })
        },
        attr: function(name, value){
            var result,key;
            return (typeof name == 'string' && value === undefined) ?
                (this.length == 0 || this[0].nodeType !== 1 ? undefined :
                    (name == 'value' && this[0].nodeName.toLowerCase() == 'input') ? this.val() :
                        (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
                ) :
                this.each(function(idx){
                    if (this.nodeType !== 1) return;
                    if (typeof name === 'object') for (key in name) this.setAttribute(key, name[key]);
                    else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)));
                })
        },
        removeAttr: function(name){
            return this.each(function(){ if (this.nodeType === 1) this.removeAttribute(name) });
        },
        prop: function(name, value){
            return (value === undefined) ?
                (this[0] ? this[0][name] : undefined) :
                this.each(function(idx){
                    this[name] = funcArg(this, value, idx, this[name]);
                });
        },
        data: function(name, value){
            var data = this.attr('data-' + dasherize(name), value);
            return data !== null ? data : undefined;
        },
        val: function(value){
            return (value === undefined) ?
                (this.length > 0 ? this[0].value : undefined) :
                this.each(function(idx){
                    this.value = funcArg(this, value, idx, this.value);
                });
        },
        append: function(node){
            var child,_this = this;
            if(node instanceof PRselector){
                child = node;
            }else{
                child = PRselector(node);
            }
            child.each(function(){
                _this.get(0).appendChild(this);
            });
            return this;
        },
        appendTo: function(node){
            var parent,parentGroup;
            if(node instanceof PRselector){
                parentGroup = node;
            }else{
                parentGroup = PRselector(node);
            }
            parent = parentGroup.get(0);
            return this.each(function(){
                parent.appendChild(this);
            });
        },
        insertBefore: function(node){
            var subling;
            if(node instanceof PRselector){
                subling = node;
            }else{
                subling = PRselector(node);
            }
            var parent = subling.parent();
            return this.each(function(){
                parent.get(0).insertBefore(this,subling.get(0));
            });
        },
        insertAfter: function(node){
            var subling;
            if(node instanceof PRselector){
                subling = node;
            }else{
                subling = PRselector(node);
            }
            var parent = subling.parent();
            return this.each(function(){
                parent.get(0).insertBefore(this,subling.get(0));
                parent.get(0).insertBefore(subling.get(0),this);
            });
        },
        remove: function(node){
            var child;
            if(node){
                if(node instanceof PRselector){
                    child = node;
                }else{
                    child = PRselector(node);
                }
                PRselector.removeNode(child,this);
            }else if(this.parent().length>0){
                PRselector.removeNode(this,this.parent());
            }
            return this;
        },
        css: function(name,val){
            if(!name)return false;
            if(this.length<1)return typeof val === 'undefined'? false : this;

            if(PRselector.isPlainObject(name)){
                for(var i in name){
                    this.css(i,name[i]);
                }
                return this;
            }else if(typeof val === 'undefined'){
                return window.getComputedStyle(this.get(0), null).getPropertyValue(name) || '';
            }else{
                if(name.toLowerCase().match(/transform|transition/)&&!name.toLowerCase().match(/-[\w]+-/)){
                    var browser = ['-webkit-','-moz-','-ms-','-o-'];
                    for(var i in browser){
                        this.css(browser[i]+name,val);
                    }
                }
                var style = [];
                if(this.get(0).getAttribute('style')){
                    style = this.get(0).getAttribute('style').split(';');
                }
                if(!isNaN(parseFloat(val))&&parseFloat(val)+''==val&& name.toLowerCase().match(/width|height|padding|margin|left|right|top|bottom/)){
                    val+='px';
                }
                var flag = false;
                for(var i in style){
                    if(style[i].replace(/ /g,'').split(':')[0].toLowerCase() == name.toLowerCase()){
                        style[i] = name +':'+val;
                        flag = true;
                        break;
                    }
                }
                if(!flag){
                    style.push(name+':'+val);
                }
                var newStyle = style.join(';');
                this._setAttr('style',newStyle);

                return this;
            }
        },
        html: function(html){
            if(typeof html === 'undefined'){
                return typeof this.get(0) === 'undefined'? '' : this.get(0).innerHTML;
            }else{
                this.each(function(){
                    this.innerHTML = html;
                });
                return this;
            }
        },
        hide: function(){
            return this.css('display','none');
        },
        show: function(type){
            return this.css('display',type || 'block');
        },
        offset: function(){
            var elem = this.get(0);
            return {
                top: elem.offsetTop,
                left: elem.offsetLeft,
                width: elem.offsetWidth,
                height: elem.offsetHeight
            }
        },
        position: function(){
            var elem = this.get(0), offsetTop = elem.offsetTop,offsetLeft = elem.offsetLeft;

            while(elem.offsetParent!=null){
                elem = elem.offsetParent;
                offsetTop += elem.offsetTop;
                offsetLeft += elem.offsetLeft;
            }
            return {
                top: offsetTop,
                left: offsetLeft
            }
        }

    });
    ['width', 'height'].forEach(function (dimension) {
        PRselector.fn[dimension] = function (value) {
            var offset,
                body = document.body,
                html = document.documentElement,
                Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
            if (value === undefined) {
                return this[0] !== undefined? this[0] == window ?
                    html['client' + Dimension] :
                    this[0] == document ?
                        Math.max(body['scroll' + Dimension], body['offset' + Dimension], html['client' + Dimension], html['scroll' + Dimension], html['offset' + Dimension]) :
                    (offset = this.offset()) && offset[dimension] : false;
            } else {
                return this.each(function (idx) {
                    PRselector(this).css(dimension, value);
                });
            }
        };
    });


    ['width', 'height'].forEach(function (dimension) {
        var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
        PRselector.fn['outer' + Dimension] = function (margin) {
            var elem = this;
            if (elem && elem[0]) {
                var size = elem[0]['offset' + Dimension],
                    sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                sides[dimension].forEach(function (side) {
                    if (margin) {
                        size += parseInt(elem.css('margin-' + side), 10);
                    }
                });
                return size;
            } else {
                return null;
            }
        };
    });

    ['width', 'height'].forEach(function (dimension) {
        var offset, Dimension = dimension.replace(/./, function (m) { return m[0].toUpperCase(); });
        PRselector.fn['inner' + Dimension] = function () {
            var elem = this;
            if(!elem[0]) return false;
            if (elem[0]['inner' + Dimension]) {
                return elem[0]['inner' + Dimension];
            } else {
                var size = elem[0]['offset' + Dimension],
                    sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
                sides[dimension].forEach(function (side) {
                    size -= parseInt(elem.css('border-' + side + '-width'), 10);
                });

                return size;
            }
        };
    });

    ["Left", "Top"].forEach(function (name, i) {
        var method = "scroll" + name;

        function isWindow(obj) {
            return obj && typeof obj === "object" && "setInterval" in obj;
        }

        function getWindow(elem) {
            return isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
        }

        PRselector.fn[method] = function (val) {
            var elem, win;
            if (val === undefined) {
                elem = this[0];
                if (!elem) {
                    return null;
                }
                win = getWindow(elem);
                // Return the scroll offset
                return win ? ("pageXOffset" in win) ? win[i ? "pageYOffset" : "pageXOffset"] :
                win.document.documentElement[method] ||
                win.document.body[method] :
                    elem[method];
            }

            // Set the scroll offset
            this.each(function () {
                win = getWindow(this);
                if (win) {
                    var xCoord = !i ? val : PRselector(win).scrollLeft(),
                        yCoord = i ? val : PRselector(win).scrollTop();
                    win.scrollTo(xCoord, yCoord);
                } else {
                    this[method] = val;
                }
            });
        };
    });
	

    //下面是AJAX，不完善

    PRselector.extend({
        ajax: function(config){
            if(!config||!config.url)return false;
            var url = config.url;
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var type = config.type || 'GET';
            var data = config.data || null;

            var success = config.success || function(){};
            var error = config.error || function(){};
            var beforeSend = config.beforeSend || function(){};
            var cache = config.cache || function(){};


            var dataType = config.dataType || 'text',getType,isJson = false;
            dataType = dataType.toLowerCase();


            switch(dataType){
                case 'text':
                    getType = 'responseText';
                    break;
                case 'html':
                    getType = 'response';
                    break;
                case 'xml':
                    getType = 'responseXML';
                    break;
                case 'json':
                    getType = 'responseText';
                    isJson = true;
                    break;
                default:
                    getType = 'responseText';
                    break;
            }


            xhr.isJson = isJson;
            xhr.getType = getType;


            onreadystatechange = function(success, error, xhr) {
                xhr.onreadystatechange = function () {
                    var result;
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200 ||xhr.status == 0) {
                            result = xhr[xhr.getType];
                            if(xhr.isJson){
                                result = eval("(" + result + ")");
                            }
                            success(result);
                        }else{
                            error();
                        }
                    }
                }
            };

            xhr.open(type, url);
            if(type.toLowerCase() == 'post'){
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            if(!cache){
                xhr.setRequestHeader("Cache-Control","no-cache");
            }
            xhr.onreadystatechange = function(){
                onreadystatechange(success,error,xhr);
            };
            beforeSend();
            xhr.send(data);

            return xhr;
        }
    })

    window.PRselector = PRselector;
    if(typeof window.$ === 'undefined'){
        window.$ = PRselector;
    }

})