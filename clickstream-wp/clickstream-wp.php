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

// Home page content
function clickstream_wp_home_page() {
    $tracking_enabled = get_option('clickstream_tracking_enabled', false);
    ?>
    <div class="wrap">
        <h1>Clickstream Dashboard</h1>
        <p>Welcome to Clickstream WP - a powerful tool for tracking user behavior on your WordPress site.</p>
        <div class="card">
            <h2>Getting Started</h2>
            <p>To start tracking user behavior, go to the Setup page and configure your tracking preferences.</p>
            <a href="<?php echo admin_url('admin.php?page=clickstream-wp-setup'); ?>" class="button button-primary">Go to Setup</a>
        </div>
        
        <div class="card" style="margin-top: 20px;">
            <h2>Tracking Status</h2>
            <?php if ($tracking_enabled): ?>
                <p style="color: green;">✓ Clickstream tracking is currently <strong>enabled</strong>.</p>
            <?php else: ?>
                <p style="color: red;">✗ Clickstream tracking is currently <strong>disabled</strong>.</p>
                <p>Enable tracking in the <a href="<?php echo admin_url('admin.php?page=clickstream-wp-setup'); ?>">Setup</a> page to start collecting data.</p>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

// Setup page content
function clickstream_wp_setup_page() {
    $tracking_enabled = get_option('clickstream_tracking_enabled', false);
    ?>
    <div class="wrap">
        <h1>Clickstream Setup</h1>
        <p>Configure your tracking preferences below.</p>
        <form method="post" action="options.php">
            <?php settings_fields('clickstream_wp_options'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Enable Clickstream Tracking Framework</th>
                    <td>
                        <label>
                            <input type="checkbox" name="clickstream_tracking_enabled" value="1" <?php checked(1, $tracking_enabled); ?> />
                            Enable tracking of user behavior on your website
                        </label>
                        <p class="description">When enabled, Clickstream will collect anonymous data about how users interact with your site.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Changes'); ?>
        </form>
    </div>
    <?php
}

// Privacy page content
function clickstream_wp_privacy_page() {
    ?>
    <div class="wrap">
        <h1>Clickstream Privacy</h1>
        <p>Manage privacy settings and compliance options.</p>
        <div class="card" style="width: 100%; max-width: none;">
            <h2>Data Collection Policy</h2>
            <p>Configure what data is collected and how long it's stored.</p>
            <form method="post" action="options.php">
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Anonymize IP Addresses</th>
                        <td><input type="checkbox" name="clickstream_anonymize_ip" value="1" checked /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Data Retention Period (days)</th>
                        <td><input type="number" name="clickstream_data_retention" value="30" min="1" max="365" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Cookie Notice</th>
                        <td><textarea name="clickstream_cookie_notice" rows="5" cols="50">This site uses tracking cookies to understand how you interact with our website. By continuing to use this site, you consent to our use of cookies for analytics purposes.</textarea></td>
                    </tr>
                </table>
                <p class="submit">
                    <input type="submit" class="button-primary" value="Save Privacy Settings" />
                </p>
            </form>
        </div>
    </div>
    <?php
} 