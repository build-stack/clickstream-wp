<?php
/**
 * REST API controller for Clickstream WP
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clickstream_WP_API Class
 * 
 * Handles REST API functionality and initialization
 */
class Clickstream_WP_API {
    
    /**
     * API namespace
     *
     * @var string
     */
    public $namespace = 'clickstream-wp/v1';
    
    /**
     * Constructor
     */
    public function __construct() {
        // Register REST API routes
        add_action('rest_api_init', array($this, 'register_routes'));
        
        // Add CORS support for development
        add_action('rest_api_init', array($this, 'add_cors_support'));
        
        // For development only - completely bypass authentication
        if (defined('WP_DEBUG') && WP_DEBUG) {
            // Remove any authentication requirements for our API namespace
            add_filter('rest_authentication_errors', array($this, 'bypass_authentication_for_development'), 999);
        }
    }
    
    /**
     * Register all REST API routes
     */
    public function register_routes() {
        // Initialize Setup API endpoints
        new Clickstream_WP_API_Setup($this->namespace);
        
        // Initialize Privacy API endpoints
        new Clickstream_WP_API_Privacy($this->namespace);
    }
    
    /**
     * Add CORS support for development with localhost:3000
     */
    public function add_cors_support() {
        // Add the filter to handle CORS headers
        add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
            // Get the origin header
            $origin = get_http_origin();
            
            // Allow localhost:3000 for development
            $allowed_origins = array(
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'http://localhost:8000'
            );
            
            // Check if the request origin is allowed
            if ($origin && in_array($origin, $allowed_origins)) {
                header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
                header('Access-Control-Expose-Headers: X-WP-Nonce');
                
                // Handle preflight OPTIONS requests
                if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
                    header('Access-Control-Max-Age: 86400'); // 24 hours
                    header('Content-Length: 0');
                    header('Content-Type: text/plain');
                    exit(0);
                }
            }
            
            return $served;
        }, 10, 4);
        
        // Add filter to make REST API cookies accessible from different domains
        add_filter('rest_cookie_collect_status', function() {
            return true;
        });
    }
    
    /**
     * Completely bypass authentication for development
     * 
     * @param WP_Error|bool|null $errors Current authentication status
     * @return bool Always returns true for our namespace to allow all requests
     */
    public function bypass_authentication_for_development($errors) {
        // If already authenticated or has errors we want to preserve
        if (true === $errors) {
            return true;
        }
        
        // Check if this is a request to our API namespace
        $rest_path = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        
        // Check if the request is to our namespace
        if (strpos($rest_path, 'clickstream-wp/v1') !== false) {
            // Log that we're bypassing authentication (for debugging)
            error_log('Bypassing REST API authentication for development: ' . $rest_path);
            
            // Allow the request
            return true;
        }
        
        // Return the original result for all other endpoints
        return $errors;
    }
    
    /**
     * Check if user has permission for REST endpoints
     *
     * @return bool
     */
    public static function check_permissions() {
        // For development only - completely bypass permission checks
        if (defined('WP_DEBUG') && WP_DEBUG) {
            return true;
        }
        
        // Normal permission check
        return current_user_can('manage_options');
    }
} 