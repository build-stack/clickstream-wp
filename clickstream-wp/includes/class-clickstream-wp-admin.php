<?php
/**
 * Admin page integration for Clickstream WP
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Clickstream_WP_Admin Class
 */
class Clickstream_WP_Admin {
    
    /**
     * Constructor
     */
    public function __construct() {
        // Register admin menu pages
        add_action('admin_menu', array($this, 'register_admin_page'));
        
        // Enqueue admin scripts and styles
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }
    
    /**
     * Register the admin menu page and submenus
     */
    public function register_admin_page() {
        // Add main menu
        add_menu_page(
            'Clickstream WP',
            'Clickstream',
            'manage_options',
            'clickstream-wp',
            array($this, 'render_admin_page'),
            'dashicons-chart-line',
            30
        );
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets() {
        $screen = get_current_screen();
        if (!in_array($screen->id, array(
            'toplevel_page_clickstream-wp',
            'clickstream_page_clickstream-wp-setup',
            'clickstream_page_clickstream-wp-privacy'
        ))) {
            return;
        }

        // Get the manifest file
        $manifest_path = CLICKSTREAM_WP_PATH . 'assets/admin/.vite/manifest.json';
        if (!file_exists($manifest_path)) {
            wp_die('Error: Admin assets not built. Please run npm run build in the client directory.');
        }

        $manifest = json_decode(file_get_contents($manifest_path), true);
        $entry_point = $manifest['index.html'];

        // Enqueue the main JavaScript file
        if (isset($entry_point['file'])) {
            wp_enqueue_script(
                'clickstream-wp-admin',
                CLICKSTREAM_WP_URL . 'assets/admin/' . $entry_point['file'],
                array(),
                CLICKSTREAM_WP_VERSION,
                true
            );
        }

        // Enqueue CSS files
        if (isset($entry_point['css']) && is_array($entry_point['css'])) {
            foreach ($entry_point['css'] as $css_file) {
                wp_enqueue_style(
                    'clickstream-wp-admin-' . basename($css_file, '.css'),
                    CLICKSTREAM_WP_URL . 'assets/admin/' . $css_file,
                    array(),
                    CLICKSTREAM_WP_VERSION
                );
            }
        }

        // Add admin settings as JavaScript data
        wp_localize_script('clickstream-wp-admin', 'clickstreamWPAdmin', array(
            'apiNonce' => wp_create_nonce('wp_rest'),
            'apiUrl' => rest_url('clickstream-wp/v1'),
            'currentPage' => str_replace('clickstream-wp-', '', $_GET['page'] ?? 'clickstream-wp'),
            'pluginUrl' => CLICKSTREAM_WP_URL,
        ));
    }
    
    /**
     * Render the admin page container
     */
    public function render_admin_page() {
        // Just render the root container for React
        ?>
        <div class="wrap">
            <div id="root"></div>
        </div>
        <?php
    }
} 