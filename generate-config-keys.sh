#!/bin/bash

# Generate secure WordPress salt keys and update wp-config.php

# Get WordPress salt keys from the WordPress API
SALT_KEYS=$(curl -s https://api.wordpress.org/secret-key/1.1/salt/)

# Replace the entire salt keys section in wp-config.php
if [ -f "wp-config.php" ]; then
  # Create a temporary file with new salt keys
  cat > temp_salts.txt << EOL
/**
 * Authentication unique keys and salts.
 * Generate these using the WordPress.org secret-key service:
 * https://api.wordpress.org/secret-key/1.1/salt/
 */
$SALT_KEYS
EOL

  # Replace the salt keys section in wp-config.php
  awk '
  /\/\*\*/{
    if (index($0, "Authentication unique keys and salts") > 0) {
      while (getline line < "temp_salts.txt") {
        print line;
      }
      close("temp_salts.txt");
      found=1;
      # Skip until we find a blank line
      while (getline && $0 != "") {}
    } else {
      print;
    }
  }
  !found { print }
  ' wp-config.php > wp-config.php.new
  
  mv wp-config.php.new wp-config.php
  rm temp_salts.txt
  
  echo "WordPress config keys generated successfully!"
else
  echo "Error: wp-config.php not found!"
  exit 1
fi 