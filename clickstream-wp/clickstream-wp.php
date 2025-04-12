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
require_once plugin_dir_path(__FILE__) . 'home.php';
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
            'sanitize_callback' => 'sanitize_clickstream_tracking_enabled'
        )
    );
    
    register_setting(
        'clickstream_wp_options',
        'clickstream_environment_id',
        array(
            'type' => 'string',
            'default' => '',
            'sanitize_callback' => 'sanitize_clickstream_environment_id'
        )
    );
}
add_action('admin_init', 'clickstream_wp_register_settings');

// Sanitize options
function sanitize_clickstream_tracking_enabled($input) {
    return isset($input) ? true : false;
}

function sanitize_clickstream_environment_id($input) {
    return sanitize_text_field($input);
}

// Enqueue tracking script when enabled
function clickstream_wp_enqueue_scripts() {
    $tracking_enabled = get_option('clickstream_tracking_enabled', false);
    $environment_id = get_option('clickstream_environment_id', '');
    
    if ($tracking_enabled && !empty($environment_id)) {
        // Define the script URL
        $script_url = 'https://clickstream-core-packages-prod.s3.eu-central-1.amazonaws.com/clickstream-core/1.2.0/clickstream.min.js'; // Replace with your actual script URL
        
        // Enqueue the script in the head
        wp_enqueue_script('clickstream-tracking', $script_url, array(), '1.0.0', false);
        
        // Alternatively, you can directly output the script tag in the head
        add_action('wp_head', 'clickstream_wp_output_tracking_script');
    }
}
add_action('wp_enqueue_scripts', 'clickstream_wp_enqueue_scripts');

// Output tracking script directly in the head if needed
function clickstream_wp_output_tracking_script() {
    $environment_id = get_option('clickstream_environment_id', '');
    if (empty($environment_id)) {
        return; // Don't output the script if environment ID is not set
    }
    ?>
    <!-- Clickstream Tracking Code -->
    <script>
        // Initialize the tracker
        // Provided by Clickstream.io Team.
        const tracker = new Clickstream.ClickstreamTracker({
            samplingRate: 1, // Record all events
            maskAllInputs: false, // Mask input values for privacy
            remoteEndpoint: 'http://ec2-52-59-73-49.eu-central-1.compute.amazonaws.com:3000/events',
            maxEvents: 50,
            environmentId: '<?php echo esc_js($environment_id); ?>', // Custom environment identifier
        });

        tracker.start();
    </script>
    <?php
}

// Add admin menu
function clickstream_wp_admin_menu() {
    // Add main menu
    add_menu_page(
        'Clickstream', // Page title
        'Clickstream', // Menu title
        'manage_options', // Capability required
        'clickstream-wp', // Menu slug
        'clickstream_wp_home_page', // Callback function
        'dashicons-chart-line', // Icon
        30 // Position
    );
    
    // Add submenu items
    add_submenu_page(
        'clickstream-wp', // Parent slug
        'Clickstream Home', // Page title
        'Home', // Menu title
        'manage_options', // Capability required
        'clickstream-wp', // Menu slug (same as parent to make it the default)
        'clickstream_wp_home_page' // Callback function
    );
    
    add_submenu_page(
        'clickstream-wp', // Parent slug
        'Clickstream Setup', // Page title
        'Setup', // Menu title
        'manage_options', // Capability required
        'clickstream-wp-setup', // Menu slug
        'clickstream_wp_setup_page' // Callback function
    );
    
    add_submenu_page(
        'clickstream-wp', // Parent slug
        'Clickstream Privacy', // Page title
        'Privacy', // Menu title
        'manage_options', // Capability required
        'clickstream-wp-privacy', // Menu slug
        'clickstream_wp_privacy_page' // Callback function
    );
}
add_action('admin_menu', 'clickstream_wp_admin_menu');
