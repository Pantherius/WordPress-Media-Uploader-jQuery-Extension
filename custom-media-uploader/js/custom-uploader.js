;(function ( $, window, document, undefined ) {

	"use strict";

		/** Create the defaults once **/
		var pluginName = "wpmediauploader",
				defaults = {
				preview		 	: '.preview-upload',
				target    		: '.uploaded',
				button  		: '.button-upload',
				title	  		: 'Upload an image',
				container		: '',
				indexcontainer	: '.slide_container',
				mode 			: 'append',
				type			: 'multi',
				callback		: false
		};
/** Define default variables **/
var appender = '', appended_images = 0, selection = '', objImage = {}, opts = {};
/** The actual plugin constructor **/
function Plugin ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
}

/** Avoid Plugin.prototype conflicts **/
$.extend( Plugin.prototype, {
		init: function () {
		opts = this.settings;
			/** Registering the function when the Uploader Button has clicked... **/
			var openNewImageDialog = function(title, onInsert, isMultiple, opts){
				if( isMultiple == undefined ) {
					isMultiple = false;
				}

				/** Initialize the Media Library with parameters **/
				var frame = wp.media({
						title : title,
						multiple : true,
						library : { type : 'image'},
						button : { text : 'Insert' },
						opts: opts
					});

				/** Select images in Media Uploader Window **/
				frame.on( 'select', function() {
					selection = frame.state().get( 'selection' );
					appended_images = $( opts.indexcontainer ).length;

					/** Clear the variable **/
					appender = '';

						/** Return image object in multi mode **/
						selection.map( function( attachment ) {
							objImage = attachment.toJSON();
							appended_images++;

							/** Adding multiple images or insert single image **/
							if ( opts.type == 'multi' ) {
								appender += opts.container;
							}
							else {
								appender = opts.container;
							}
							
							/** replacing smart tags with values by regex **/
							appender = appender.replace( /\[content]/g, objImage.url).replace( /\[objImageUrl]/g, objImage.url ).replace( /\[index]/g, appended_images );
						});

						/** Append or insert the image(s) to the target container **/
						if ( opts.mode == 'append' ) {
							$( opts.target ).append( appender );
						}
						else {
							$( opts.target ).html( appender );
						}

						/** Call the defined callback function if exists **/
						if ( opts.callback != false ) {
							$( opts.callback ).call;
						}
				});

				/** Open Media Uploader Window **/
				frame.open();
			}						
				
				/** Trigger the uploader button **/
				$( document ).on( "click", opts.button , function() {
					openNewImageDialog( opts.title, '', true, opts );
					return false;
				});
}
});
		$.fn[ pluginName ] = function ( options ) {
				return this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});
		};
})( jQuery, window, document );