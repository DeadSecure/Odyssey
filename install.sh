#!/bin/bash
set -e  # exit on error

APP_REPO="https://github.com/javadyakuza/odyssey.git"
APP_DIR="/opt/odyssey"

echo "🚀 Installing Odyssey..."

echo "🔍 Make sure you have registered www.<YOUR_DOMAIN> and <YOUR_DOMAIN> in your DNS records."

# --- Ask user for input ---
read -p "🌐 Enter your domain (odyssey.watch): " DOMAIN
read -p "📧 Enter your email (for SSL certificate): " EMAIL

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "❌ Domain and Email are required!"
  exit 1
fi

echo "✅ Using domain: $DOMAIN"
echo "✅ Using email: $EMAIL"

# --- Update & upgrade ---
echo "📦 Updating system..."
apt update && apt upgrade -y

# --- Install required system packages ---
echo "📦 Installing base packages..."
apt install -y curl git ufw nginx

# --- Firewall rules ---
read -p "🔒 Do you want firewall rules? (y/N): " UPDATE_FW
UPDATE_FW=${UPDATE_FW:-N}

if [[ "$UPDATE_FW" =~ ^[Yy]$ ]]; then
    read -p "🔑 Enter SSH port (default 22): " PORT
    PORT=${PORT:-22}

    echo "🔒 Configuring firewall..."
    ufw allow $PORT/tcp
    ufw allow 'Nginx Full'
    ufw --force enable

    echo "✅ Firewall rules updated."
else
    echo "⚠️ Skipping firewall rules update. Make sure firewall is off or ngnix is accessible on ports 80 and 443."
fi

# --- Configure Nginx (HTTP only) before SSL ---
echo "🌐 Setting up temporary Nginx config for Certbot..."
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# --- Setup SSL with Certbot ---
echo "🔐 Installing SSL certificate..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

echo "✅ SSL configured for https://$DOMAIN"

# --- Update Nginx to redirect HTTP → HTTPS ---
cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

nginx -t && systemctl reload nginx


# --- Install NVM ---
echo "📦 Installing NVM..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Load NVM in the current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# --- Install specific Node.js version ---
NODE_VERSION="20.19.3"
echo "📦 Installing Node.js $NODE_VERSION via NVM..."
nvm install $NODE_VERSION
nvm use $NODE_VERSION
nvm alias default $NODE_VERSION

# Verify installation
echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# --- Clone project ---
if [ ! -d "$APP_DIR" ]; then
  echo "📂 Cloning Odyssey ..."
  git clone --recursive $APP_REPO $APP_DIR
else
  echo "📂 Project already exists, pulling latest..."
  cd $APP_DIR && git pull
fi

cd $APP_DIR

# --- Install app dependencies ---
echo "📦 Installing app dependencies..."
npm install

# --- Running Wizard ---
echo " 🧙 Running initial setup wizard..."
npm run start
