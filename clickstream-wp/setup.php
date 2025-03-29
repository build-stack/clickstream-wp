<?php
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