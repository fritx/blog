/** Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */ 
// Inspired by base2 and Prototype
/*
 * modified by h5-Lium / http://weibo.com/hellolium
 * support statics: MyClass._.xxx, MyClass.xxx
 * provide Class reference: myInstance._class
*/
(function(){
	var _initializing = false;
	this.Class = function(){};
	Class._ = {};
	Class.extend = function(prop, statics) {
		function Class() {
			if (! _initializing && this.init)
				this.init.apply(this, arguments);
		}
		Class.constructor = Class;
		Class.extend = arguments.callee;
		var _super = this.prototype;
		_initializing = true;
		var prototype = new this();
		_initializing = false;
		
		for (var k in prop) {
			prototype[k] = typeof prop[k] === 'function'
				&& typeof _super[k] === 'function'?
				(function(k, fn){
					return function(){
						var tmp = this._super;
						this._super = _super[k] || function(){};
						var ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(k, prop[k]): prop[k];
		}
		
		Class._ = {};
		for (var k in this._) {
			Class._[k] = this._[k];
			Class[k] = Class._[k];
		}
		for (var k in statics) {
			Class._[k] = statics[k];
			Class[k] = Class._[k];
		}
		prototype._class = Class;
		
		Class.prototype = prototype;
		return Class;
	};
})();