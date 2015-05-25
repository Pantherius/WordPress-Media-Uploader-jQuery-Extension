jQuery( document ).ready( function( $ ) {
var data = {}, rmdni = false, photos = [], savebutton = $(".save-container");
var savebutton_text = "<a href='#' class='button button-primary saveimages'>"+plugin_admin_datas.languages.saveimages+"</a>";
	$( ".image-upload" ).wpmediauploader({
		"button":".image-upload",
		"target":".uploaded_image",
		"container":"<div class=\"image_container\"><img src=\"[content]\"><input type=\"hidden\" class=\"upl_image upl-photo\" name=\"image[]\" value=\"[objImageUrl]\"><div><input class=\"remove_customimage_button button remove-button\" type=\"button\" value=\""+plugin_admin_datas.languages.remove+"\" /></div></div>",
		"mode":"insert",
		"indexcontainer":"",
		"type":"single",
		"callback":function(){
			include_save_button();
		}
	});
$( document ).on( "click", ".remove_customimage_button", function( event ) {
	event.preventDefault();
	$( this ).parentsUntil( ".uploaded_image" ).html("<div class=\"imageelement\"><div class=\"uploaded_image\"><input class=\"image-upload button add-button\" type=\"button\" value=\""+plugin_admin_datas.languages.addimage+"\" /></div></div>");
	include_save_button();
	return false;
});

$( document ).on( "click", ".remove_savedimage_button", function( event ) {
	event.preventDefault();
	$( this ).parentsUntil( ".imageelement" ).remove();
	include_save_button();
	return false;
});
$( document ).on( "click" , ".saveimages", function( event ) {
	event.preventDefault();
	if (rmdni==false)
	{
		photos = [];
		savebutton.html( '<img width="20" style="margin-left:50px;" src="'+plugin_admin_datas.plugin_url+'/img/preloader.gif">' );
	$( ".upl-photo" ).each(function( index ) {
		photos.push( $( this ).val() );
	})
		if ( photos.legth === 0 ) {
			savebutton.html( savebutton_text + "<div class='error'><strong>"+plugin_admin_datas.languages.nothingtosave+"</strong></div>" );
		}
		else {
		data = {
			action: 'save_images',
			images: JSON.stringify( photos )
			};
			
			$.post( plugin_admin_datas.admin_url, data, function( response ) {
				if ( response.indexOf( "success" ) >= 0 ) {
					savebutton.html( "<span><strong>"+plugin_admin_datas.languages.success+"</strong></span>" );
					setTimeout(function(){
						savebutton.html( savebutton_text )
					}, 2000 );
				}
				else {
					savebutton.html( savebutton_text + "<div class='error'><strong>"+response+"</strong></div>" );
				}
				rmdni = false;
			});
		}
	};		
});
 	function include_save_button() {
		if ( $( ".save-container" ).html() == "" ) {
			$( ".save-container" ).html( savebutton_text );
		}	
	}
})