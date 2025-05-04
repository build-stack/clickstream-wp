<?php
/**
 * Privacy REST API controller for Clickstream WP
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clickstream_WP_API_Privacy Class
 * 
 * Handles privacy-related REST API endpoints
 */
class Clickstream_WP_API_Privacy {
    
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
    protected $rest_base = 'privacy';
    
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
                'callback'            => array($this, 'get_privacy_data'),
                'permission_callback' => array('Clickstream_WP_API', 'check_permissions'),
            ),
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array($this, 'update_privacy_data'),
                'permission_callback' => array('Clickstream_WP_API', 'check_permissions'),
            ),
        ));
    }
    
    /**
     * Get privacy data
     * 
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response
     */
    public function get_privacy_data($request) {
        return rest_ensure_response(array(
            'anonymize_ip' => (bool) get_option('clickstream_anonymize_ip', true),
            'data_retention' => (int) get_option('clickstream_data_retention', 30),
            'cookie_notice' => get_option('clickstream_cookie_notice', 'This site uses tracking cookies to understand how you interact with our website. By continuing to use this site, you consent to our use of cookies for analytics purposes.')
        ));
    }
    
    /**
     * Update privacy data
     * 
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_REST_Response
     */
    public function update_privacy_data($request) {
        $params = $request->get_params();
        
        if (isset($params['anonymize_ip'])) {
            update_option('clickstream_anonymize_ip', (bool) $params['anonymize_ip']);
        }
        
        if (isset($params['data_retention'])) {
            update_option('clickstream_data_retention', absint($params['data_retention']));
        }
        
        if (isset($params['cookie_notice'])) {
            update_option('clickstream_cookie_notice', sanitize_textarea_field($params['cookie_notice']));
        }
        
        // Return updated data
        return $this->get_privacy_data($request);
    }
} 