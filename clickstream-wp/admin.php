<?php
/**
 * Admin page integration for Clickstream WP
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the admin menu page and submenus
 */
function clickstream_wp_register_admin_page() {
    // Add main menu
    add_menu_page(
        'Clickstream WP',
        'Clickstream',
        'manage_options',
        'clickstream-wp',
        'clickstream_wp_render_admin_page',
        'dashicons-chart-line',
        30
    );
    
    // Add submenu items
    add_submenu_page(
        'clickstream-wp',
        'Dashboard',
        'Dashboard',
        'manage_options',
        'clickstream-wp',
        'clickstream_wp_render_admin_page'
    );
    
    add_submenu_page(
        'clickstream-wp',
        'Setup',
        'Setup',
        'manage_options',
        'clickstream-wp-setup',
        'clickstream_wp_render_admin_page'
    );
    
    add_submenu_page(
        'clickstream-wp',
        'Privacy',
        'Privacy',
        'manage_options',
        'clickstream-wp-privacy',
        'clickstream_wp_render_admin_page'
    );
}
add_action('admin_menu', 'clickstream_wp_register_admin_page');

/**
 * Enqueue admin assets
 */
function clickstream_wp_enqueue_admin_assets() {
    $screen = get_current_screen();
    if (!in_array($screen->id, array(
        'toplevel_page_clickstream-wp',
        'clickstream_page_clickstream-wp-setup',
        'clickstream_page_clickstream-wp-privacy'
    ))) {
        return;
    }

    // Get the manifest file
    $manifest_path = plugin_dir_path(__FILE__) . 'assets/admin/.vite/manifest.json';
    if (!file_exists($manifest_path)) {
        wp_die('Error: Admin assets not built. Please run npm run build in the client/admin directory.');
    }

    $manifest = json_decode(file_get_contents($manifest_path), true);
    $entry_point = $manifest['index.html'];

    // Enqueue the main JavaScript file
    if (isset($entry_point['file'])) {
        wp_enqueue_script(
            'clickstream-wp-admin',
            plugin_dir_url(__FILE__) . 'assets/admin/' . $entry_point['file'],
            array(),
            '1.0.0',
            true
        );
    }

    // Enqueue CSS files
    if (isset($entry_point['css']) && is_array($entry_point['css'])) {
        foreach ($entry_point['css'] as $css_file) {
            wp_enqueue_style(
                'clickstream-wp-admin-' . basename($css_file, '.css'),
                plugin_dir_url(__FILE__) . 'assets/admin/' . $css_file,
                array(),
                '1.0.0'
            );
        }
    }

    // Enqueue assets from imports
    if (isset($entry_point['imports']) && is_array($entry_point['imports'])) {
        foreach ($entry_point['imports'] as $import) {
            if (isset($manifest[$import]['file'])) {
                wp_enqueue_script(
                    'clickstream-wp-admin-' . basename($import, '.js'),
                    plugin_dir_url(__FILE__) . 'assets/admin/' . $manifest[$import]['file'],
                    array('clickstream-wp-admin'),
                    '1.0.0',
                    true
                );
            }
        }
    }

    // Add admin settings as JavaScript data
    wp_localize_script('clickstream-wp-admin', 'clickstreamWPAdmin', array(
        'apiNonce' => wp_create_nonce('wp_rest'),
        'apiUrl' => rest_url('clickstream-wp/v1'),
        'currentPage' => str_replace('clickstream-wp-', '', $_GET['page']),
        'pluginUrl' => plugin_dir_url(__FILE__),
    ));
}
add_action('admin_enqueue_scripts', 'clickstream_wp_enqueue_admin_assets');

/**
 * Render the admin page container
 */
function clickstream_wp_render_admin_page() {
    ?>
    <div class="wrap">
        <div id="root"></div>
    </div>
    <?php
} 