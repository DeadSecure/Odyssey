#!/bin/bash
set -e

APP_DIR="/opt/odyssey"

echo "🗑️  Removing Odyssey installation..."

# --- Remove project directory ---
if [ -d "$APP_DIR" ]; then
  echo "🗑️  Removing project directory..."
  rm -rf "$APP_DIR"
fi

# --- Remove Nginx site configs ---
echo "🗑️  Cleaning Nginx configs..."
rm -f /etc/nginx/sites-available/*
rm -f /etc/nginx/sites-enabled/*
systemctl reload nginx

# --- Remove SSL certificates ---
echo "🗑️  Removing SSL certificates..."
rm -rf /etc/letsencrypt/live/*
rm -rf /etc/letsencrypt/archive/*
rm -rf /etc/letsencrypt/renewal/*



# --- Optionally remove Certbot + Nginx (if you want a truly clean VM) ---
echo "🗑️  Removing Certbot and Nginx..."
apt purge -y certbot python3-certbot-nginx nginx || true

# --- Remove global Odyssey command ---
echo "🗑️  Removing Odyssey command..."
rm -f /usr/local/bin/odyssey

# --- Clean up unused packages ---
apt autoremove -y
apt clean

echo "✅ Odyssey and dependencies removed."
