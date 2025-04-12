<?php
function clickstream_wp_setup_page() {
    $tracking_enabled = get_option('clickstream_tracking_enabled', false);
    $environment_id = get_option('clickstream_environment_id', '');
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
                <tr valign="top">
                    <th scope="row">Environment ID</th>
                    <td>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="clickstream_environment_id" name="clickstream_environment_id" value="<?php echo esc_attr($environment_id); ?>" class="regular-text" required placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                            <button type="button" id="generate_uuid_button" class="button button-secondary">Generate UUID</button>
                        </div>
                        <p class="description">Enter your unique Environment ID for identifying your website in the remote tracking system.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Changes'); ?>
        </form>
    </div>

    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            // Function to generate a UUID v4
            function generateUUID() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            // Add click event listener to the generate button
            document.getElementById('generate_uuid_button').addEventListener('click', function() {
                document.getElementById('clickstream_environment_id').value = generateUUID();
            });
        });
    </script>
    <?php
} 