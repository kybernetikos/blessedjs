this["Functional"] = (function() {
	"use strict";
	
	function toArray(arg, skipping) {return Array.prototype.slice.call(arg, skipping);}

	var basic = {
			'or': function or(a, b) {return a || b;},
			'and': function and(a, b) {return a && b;},
			'mod': function mod(a, b) {return a % b;},
			'plus': function plus(a, b) {return a + b;},
			'from': function from(a, b) {return a - b;},
			'take': function take(b, a) {return a - b;},
			'times': function times(a, b) {return a * b;},
			'divide': function divide(dividend, divisor) {return dividend / divisor;},
			'by': function by(divisor, dividend) {return dividend / divisor;},
			'less': function less(smaller, bigger) {return smaller < bigger;},
			'greater': function greater(bigger, smaller) {return bigger > smaller;},
			'lessOrEqual': function lessOrEqual(a, b) {return a <= b;},
			'greaterOrEqual': function greaterOrEqual(a, b) {return a >= b;},
			'equal': function equal(a, b) {return a == b;},
			'same': function same(a, b) {return a === b;},
			'type': function type(a) {return typeof a;},
			'get': function get(attr, obj) {return obj[attr];},
			'set': function set(attr, value, obj) {return obj[attr] = value;},
			'apply': function apply(func, args, self) {
				return func.apply(self, args);
			},
			'call': function call(func) {
				var args = toArray(arguments, 1);
				return func.apply(this, args);
			},
			'instance': function instance(clazz, example) {return example instanceof clazz;},
	};
	// Opposite way round - nice for currying.
	basic["greaterThan"] = basic["less"];
	basic["lessThan"] = basic["greater"];
	basic["greaterThanOrEqual"] = basic["lessOrEqual"];
	basic["lessThanOrEqual"] = basic["greaterOrEqual"];
	
	function curry(func, minArgs) {
		if (func["_curried"]) return func;
		if (minArgs == undefined) minArgs = (func["_applyLength"] || func.length);
		if (minArgs === 0) {
			return func;
		}
		function funcWithArgsFrozen(frozenargs) {
			var result = function returnedFunc() {
				if (arguments.length === 0) {
					return returnedFunc;
				}
				var args = toArray(arguments);
				var newArgs = frozenargs.concat(args);
				if (newArgs.length >= minArgs) {
					return func.apply(this, newArgs);
				} else {
					return funcWithArgsFrozen(newArgs);
				}
			};
			result["_curried"] = true;
			result["_applyLength"] = minArgs - frozenargs.length;
			return result;
		};
		return funcWithArgsFrozen([]);
	}
	
	function curryAll(obj) {
		for (var prop in obj) {
			if (typeof obj[prop] == 'function') {
				obj[prop] = curry(obj[prop]);
			}
		}
	};

	function makeMulti(func) {
		return curry(function(){
			var args = toArray(arguments);
			return args.reduce(func);
		}, func.length);
	}
	
	function backwardsApplyReturningArray(args, func) {
		return [func.apply(this, args)];
	}
	
	function flip(func) {
		return curry(function(a, b) {
			var args = toArray(arguments);
			args[0] = b;
			args[1] = a;
			return func.apply(this, args);
		}, Math.max(2, (func._applyLength || func.length)));
	};
	
	function lazyCall(func) {
		if (func["_lazy"]) return func;
		var args = toArray(arguments, 1);
		var result = null;
		var evaluated = false;
		var lazyFunc = function() {
			if (! evaluated) {
				result = func.apply(this, args);
				evaluated = true;
			}
			return result;
		};
		lazyFunc["_lazy"] = true;
		lazyFunc["_applyLength"] = func._applylength || func.length;
		return lazyFunc;
	}
	
	var compose = curry(function compose(f, g) {
		var funcs = toArray(arguments);
		var composedFunc = function composedFunc() {
			return funcs.reduceRight(backwardsApplyReturningArray, toArray(arguments))[0];
		};
		composedFunc["_applyLength"] = funcs[funcs.length - 1].length;
		return composedFunc;
	});
	
	var pipe = function pipe(f, g) {
		var funcs = toArray(arguments);
		var result = function() {
			return funcs.reduce(backwardsApplyReturningArray, toArray(arguments))[0];
		};
		result["_applyLength"] = (f._applyLength || f.length);
		return result;
	};
	
	var and = curry(function and(comp1, comp2) {
		var comparisons = toArray(arguments);
		return function() {
			var args = toArray(arguments);
			return comparisons.every(applyArgsToFunc(args));
		};
	});
	
	var or = curry(function or(comp1, comp2) {
		var comparisons = toArray(arguments);
		return function() {
			var args = toArray(arguments);
			return comparisons.some(applyArgsToFunc(args));
		};
	});
	
	function divisibleBy(num) {
		return curry(function(x) {
			return x % num == 0;
		});
	}
	
	return {
		"basic":basic,
		"plus":makeMulti(basic["plus"]), "minus":makeMulti(basic["from"]), "times":makeMulti(basic["times"]), "divide":curry(basic["by"]),
		"less": curry(basic["lessThan"]), "equal": curry(basic["equal"]), "mod":curry(basic["mod"]), "lessOrEqual":curry(basic["lessThanOrEqual"]), "greater":curry(basic["greaterThan"]), "greaterOrEqual":curry(basic["greaterThanOrEqual"]), same:curry(basic["same"]),
		"and": and, "or": or, "divisibleBy":divisibleBy,
		"compose": compose, "pipe":pipe, "flip":flip, "apply":curry(basic["apply"]), "ylppa":flip(basic["apply"]), "call":curry(basic["call"]), "curry": curry,
		"get":curry(basic["get"]), "curryAll":curryAll
	};
})();