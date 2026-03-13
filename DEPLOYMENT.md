# Deployment Guide: Netlify + oceanx-demo.clementlsw.com

## 1. Netlify Setup (CLI — fastest for hackathon)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# From the project root, login
netlify login

# Initialize the project (link to a new Netlify site)
netlify init
# Choose: "Create & configure a new site"
# Team: your team
# Site name: seagrass-guide (or whatever — the subdomain will override this)
# Build command: npm run build
# Deploy directory: dist

# Deploy a preview to test
netlify deploy

# When happy, deploy to production
netlify deploy --prod
```

This gives you a working URL like `seagrass-guide.netlify.app` immediately with HTTPS — enough to test GPS + camera on your phone.

## 2. Custom Domain: oceanx-demo.clementlsw.com

### In Netlify Dashboard:
1. Go to **Site settings → Domain management → Custom domains**
2. Click **Add custom domain**
3. Enter: `oceanx-demo.clementlsw.com`
4. Netlify will tell you to configure DNS

### At your DNS provider (wherever you manage clementlsw.com):

Add a **CNAME record**:

```
Type:  CNAME
Name:  oceanx-demo
Value: seagrass-guide.netlify.app   (← your Netlify site subdomain)
TTL:   300  (or Auto)
```

That's it. One record.

**If your domain is on Namecheap:**
Dashboard → Domain List → clementlsw.com → Manage → Advanced DNS → Add New Record → CNAME

**If your domain is on Cloudflare:**
DNS → Records → Add Record → CNAME → Name: `oceanx-demo` → Target: `seagrass-guide.netlify.app`
(Turn OFF the orange proxy cloud for initial setup so Netlify can provision SSL. You can re-enable it after.)

**If your domain is managed by Netlify DNS:**
It'll auto-configure.

### SSL Certificate:
Netlify auto-provisions a Let's Encrypt SSL certificate for custom domains. After the CNAME propagates (usually 1-5 minutes, max 24 hours), go to:
**Site settings → Domain management → HTTPS → Verify DNS configuration → Provision certificate**

SSL is critical — without it, the Geolocation API and getUserMedia (camera) will not work.

## 3. Verify Everything Works

```bash
# Check DNS propagation
dig oceanx-demo.clementlsw.com CNAME

# Should return something like:
# oceanx-demo.clementlsw.com. 300 IN CNAME seagrass-guide.netlify.app.

# Test HTTPS
curl -I https://oceanx-demo.clementlsw.com
# Should return 200 with valid cert
```

Then open `https://oceanx-demo.clementlsw.com` on your phone and verify:
- [ ] Site loads
- [ ] GPS permission prompt appears
- [ ] Camera permission prompt appears (on the Learn/Act screens)
- [ ] No mixed-content warnings

## 4. Quick Redeploy During Hackathon

Every push to your linked Git branch auto-deploys. Or manually:

```bash
# Build and deploy in one command
netlify deploy --prod --build
```

Or for maximum speed (skip Git, deploy local build):

```bash
npm run build
netlify deploy --prod --dir=dist
```

This deploys in ~10 seconds. No CI wait.

## 5. netlify.toml (already created)

Place this in your project root. The `[[redirects]]` block is essential — it sends all routes to `index.html` so React Router works on page refresh.

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Timeline

| Step | Time |
|---|---|
| `netlify init` + first deploy | 2 min |
| Add CNAME at DNS provider | 1 min |
| DNS propagation | 1-5 min (usually instant) |
| Netlify SSL provisioning | 1-5 min |
| **Total: site live at oceanx-demo.clementlsw.com** | **~10 min** |
