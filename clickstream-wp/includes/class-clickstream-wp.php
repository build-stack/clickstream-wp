<?php
/**
 * Main plugin class
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class Clickstream_WP {
    /**
     * Plugin version
     *
     * @var string
     */
    public $version = '1.0.0';

    /**
     * The single instance of the class
     *
     * @var Clickstream_WP
     */
    protected static $_instance = null;

    /**
     * Main Clickstream_WP Instance
     *
     * Ensures only one instance of Clickstream_WP is loaded or can be loaded.
     *
     * @static
     * @return Clickstream_WP - Main instance
     */
    public static function instance() {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Clickstream_WP Constructor.
     */
    public function __construct() {
        $this->define_constants();
        $this->includes();
        $this->init_hooks();
    }

    /**
     * Define plugin constants
     */
    private function define_constants() {
        $this->define('CLICKSTREAM_WP_VERSION', $this->version);
        $this->define('CLICKSTREAM_WP_FILE', plugin_dir_path(dirname(__FILE__)) . 'clickstream-wp.php');
        $this->define('CLICKSTREAM_WP_PATH', plugin_dir_path(dirname(__FILE__)));
        $this->define('CLICKSTREAM_WP_URL', plugin_dir_url(dirname(__FILE__)));
        $this->define('CLICKSTREAM_DEFAULT_REMOTE_URL', 'http://ec2-18-194-146-27.eu-central-1.compute.amazonaws.com:3000/');
    }

    /**
     * Define constant if not already set
     *
     * @param string $name
     * @param string|bool $value
     */
    private function define($name, $value) {
        if (!defined($name)) {
            define($name, $value);
        }
    }

    /**
     * Include required core files
     */
    public function includes() {
        // Core classes
        include_once CLICKSTREAM_WP_PATH . 'includes/class-clickstream-wp-admin.php';
        include_once CLICKSTREAM_WP_PATH . 'includes/class-clickstream-wp-tracking.php';
        
        // API classes
        include_once CLICKSTREAM_WP_PATH . 'includes/api/class-clickstream-wp-api.php';
        include_once CLICKSTREAM_WP_PATH . 'includes/api/class-clickstream-wp-api-setup.php';
        include_once CLICKSTREAM_WP_PATH . 'includes/api/class-clickstream-wp-api-privacy.php';
    }

    /**
     * Hook into actions and filters
     */
    private function init_hooks() {
        // Register activation, deactivation and uninstall hooks
        register_activation_hook(CLICKSTREAM_WP_FILE, array($this, 'activation'));
        register_deactivation_hook(CLICKSTREAM_WP_FILE, array($this, 'deactivation'));

        // Initialize the plugin
        add_action('init', array($this, 'init'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Initialize the plugin
     */
    public function init() {
        // Initialize admin
        new Clickstream_WP_Admin();

        // Initialize API
        new Clickstream_WP_API();
        
        // Initialize tracking if enabled
        if (get_option('clickstream_tracking_enabled', false)) {
            new Clickstream_WP_Tracking();
        }
    }

    /**
     * Plugin activation
     */
    public function activation() {
        // Set default options on activation
        if (false === get_option('clickstream_environment_id')) {
            add_option('clickstream_environment_id', '');
        }
        
        if (false === get_option('clickstream_remote_url')) {
            add_option('clickstream_remote_url', CLICKSTREAM_DEFAULT_REMOTE_URL);
        }
        
        if (false === get_option('clickstream_tracking_enabled')) {
            add_option('clickstream_tracking_enabled', false);
        }
        
        if (false === get_option('clickstream_anonymize_ip')) {
            add_option('clickstream_anonymize_ip', true);
        }
        
        if (false === get_option('clickstream_data_retention')) {
            add_option('clickstream_data_retention', 30);
        }
        
        if (false === get_option('clickstream_cookie_notice')) {
            add_option('clickstream_cookie_notice', 'This site uses tracking cookies to understand how you interact with our website. By continuing to use this site, you consent to our use of cookies for analytics purposes.');
        }
    }

    /**
     * Plugin deactivation
     */
    public function deactivation() {
        // Deactivation tasks
    }

    /**
     * Register plugin settings
     */
    public function register_settings() {
        // Setup options
        register_setting(
            'clickstream_wp_options',
            'clickstream_tracking_enabled',
            array(
                'type' => 'boolean',
                'default' => false,
                'sanitize_callback' => array($this, 'sanitize_clickstream_options')
            )
        );

        register_setting(
            'clickstream_wp_options',
            'clickstream_remote_url',
            array(
                'type' => 'string',
                'default' => CLICKSTREAM_DEFAULT_REMOTE_URL,
                'sanitize_callback' => 'esc_url_raw'
            )
        );

        register_setting(
            'clickstream_wp_options',
            'clickstream_environment_id',
            array(
                'type' => 'string',
                'default' => '',
                'sanitize_callback' => array($this, 'preserve_existing_environment_id')
            )
        );
        
        // Privacy settings
        register_setting(
            'clickstream_wp_privacy_options',
            'clickstream_anonymize_ip',
            array(
                'type' => 'boolean',
                'default' => true
            )
        );
        
        register_setting(
            'clickstream_wp_privacy_options',
            'clickstream_data_retention',
            array(
                'type' => 'integer',
                'default' => 30,
                'sanitize_callback' => 'absint'
            )
        );
        
        register_setting(
            'clickstream_wp_privacy_options',
            'clickstream_cookie_notice',
            array(
                'type' => 'string',
                'default' => 'This site uses tracking cookies to understand how you interact with our website. By continuing to use this site, you consent to our use of cookies for analytics purposes.',
                'sanitize_callback' => 'sanitize_textarea_field'
            )
        );
    }

    /**
     * Sanitize options
     */
    public function sanitize_clickstream_options($input) {
        return isset($input) ? true : false;
    }

    /**
     * Function to preserve existing environment ID
     */
    public function preserve_existing_environment_id($new_value) {
        $existing_value = get_option('clickstream_environment_id', '');
        if (!empty($existing_value)) {
            return $existing_value; // Always return existing value if one exists
        }
        return sanitize_text_field($new_value); // Only allow setting if no value exists
    }

    /**
     * Generate a new environment ID
     */
    public static function generate_environment_id() {
        $existing_id = get_option('clickstream_environment_id', '');
        if (!empty($existing_id)) {
            return $existing_id;
        }
        return wp_generate_uuid4();
    }

    /**
     * Check endpoint health
     */
    public static function check_endpoint_health($url, $endpoint) {
        $response = wp_remote_get($url . $endpoint);
        // var_dump($response, $url, $endpoint);die;
        if (is_wp_error($response)) {
            return false;
        }
        
        $response_code = wp_remote_retrieve_response_code($response);
        return $response_code === 200;
    }
} 