/* global HTMLElement, Person */

/**
 * Bridget makes jQuery widgets
 * v1.0.1
 * MIT license
 */

// // This function is called immediately. The second function is passed in
// as the factory parameter to this function.
(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define(["jquery"], factory);
	}
	else if(typeof module === "object" && module.exports) {
		var jQuery;
		try {
			jQuery = require("jquery");
		}
		catch (err) {
			jQuery = null;
		}
		module.exports = factory(jQuery);
	}
	else {
		root.Person = factory(root.jQuery);
	}
}(this,function($) {
	var Person;

	(function( $ ) {

		'use strict';

		// -------------------------- utils -------------------------- //

		var slice = Array.prototype.slice;

		function noop() {}

		// -------------------------- definition -------------------------- //

		function defineBridget( $ ) {

			// bail if no jQuery
			if ( !$ ) {
				return;
			}

			// -------------------------- addOptionMethod -------------------------- //

			/**
			 * adds option method -> $().plugin('option', {...})
			 * @param {Function} PluginClass - constructor class
			 */
			function addOptionMethod( PluginClass ) {
				// don't overwrite original option method
				if ( PluginClass.prototype.option ) {
					return;
				}

			  // option setter
			  PluginClass.prototype.option = function( opts ) {
			    // bail out if not an object
			    if ( !$.isPlainObject( opts ) ){
			      return;
			    }
			    this.options = $.extend( true, this.options, opts );
			  };
			}


			// -------------------------- plugin bridge -------------------------- //

			// helper function for logging errors
			// $.error breaks jQuery chaining
			var logError = typeof console === 'undefined' ? noop :
			  function( message ) {
			    console.error( message );
			  };

			/**
			 * jQuery plugin bridge, access methods like $elem.plugin('method')
			 * @param {String} namespace - plugin name
			 * @param {Function} PluginClass - constructor class
			 */
			function bridge( namespace, PluginClass ) {
			  // add to jQuery fn namespace
			  $.fn[ namespace ] = function( options ) {
			    if ( typeof options === 'string' ) {
			      // call plugin method when first argument is a string
			      // get arguments for method
			      var args = slice.call( arguments, 1 );

			      for ( var i=0, len = this.length; i < len; i++ ) {
			        var elem = this[i];
			        var instance = $.data( elem, namespace );
			        if ( !instance ) {
			          logError( "cannot call methods on " + namespace + " prior to initialization; " +
			            "attempted to call '" + options + "'" );
			          continue;
			        }
			        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
			          logError( "no such method '" + options + "' for " + namespace + " instance" );
			          continue;
			        }

			        // trigger method with arguments
			        var returnValue = instance[ options ].apply( instance, args);

			        // break look and return first value if provided
			        if ( returnValue !== undefined && returnValue !== instance) {
			          return returnValue;
			        }
			      }
			      // return this if no return value
			      return this;
			    } else {
			      var objects = this.map( function() {
			        var instance = $.data( this, namespace );
			        if ( instance ) {
			          // apply options & init
			          instance.option( options );
			          instance._init();
			        } else {
			          // initialize new instance
			          instance = new PluginClass( this, options );
			          $.data( this, namespace, instance );
			        }
			        return $(this);
			      });

			      if(!objects || objects.length > 1) {
			      	return objects;
			      } else {
			      	return objects[0];
			      }
			    }
			  };

			}

			// -------------------------- bridget -------------------------- //

			/**
			 * converts a Prototypical class into a proper jQuery plugin
			 *   the class must have a ._init method
			 * @param {String} namespace - plugin name, used in $().pluginName
			 * @param {Function} PluginClass - constructor class
			 */
			$.bridget = function( namespace, PluginClass ) {
			  addOptionMethod( PluginClass );
			  bridge( namespace, PluginClass );
			};

			return $.bridget;

		}

	  	// get jquery from browser global
	  	defineBridget( $ );

	})( $ );

	(function($){

		/**
		 * @class Person
		 * @param {String|HTMLElement} element
		 * @param {Object} options
		 * @param {String} options.name Name of person
		 * @param {String} options.age Age of person
		 * @returns {Person}
		 */
		Person = function(element, options) {
			createNewPerson.call(this, element, options);
			return this;
		};

		function createNewPerson(element, options) {

			if(typeof element === "string") {
				this.element = document.querySelector(element);
			} else if(element instanceof HTMLElement) {
				this.element = element;
			}

			/*************************************************
							Process Options
			**************************************************/
			options = options ? options : {};
			var optionTypes = Object.keys(this.defaultOptions);

			for(var i = 0; i < optionTypes.length; i++) {
				var optName = optionTypes[i];

				// First check if an option was passed in via the constructor
				var val = options[optName];
				// If no data attrib, then check data atrributes
				val = (typeof val !== 'undefined') ? val : getDataAttrib(this.element, optName);
				// Finally, if nothing was specified, use the defaults
				val = (val !== null) ? val : this.defaultOptions[optName];

				// Set all options on the instance of the Slider
				if(!this.options) {
					this.options = {};
				}
				this.options[optName] = val;
			}

			function getDataAttrib(element, optName) {
				var dataName = "data-slider-" + optName.replace(/_/g, '-');
				var dataValString = element.getAttribute(dataName);

				try {
					return JSON.parse(dataValString);
				}
				catch(err) {
					return dataValString;
				}
			}

		}

		/**
		 * @memberOf Person
		 */
		Person.prototype = {

			_init: function() {}, // NOTE: Must exist to support bridget

			constructor: Person,

			defaultOptions: {
				name:'no name',
			},

			/**
			 * Get the name of person
			 * @returns {String} name
			 */
			getName: function() {
				return this.options.name;
			},

			/**
			 * Set the name of Person
			 * @param {String} name Name of Person
			 */
			setName: function(name) {
				this.options.name = name;
			},

			/**
			 * Get the age of Person
			 * @returns {Integer}
			 */
			getAge: function() {
				return this.options.age;
			},

			/**
			 * Set the age of person
			 * @param {Integer} age Age of Person
			 */
			setAge: function(age) {
				this.options.age = age;
			}
		};

		/*********************************
			Attach to global namespace
		*********************************/
		if($) {
			var namespace = $.fn.Person ? 'Person2' : 'Person';
			$.bridget(namespace, Person);
		}

	})($);

	return Person;
}));
