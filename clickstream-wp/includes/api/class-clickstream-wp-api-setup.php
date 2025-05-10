<?php
/**
 * Setup REST API controller for Clickstream WP
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clickstream_WP_API_Setup Class
 * 
 * Handles setup-related REST API endpoints
 */
class Clickstream_WP_API_Setup {
    
    /**
     * API namespace
     *
     * @var string
     */
    protected $namespace;
    
    /**
     * Route base
     *
     * @var string
     */
    protected $rest_base = 'setup';
    
    /**
     * Constructor
     * 
     * @param string $namespace The API namespace
     */
    public function __construct($namespace) {
        $this->namespace = $namespace;
        
        // Register routes
        $this->register_routes();
    }
    
    /**
     * Register routes
     */
    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base, array(
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array($this, 'get_setup_data'),
                'permission_callback' => array('Clickstream_WP_API', 'check_permissions'),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'update_setup_data'),
                'permission_callback' => array('Clickstream_WP_API', 'check_permissions'),
            ),
        ));
    }
    
    /**
     * Get setup data
     * 
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response
     */
    public function get_setup_data($request) {
        $remote_url = get_option('clickstream_remote_url', CLICKSTREAM_DEFAULT_REMOTE_URL);
        $environment_id = get_option('clickstream_environment_id', '');
        $tracking_enabled = get_option('clickstream_tracking_enabled', false);
        
        // Check endpoint health
        $live_health = Clickstream_WP::check_endpoint_health($remote_url, 'health/live');
        $ready_health = Clickstream_WP::check_endpoint_health($remote_url, 'health/ready');
        
        // Generate environment ID if it doesn't exist and health checks pass
        if (empty($environment_id) && $live_health && $ready_health) {
            $environment_id = Clickstream_WP::generate_environment_id();
            update_option('clickstream_environment_id', $environment_id);
        }
        
        return rest_ensure_response(array(
            'tracking_enabled' => (bool) $tracking_enabled,
            'remote_url' => $remote_url,
            'environment_id' => $environment_id,
            'health_status' => array(
                'live' => (bool) $live_health,
                'ready' => (bool) $ready_health
            )
        ));
    }
    
    /**
     * Update setup data
     * 
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response
     */
    public function update_setup_data($request) {
        $params = $request->get_params();
        
        if (isset($params['remote_url'])) {
            update_option('clickstream_remote_url', esc_url_raw($params['remote_url']));
        }
        
        if (isset($params['tracking_enabled'])) {
            update_option('clickstream_tracking_enabled', (bool) $params['tracking_enabled']);
        }
        
        // Return updated data
        return $this->get_setup_data($request);
    }
} 