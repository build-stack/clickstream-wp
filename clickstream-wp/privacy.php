<?php
function clickstream_wp_privacy_page() {
    ?>
    <div class="wrap">
        <h1>Clickstream Privacy</h1>
        <p>Manage privacy settings and compliance options.</p>
        <div class="card" style="width: 100%; max-width: none;">
            <h2>Data Collection Policy</h2>
            <p>Configure what data is collected and how long it's stored.</p>
            <form method="post" action="options.php">
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Anonymize IP Addresses</th>
                        <td><input type="checkbox" name="clickstream_anonymize_ip" value="1" checked /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Data Retention Period (days)</th>
                        <td><input type="number" name="clickstream_data_retention" value="30" min="1" max="365" /></td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Cookie Notice</th>
                        <td><textarea name="clickstream_cookie_notice" rows="5" cols="50">This site uses tracking cookies to understand how you interact with our website. By continuing to use this site, you consent to our use of cookies for analytics purposes.</textarea></td>
                    </tr>
                </table>
                <p class="submit">
                    <input type="submit" class="button-primary" value="Save Privacy Settings" />
                </p>
            </form>
        </div>
    </div>
    <?php
} 