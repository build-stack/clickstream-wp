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

// Include admin page files
require_once plugin_dir_path(__FILE__) . 'admin.php';
require_once plugin_dir_path(__FILE__) . 'setup.php';
require_once plugin_dir_path(__FILE__) . 'privacy.php';

// Plugin initialization
function clickstream_wp_init() {
    // Initialization code
}
add_action('init', 'clickstream_wp_init');

// Register plugin settings
function clickstream_wp_register_settings() {
    register_setting(
        'clickstream_wp_options',
        'clickstream_tracking_enabled',
        array(
            'type' => 'boolean',
            'default' => false,
            'sanitize_callback' => 'sanitize_clickstream_options'
        )
    );
}
add_action('admin_init', 'clickstream_wp_register_settings');

// Sanitize options
function sanitize_clickstream_options($input) {
    return isset($input) ? true : false;
}

// Enqueue tracking script when enabled
function clickstream_wp_enqueue_scripts() {
    if (get_option('clickstream_tracking_enabled', false)) {
        // Define the script URL
        $script_url = 'http://localhost:8080/clickstream.min.js'; // Replace with your actual script URL
        
        // Enqueue the script in the head
        wp_enqueue_script('clickstream-tracking', $script_url, array(), '1.0.0', false);
        
        // Alternatively, you can directly output the script tag in the head
        add_action('wp_head', 'clickstream_wp_output_tracking_script');
    }
}
add_action('wp_enqueue_scripts', 'clickstream_wp_enqueue_scripts');

// Output tracking script directly in the head if needed
function clickstream_wp_output_tracking_script() {
    ?>
    <!-- Clickstream Tracking Code -->
    <script>
        // Initialize the tracker
        const tracker = new Clickstream.ClickstreamTracker({
            samplingRate: 1, // Record all events
            maskAllInputs: false, // Mask input values for privacy
            encodingType: Clickstream.PayloadEncoding.NONE,
            // encryptionKey: "your-secret-key-here"
        });

        tracker.start();
    </script>
    <?php
}
