// var console = jstestdriver.console;
describe("BlessedJSTest:", function() {
	describe("bless", function() {
		
		var bless = Blessed.bless;
		var FooUtils = {
				addToAVal: function (fooObj, parm1) { return fooObj.aVal + parm1;},
		};
		function Foo(aVal) {
			this.aVal = aVal;
		}
		describe("on an object", function() {
			it("should add an equivalent function with the same name as the one it's been blessed with.", function() {
				var testFoo = new Foo(44);
				bless(testFoo, FooUtils);
				expect(testFoo.addToAVal(21)).toEqual(FooUtils.addToAVal(testFoo, 21));
			});
			it("should not overwrite a method that is already on the target.", function() {
				var testFoo = new Foo(40);
				testFoo.addToAVal = function() {return this.aVal / 2;};
				bless(testFoo, FooUtils);
				expect(testFoo.addToAVal(21)).toEqual(20);
				expect(FooUtils.addToAVal(testFoo, 21)).toEqual(61);
			});
			it("should work when called a second time too.", function(){
				var OtherFooUtils = {
						doubleAVal: function(testFoo) {return testFoo.aVal * 2;}
				};
				var testFoo = new Foo(40);
				bless(testFoo, FooUtils);
				bless(testFoo, OtherFooUtils);
				expect(testFoo.addToAVal(21)).toEqual(61);
				expect(testFoo.doubleAVal()).toEqual(80);
			});
		});
		describe("on a 'class'", function() {
			it("should mean that future instances of the class are also blessed.", function(){
				function RichFoo(aVal) {this.aVal = aVal;};
				bless(RichFoo, FooUtils);
				var testFoo1 = new RichFoo(45);
				expect(testFoo1.addToAVal(21)).toEqual(FooUtils.addToAVal(testFoo1, 21));
				var testFoo2 = new RichFoo(13);
				expect(testFoo2.addToAVal(4)).toEqual(FooUtils.addToAVal(testFoo2, 4));
			});
		});
	});
	
	describe("unBindAt", function() {
		var FooUtils = {
				addToAVal: function (fooObj, parm1) { return fooObj.aVal + parm1;},
				reverseAddToAVal: function(parm1, fooObj) { return fooObj.aVal + parm1;},
				manyArgsAndAVal: function(parm1, parm2, parm3, fooObj) { return fooObj.aVal * (parm1 + parm2 + parm3);}
		};
		function Foo(aVal) {
			this.aVal = aVal;
		}
		var testFoo = new Foo(22);
		var FUNCTION_NAME = true;
		var RAW_FUNCTION = false;
		
		describe("when called with a function name", function() {
			shouldWorkWhenFunctionIsA (FUNCTION_NAME);
		});
		describe("when called with a function", function() {
			shouldWorkWhenFunctionIsA (RAW_FUNCTION);
		});

		function shouldWorkWhenFunctionIsA(useFuncName) {
			describe("and a specified parameter number", function() {
				it("should insert the 'this' pointer in the correct place.", function(){
					var func = useFuncName ? "reverseAddToAVal" : FooUtils.reverseAddToAVal;
					var returnedFunc = Blessed.unBindAt(FooUtils, func, 1);
					expect(returnedFunc.call(testFoo, 9)).toEqual(FooUtils.reverseAddToAVal(9, testFoo));
				});
			});
			describe("and no specified parameter number", function() {
				it("should insert the 'this' pointer as the first argument.", function() {
					var func = useFuncName ? "addToAVal" : FooUtils.addToAVal;
					var returnedFunc = Blessed.unBindAt(FooUtils, func);
					expect(returnedFunc.call(testFoo, 9)).toEqual(FooUtils.addToAVal(testFoo, 9));
				});
			});
			describe("and the LAST_ARG marker object", function() {
				it("should insert the 'this' pointer as the last argument.", function() {
					var func = useFuncName ? "manyArgsAndAVal" : FooUtils.manyArgsAndAVal;
					var returnedFunc = Blessed.unBindAt(FooUtils, func, Blessed.LAST_ARG);
					expect(returnedFunc.call(testFoo, 1, 3, 4)).toEqual(FooUtils.manyArgsAndAVal(1, 3, 4, testFoo));
				});
			});
		}
	});
	
	describe("extend", function() {
		function Superclass(arg) {
			this.oneThingSetInSuper = 5;
			this.otherThingSetInSuper = arg * 2;
		}
		Superclass.prototype.method = function() {return "super.method";};
		Superclass.prototype.otherMethod = function() {return "super.otherMethod";};

		it("should allow a subclass to easily call the superconstructor.", function() {
			function Subclass() {
				this.parent(5);
			}
			Blessed.extend(Subclass, Superclass);
			var testObj = new Subclass();
			expect(testObj.otherThingSetInSuper).toEqual(5 * 2);
		});
		
		it("should not allow a subclass to be extended twice.", function() {
			function Subclass() {}
			Blessed.extend(Subclass, Superclass);
			expect(function() {
				Blessed.extend(Subclass, Superclass);
			}).toThrow("extend: Already extended.");
		});
		
		it("should not allow a subclass to be extended if its prototype has been modified.", function() {
			function Subclass() {}
			Subclass.prototype.bob = "hello";
			expect(function() {
				Blessed.extend(Subclass, Superclass);
			}).toThrow("extend: Already extended: prototype has property 'bob'.");
		});
		
		it("should cause the superclasses properties to become accessible on the subclass unless overridden.", function() {
			function Subclass(arg) {
				this.parent(arg);
				this.oneThingSetInSuper = 21;
			}
			Blessed.extend(Subclass, Superclass);
			Subclass.prototype.method = function() {return "sub.method";};
			var testObj = new Subclass(10);
			expect(testObj.oneThingSetInSuper).toEqual(21);
			expect(testObj.otherThingSetInSuper).toEqual(10 * 2);
			expect(testObj.method()).toEqual("sub.method");
			expect(testObj.otherMethod()).toEqual("super.otherMethod");
		});
		it("should not stop you from extending subclasses if the object prototype has been modified.", function() {
			function Subclass() {};
			Object.prototype.____MY_ATTR = 10;
			Blessed.extend(Subclass, Superclass);
			delete Object.prototype.____MY_ATTR;
		});
	});
	describe("mixin", function() {
		var child = {mine: 6};
		var mix1 = {bob: 5};
		var mix2 = {jim: 10};
		var mix3 = {jim: 11, mine: 0, last:11};
		it("should copy properties from the mixins except where they already exist.", function() {
			Blessed.mixin(child, mix1, mix2, mix3);
			expect(child.mine).toEqual(6);
			expect(child.bob).toEqual(5);
			expect(child.jim).toEqual(10);
			expect(child.last).toEqual(11);
		});
	});
	describe("assertImplements", function() {
		var simpleInterfaceFormat = {clone:true,eatVegetable:true};
		var moreDetailedInterfaceFormat = {stomp: function() {}};
		
		it("should throw an error if the provided object does not implement a required property.", function() {
			var testObj = {eatVegetable: function(){}};
			expect(function() {
				Blessed.assertImplements(testObj, simpleInterfaceFormat);
			}).toThrow("Interface property 'clone' is not implemented.");
			expect(function() {
				Blessed.assertImplements(testObj, moreDetailedInterfaceFormat);
			}).toThrow("Interface property 'stomp' is not implemented.");
		});
	});
});