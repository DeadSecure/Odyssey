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
# all ports needed by xray-core
# read -p "🔒 Do you want firewall rules? (y/N): " UPDATE_FW
# UPDATE_FW=${UPDATE_FW:-N}

# if [[ "$UPDATE_FW" =~ ^[Yy]$ ]]; then
#     read -p "🔑 Enter SSH port (default 22): " PORT
#     PORT=${PORT:-22}

#     echo "🔒 Configuring firewall..."
#     ufw allow $PORT/tcp
#     ufw allow 'Nginx Full'
#     ufw --force enable

#     echo "✅ Firewall rules updated."
# else
#     echo "⚠️ Skipping firewall rules update. Make sure firewall is off or ngnix is accessible on ports 80 and 443."
# fi

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


# Installing Golang
#!/bin/bash

# Installing Golang
echo "📦 Installing Go..."

# Check if Go is already installed and remove if exists
if command -v go &> /dev/null; then
    echo "⚠️  Go is already installed. Removing existing installation..."
    
    # Remove APT installed Go packages
    sudo apt remove golang-go golang-1.* --purge -y 2>/dev/null || true
    
    # Remove snap installed Go
    sudo snap remove go 2>/dev/null || true
    
    # Remove manually installed Go (if in /usr/local)
    if [ -d "/usr/local/go" ]; then
        echo "🗑️  Removing manual Go installation from /usr/local/go"
        sudo rm -rf /usr/local/go
    fi
    
    # Clean up PATH references (optional - user may need to restart shell)
    echo "⚠️  Note: You may need to restart your shell or remove Go from your PATH manually"
fi

# Add PPA and install latest Go
echo "📥 Adding Go PPA repository..."
sudo add-apt-repository ppa:longsleep/golang-backports -y

echo "🔄 Updating package lists..."
sudo apt update

echo "⬇️  Installing Go..."
# Install the latest available version (golang-go gets the latest)
sudo apt install golang-go -y

# Verify installation
if command -v go &> /dev/null; then
    echo "✅ Go installed successfully!"
    echo "📋 Go version: $(go version)"
    echo "📁 Go root: $(go env GOROOT)"
else
    echo "❌ Go installation failed!, run the remove script and try again."
    exit 1
fi

echo "🎉 Go installation complete!"

# Clone the repo
if [ ! -d "$APP_DIR" ]; then
    echo "📂 Cloning Odyssey..."
    git clone $APP_REPO $APP_DIR
    cd $APP_DIR
    echo "🔄 Initializing submodules..."
    git submodule update --init --recursive
else
    echo "📂 Project already exists, pulling latest..."
    cd $APP_DIR
    git pull
    echo "🔄 Updating submodules..."
    git submodule update --init --recursive
fi

cd $APP_DIR

# --- Fix the odyssey command ---
ODYSSEY_BIN="/usr/local/bin/odyssey"
echo "📦 Creating global 'odyssey' command..."

# Ensure /usr/local/bin exists
mkdir -p /usr/local/bin

# Create the wrapper script
cat > "$ODYSSEY_BIN" <<EOF
#!/bin/bash
cd "$APP_DIR" || exit 1
npm run start
EOF

# Make it executable
chmod +x "$ODYSSEY_BIN"

echo "✅ Global 'odyssey' command created! You can now run 'odyssey' from anywhere."

# --- Install app dependencies ---
echo "📦 Installing app dependencies..."
npm install

# --- Running Wizard ---
echo " 🧙 Running initial setup wizard..."
npm run start
