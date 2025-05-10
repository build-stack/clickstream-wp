<?php
/**
 * Tracking integration for Clickstream WP
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clickstream_WP_Tracking Class
 */
class Clickstream_WP_Tracking {
    
    /**
     * Constructor
     */
    public function __construct() {
        // Enqueue frontend scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    /**
     * Enqueue tracking script when enabled
     */
    public function enqueue_scripts() {
        if (get_option('clickstream_tracking_enabled', false)) {
            // Define the script URL
            $script_url = 'https://clickstream-core-packages-prod.s3.eu-central-1.amazonaws.com/clickstream-core/1.5.0/clickstream.min.js';
            
            // Enqueue the script in the head
            wp_enqueue_script('clickstream-tracking', $script_url, array(), CLICKSTREAM_WP_VERSION, false);
            
            // Output the configuration script in the head
            add_action('wp_head', array($this, 'output_tracking_script'));
        }
    }
    
    /**
     * Output tracking script directly in the head if needed
     */
    public function output_tracking_script() {
        $remote_url = get_option('clickstream_remote_url', CLICKSTREAM_DEFAULT_REMOTE_URL);
        $environment_id = get_option('clickstream_environment_id', '');
        $anonymize_ip = get_option('clickstream_anonymize_ip', true);
        ?>
        <!-- Clickstream Tracking Code -->
        <script>
            // Initialize the tracker
            const tracker = new Clickstream.Clickstream({
                samplingRate: 1, // Record all events
                maskAllInputs: <?php echo $anonymize_ip ? 'true' : 'false'; ?>,
                maxEventSize: 250,
                remoteEndpoint: '<?php echo esc_js($remote_url); ?>events',
                maxEvents: 50,
                environmentId: '<?php echo esc_js($environment_id); ?>',
                captureClientInfo: true,
            });

            tracker.start();
        </script>
        <?php
    }
} 