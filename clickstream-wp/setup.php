<?php
function clickstream_wp_setup_page() {
    $tracking_enabled = get_option('clickstream_tracking_enabled', false);
    $remote_url = get_option('clickstream_remote_url', 'http://ec2-3-73-144-24.eu-central-1.compute.amazonaws.com:3000/');
    $environment_id = get_option('clickstream_environment_id', '');
    
    // Check endpoint health
    $live_health = check_endpoint_health($remote_url, 'health/live');
    $ready_health = check_endpoint_health($remote_url, 'health/ready');
    
    // If health checks fail, disable tracking
    if (!$live_health || !$ready_health) {
        update_option('clickstream_tracking_enabled', false);
        $tracking_enabled = false;
    }

    // Generate environment ID if it doesn't exist and health checks pass
    if (empty($environment_id) && $live_health && $ready_health) {
        $environment_id = generate_environment_id();
        update_option('clickstream_environment_id', $environment_id);
    }
    ?>
    <div class="wrap">
        <h1>Clickstream Setup</h1>
        <p>Configure your tracking preferences below.</p>
        
        <div class="notice notice-info">
            <p>Health Status:
                <?php if ($live_health && $ready_health): ?>
                    <span style="color: green;">●</span> Endpoints are healthy
                <?php else: ?>
                    <span style="color: red;">●</span> Endpoint health check failed
                <?php endif; ?>
            </p>
        </div>

        <form method="post" action="options.php">
            <?php settings_fields('clickstream_wp_options'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Remote URL</th>
                    <td>
                        <input type="text" 
                               name="clickstream_remote_url" 
                               value="<?php echo esc_attr($remote_url); ?>"
                               class="regular-text"
                               readonly
                               style="background-color: #f0f0f0;"
                        />
                        <?php if (!$live_health || !$ready_health): ?>
                            <span style="color: red; margin-left: 10px;">●</span>
                        <?php endif; ?>
                        <p class="description">The remote URL where events will be sent.</p>
                    </td>
                </tr>
                
                <tr valign="top">
                    <th scope="row">Environment ID (X-API-KEY)</th>
                    <td>
                        <?php if (!empty($environment_id)): ?>
                            <input type="text" 
                                   value="<?php echo esc_attr($environment_id); ?>"
                                   class="regular-text"
                                   readonly
                                   style="background-color: #f0f0f0;"
                            />
                            <input type="hidden" name="clickstream_environment_id" value="<?php echo esc_attr($environment_id); ?>" />
                        <?php else: ?>
                            <p><em>Environment ID will be generated automatically when health checks pass.</em></p>
                        <?php endif; ?>
                        <p class="description">This ID will be used as X-Environment-Id in API requests. Once generated, it cannot be changed.</p>
                    </td>
                </tr>

                <tr valign="top">
                    <th scope="row">Enable Clickstream Tracking Framework</th>
                    <td>
                        <label>
                            <input type="checkbox" 
                                   name="clickstream_tracking_enabled" 
                                   value="1" 
                                   <?php checked(1, $tracking_enabled); ?>
                                   <?php disabled(!$live_health || !$ready_health); ?>
                            />
                            Enable tracking of user behavior on your website
                        </label>
                        <p class="description">When enabled, Clickstream will collect anonymous data about how users interact with your site.</p>
                        <?php if (!$live_health || !$ready_health): ?>
                            <p class="description" style="color: red;">Tracking cannot be enabled until endpoint health checks pass.</p>
                        <?php endif; ?>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Changes'); ?>
        </form>
    </div>
    <?php
} 