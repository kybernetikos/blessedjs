'use strict';function d(g){throw g;}var f=null;
this.Blessed=function(){function g(a){return"function"===typeof a&&a.prototype!=f?a.prototype:a}function j(a,b,c){a==f&&d(Error("unBindAt: Bad argument: parameter 'object' was null or undefined."));b==f&&d(Error("unBindAt: Bad argument: parameter 'methodName' was null or undefined."));"string"===typeof b&&"function"===typeof a[b]&&(b=a[b]);"function"!==typeof b&&d(Error("unBindAt: Bad argument: parameter 'func' should be a function or the name of a function. Was '"+b+"' (type "+typeof b+")."));c==
f&&(c=0);c===k&&(c=(b._applyLength||b.length)-1);isNaN(c)&&d(Error("unBindAt: Bad argument: parameter 'thisArgNumber' should be a number, was '"+c+"' (type "+typeof c+")."));0>c&&d(Error("unBindAt: Bad argument: parameter 'thisArgNumber' may not be negative, was '"+c+"'."));return function(){var e=Array.prototype.slice.call(arguments,void 0);e.splice(c,0,this);return b.apply(a,e)}}var k={toString:function(){return"LAST_ARG"}};return{LAST_ARG:k,unBindAt:j,bless:function(a,b,c){b==f&&d(Error("bless: Bad argument: 'benediction' is null or undefined."));
a==f&&d(Error("bless: Bad argument: 'blessee' is null or undefined."));var a=g(a),b=g(b),e;for(e in b)a[e]==f&&(a[e]="function"===typeof b[e]?j(b,e,c):b[e])},extend:function(a,b){function c(){this.parent=b}a==f&&d(Error("extend: Bad argument: argument 'subclass' may not be null or undefined."));b==f&&d(Error("extend: Bad argument: argument 'superclass' may not be null or undefined."));if(a.prototype&&a.prototype.constructor===a)for(var e in a.prototype)!0===a.prototype.hasOwnProperty(e)&&d(Error("extend: Already extended: prototype has property '"+
e+"'."));else d(Error("extend: Already extended."));c.prototype=b.prototype;a.prototype=new c},mixin:function(a,b){var c,e,h,i;a==f&&d(Error("mixin: Bad argument: 'child' was null or undefined."));a=g(a);c=1;for(e=arguments.length;c<e;++c)for(h in i=g(arguments[c]),i)!1===a.hasOwnProperty(h)&&(a[h]=i[h]);return a},assertImplements:function(a,b){a==f&&d(Error("assertImplements: Bad argument: 'child' was null or undefined."));b==f&&d(Error("assertImplements: Bad argument: 'interface' was null or undefined."));
var b=g(b),c;for(c in b)a[c]==f&&d(Error("Interface property '"+c+"' is not implemented."))}}}();
