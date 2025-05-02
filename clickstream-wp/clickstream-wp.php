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

    register_setting(
        'clickstream_wp_options',
        'clickstream_remote_url',
        array(
            'type' => 'string',
            'default' => 'http://ec2-3-73-144-24.eu-central-1.compute.amazonaws.com:3000/',
            'sanitize_callback' => 'esc_url_raw'
        )
    );

    register_setting(
        'clickstream_wp_options',
        'clickstream_environment_id',
        array(
            'type' => 'string',
            'default' => '',
            'sanitize_callback' => 'preserve_existing_environment_id'
        )
    );
}
add_action('admin_init', 'clickstream_wp_register_settings');

// Sanitize options
function sanitize_clickstream_options($input) {
    return isset($input) ? true : false;
}

// Function to preserve existing environment ID
function preserve_existing_environment_id($new_value) {
    $existing_value = get_option('clickstream_environment_id', '');
    if (!empty($existing_value)) {
        return $existing_value; // Always return existing value if one exists
    }
    return sanitize_text_field($new_value); // Only allow setting if no value exists
}

// Function to generate a new environment ID
function generate_environment_id() {
    $existing_id = get_option('clickstream_environment_id', '');
    if (!empty($existing_id)) {
        return $existing_id;
    }
    return wp_generate_uuid4();
}

// Function to check endpoint health
function check_endpoint_health($url, $endpoint) {
    $response = wp_remote_get($url . $endpoint);
    
    if (is_wp_error($response)) {
        return false;
    }
    
    $response_code = wp_remote_retrieve_response_code($response);
    return $response_code === 200;
}

// Output tracking script directly in the head if needed
function clickstream_wp_output_tracking_script() {
    $remote_url = get_option('clickstream_remote_url', 'http://ec2-3-73-144-24.eu-central-1.compute.amazonaws.com:3000/');
    $environment_id = get_option('clickstream_environment_id', '');
    ?>
    <!-- Clickstream Tracking Code -->
    <script>
        // Initialize the tracker
        const tracker = new Clickstream.Clickstream({
            samplingRate: 1, // Record all events
            maskAllInputs: false,
            maxEventSize: 250,
            remoteEndpoint: '<?php echo esc_js($remote_url); ?>events',
            maxEvents: 50,
            environmentId: '<?php echo esc_js($environment_id); ?>',
        });

        tracker.start();
    </script>
    <?php
}

// Enqueue tracking script when enabled
function clickstream_wp_enqueue_scripts() {
    if (get_option('clickstream_tracking_enabled', false)) {
        // Define the script URL
        $script_url = 'https://clickstream-core-packages-prod.s3.eu-central-1.amazonaws.com/clickstream-core/1.4.0/clickstream.min.js';
        
        // Enqueue the script in the head
        wp_enqueue_script('clickstream-tracking', $script_url, array(), '1.0.0', false);
        
        // Output the configuration script in the head
        add_action('wp_head', 'clickstream_wp_output_tracking_script');
    }
}
add_action('wp_enqueue_scripts', 'clickstream_wp_enqueue_scripts');
