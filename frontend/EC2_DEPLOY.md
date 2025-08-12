# EC2 Deployment Guide (Next.js Standalone)

## 1) Build locally
```bash
# from project root
npm install
npm run build:ec2
```
Artifacts to upload to the server:
- `.next/standalone/`
- `.next/static/`
- `public/`
- `ecosystem.config.cjs` (if using pm2)

Optional: zip them:
```bash
powershell Compress-Archive -Path .next/standalone,.next/static,public,ecosystem.config.cjs -DestinationPath ptb-frontend.zip
```

## 2) Upload to EC2
Use scp, WinSCP, or S3. Example with scp:
```bash
scp -i your-key.pem -r .next/standalone .next/static public ecosystem.config.cjs ec2-user@YOUR_EC2_PUBLIC_DNS:/var/www/ptb-frontend
```

## 3) Prepare EC2
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_DNS

# Install Node 18+ and pm2
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo -E bash -
sudo yum install -y nodejs
sudo npm i -g pm2

# App directory
sudo mkdir -p /var/www/ptb-frontend
sudo chown ec2-user:ec2-user /var/www/ptb-frontend
cd /var/www/ptb-frontend

# If you uploaded a zip
# unzip ptb-frontend.zip
```

## 4) Configure environment
```bash
# Set your real backend URL
export NEXT_PUBLIC_API_BASE_URL="http://98.84.163.166:5000"
```

## 5) Run the app
- Direct:
```bash
cd /var/www/ptb-frontend/.next/standalone
HOSTNAME=0.0.0.0 PORT=3000 NODE_ENV=production NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain node server.js
```
- With pm2:
```bash
cd /var/www/ptb-frontend
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## 6) Open security group
- Allow inbound TCP 3000 (or put behind Nginx/ALB and open 80/443)

## 7) Optional Nginx reverse proxy
```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

## Notes
- All API calls now use `NEXT_PUBLIC_API_BASE_URL`. Set it to your backend’s public URL.
- Rebuild if you change Next config; otherwise env vars can be passed at runtime.
