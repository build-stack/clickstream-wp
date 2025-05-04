<?php
/**
 * Plugin Name: Clickstream WP
 * Description: A WordPress plugin for clickstream tracking
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: clickstream-wp
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Include main plugin class
require_once plugin_dir_path(__FILE__) . 'includes/class-clickstream-wp.php';

/**
 * The main function responsible for returning the Clickstream_WP instance
 */
function clickstream_wp() {
    return Clickstream_WP::instance();
}

// Initialize the plugin
clickstream_wp();
