<?php
function clickstream_wp_home_page() {
    $tracking_enabled = get_option('clickstream_tracking_enabled', false);
    ?>
    <div class="wrap">
        <h1>Clickstream Dashboard</h1>
        <p>Welcome to Clickstream WP - a powerful tool for tracking user behavior on your WordPress site.</p>
        <div class="card">
            <h2>Getting Started</h2>
            <p>To start tracking user behavior, go to the Setup page and configure your tracking preferences.</p>
            <a href="<?php echo admin_url('admin.php?page=clickstream-wp-setup'); ?>" class="button button-primary">Go to Setup</a>
        </div>
        
        <div class="card" style="margin-top: 20px;">
            <h2>Tracking Status</h2>
            <?php if ($tracking_enabled): ?>
                <p style="color: green;">✓ Clickstream tracking is currently <strong>enabled</strong>.</p>
            <?php else: ?>
                <p style="color: red;">✗ Clickstream tracking is currently <strong>disabled</strong>.</p>
                <p>Enable tracking in the <a href="<?php echo admin_url('admin.php?page=clickstream-wp-setup'); ?>">Setup</a> page to start collecting data.</p>
            <?php endif; ?>
        </div>
    </div>
    <?php
} 