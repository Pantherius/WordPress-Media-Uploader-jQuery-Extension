<?php
defined( 'ABSPATH' ) OR exit;

 /*
 * Plugin Name: Custom Media Uploader
 * Description: WordPress Image Uploader plugin extension
 * Author: Pantherius
 * Version: 1.0
 * Author URI: http://pantherius.com
 */
 
function custom_media_uploader() {
	if ( isset( $_REQUEST["page"] ) ) {
		$settings_page = $_REQUEST["page"];
	}
	else {
		$settings_page = "";
	}
	if ( $settings_page == "custom_media_uploader" ) {
		add_action( "admin_enqueue_scripts", "admin_scripts_and_styles" );
	}
	$plugin = plugin_basename( __FILE__ );
	add_action( "admin_menu", "add_menu" );
	add_filter( "plugin_action_links_$plugin", "plugin_settings_link" );
/**
* Define the AJAX handler functions
**/	
	add_action( "wp_ajax_save_images", "save_images" );
	add_action( "wp_ajax_nopriv_save_images", "save_images" );
}

/**
* Enqueue scripts and styles to admin
**/
function admin_scripts_and_styles() {
	wp_enqueue_style( "plugin_admin_style", plugins_url( "/css/custom-media-uploader.css", __FILE__ ) );
	wp_enqueue_media();
	wp_enqueue_script( "wpmedia-uploader", plugins_url( "/js/custom-uploader.js", __FILE__ ), array( "jquery" ) );
	wp_register_script( "plugin_admin_script", plugins_url( "/js/custom-media-uploader.js", __FILE__ ), array( "jquery", "wpmedia-uploader" ) );
	wp_localize_script( "plugin_admin_script", "plugin_admin_datas", array(
																	"languages" => array(
																				"addimage" => __( "Add Image", "custom_media_uploader" ),
																				"remove" => __( "REMOVE", "custom_media_uploader" ),
																				"saveimages" => __( "SAVE IMAGES", "custom_media_uploader" ),
																				"nothingtosave" => __( "Nothing to Save", "custom_media_uploader" ),
																				"success" => __( "Success", "custom_media_uploader" )
																				),
																	"plugin_url" => plugins_url( "", __FILE__ ),
																	"admin_url" => admin_url( "admin-ajax.php" )
																	)
																);
	wp_enqueue_script( "plugin_admin_script" );
}

/**
* Add the settings link to the plugins page
**/
function plugin_settings_link( $links ) { 
	$settings_link = "<a href='options-general.php?page=custom_media_uploader'>Settings</a>";
	array_unshift( $links, $settings_link ); 
	return $links; 
}

/**
* Add a page to manage this plugin's settings
**/		
function add_menu() {
	add_options_page( "Custom Media Uploader", "Custom Media Uploader", "manage_options", "custom_media_uploader", "plugin_settings_page" );
}

/**
* Menu Callback
**/		
function plugin_settings_page() {
	if( ! current_user_can( "manage_options" ) ) {
		wp_die( __("You do not have sufficient permissions to access this page.", "custom_media_uploader") );
	}
	echo "<h2>Custom Media Uploader Admin Panel</h2>";
	if ( get_option( "custom-media-uploader-images", false ) ) {
		$images = json_decode( stripcslashes( get_option( "custom-media-uploader-images" ) ) );
		foreach ( $images as $key => $value ) {
			echo "<div class='imageelement'><div class='image_container'><img src='".$value."'><input type='hidden' class='upl_image upl-photo' name='image[]' value='".$value."'><div><input class='remove_savedimage_button button remove-button' type='button' value='".__( 'REMOVE', 'custom_media_uploader' )."' /></div></div></div>";
		}
	}
	echo "<div class='imageelement'><div class='uploaded_image'><input class='image-upload button add-button' type='button' value='".__( 'Add Image', 'custom_media_uploader' )."' /></div></div>";
	echo "<div class='save-container'></div>";
}
/*
* Saving the images via AJAX
**/
function save_images() {
	if ( isset($_REQUEST['images']) ) {
		$images = sanitize_text_field( $_REQUEST['images'] );
	}
	else {
		$images = "";
	}
	if ( ! empty( $images ) ) {
		update_option( "custom-media-uploader-images", $images );
		die( "success" );
	}
	else {
		die( __( "Nothing to Save", "custom_media_uploader" ) );
	}
}
custom_media_uploader();
?>