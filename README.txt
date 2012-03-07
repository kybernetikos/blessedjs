BlessedJS is the minimal library that I want for writing small, fun
experiments with JS.

I will add to it over time, but the core provides the absolute minimum.
   
   mixin(object, mixins...)
   		Copies properties from the mixins to the object.  Without overwriting.
   		Can work on objects or constructor functions.
   		
   extend(subclass, superclass)
   		Sets up the prototype chain. Makes it easy to call the superconstructor.
   		Throws errors if the prototype chain has already been modified.  Works
   		with multiple levels of inheritance.  Doesn't confusion definition-time
   		and construction-time.  Very simple.
   
   assertImplements(object, interface)
   		Throws an error if a declared object does not implement all the items
   		on an 'interface' object. Useful for documenting relationships and
   		failing fast if someone changes something.
   
   unBindAt(object, function, [argument number])
   		Converts a utility function that takes the subject it is to operate on
   		as a parameter into a method where the subject is the object before the .
   
   bless(blessee, benediction)
   		Does a batch unBindAt on all of the functions in 'benediction', copying
   		them to 'blessee' as methods.

I have tried to ensure that it works with the closure compiler, and that the core
supports IE6 up. I have other modules to add that are ecmascript 5 only.