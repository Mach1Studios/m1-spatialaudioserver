# Quick Start Guide

## First Time Setup

### Local Development
```bash
cp vue-front/.env.example vue-front/.env
cp koa-server/.env.example koa-server/.env
make local  # Takes 10-15 minutes
```
Visit: **http://localhost:80**

### EC2 Production
```bash
cp vue-front/.env.example vue-front/.env
cp koa-server/.env.example koa-server/.env
# Leave VUE_APP_API_URL and VUE_APP_STREAM_URL empty in .env
make production  # Takes 20-30 minutes
```
Visit: **http://YOUR_EC2_IP**

## Quick Restart (Images Already Built)

```bash
# Local
make local-skip-build

# EC2 Production  
make production-skip-build
```

## Stop Containers
```bash
make stop
```

## Point Domain to EC2

1. Get Elastic IP in AWS Console
2. Associate with your EC2 instance
3. In Route 53 (or your DNS):
   - Create A record
   - Name: `spatialplayer`
   - Value: Your Elastic IP
4. Wait 5-15 min for DNS propagation
5. Visit: **http://spatialplayer.mach1.tech**

No code changes needed - frontend auto-detects domain!

## Default Login
- Email: `whatsup@mach1.tech`
- Password: `goodpassbro`
