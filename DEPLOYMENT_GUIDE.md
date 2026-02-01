
# 🚀 COMPLETE DEPLOYMENT GUIDE

## Step 1: Create Project Directory

mkdir competitor-email-api
cd competitor-email-api

## Step 2: Create Folder Structure

mkdir api lib

## Step 3: Copy Files

Copy all the generated files to their respective locations:

competitor-email-api/
├── api/
│   └── generate-email.js
├── lib/
│   ├── mongodb.js
│   └── emailGenerator.js
├── .env.local
├── .gitignore
├── package.json
├── vercel.json
└── README.md

## Step 4: Install Dependencies

npm install

## Step 5: Test Locally (Optional)

npx vercel dev

# Test with:
curl -X POST http://localhost:3000/api/generate-email \
  -H "Content-Type: application/json" \
  -d '{"org_id": "smallpdf", "competitor_id": "ilovepdf"}'

## Step 6: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables (when prompted or manually):
vercel env add OPENROUTER_API_KEY
# Paste: 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

vercel env add MONGODB_URI
# Paste: mongodb+srv://hackthestack:wU45PXDlcZu9FmSQ@cluster0.a6rvoh.mongodb.net/?appName=Cluster0

vercel env add VOYAGE_API_KEY
# Paste: al-RnOQKEqZhbWkygA-3WF-WG4bPnsqHE1ARMLq-_SP4w5

# Deploy to production
vercel --prod

### Option B: GitHub + Vercel Dashboard

1. Create GitHub repository
2. Push code:
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main

3. Go to https://vercel.com/dashboard
4. Click "Add New Project"
5. Import your GitHub repository
6. Add environment variables in settings
7. Deploy!

## Step 7: Get Your Production URL

After deployment, Vercel will give you a URL like:
https://competitor-email-api-xxxxx.vercel.app

## Step 8: Test Production API

curl -X POST https://competitor-email-api-xxxxx.vercel.app/api/generate-email \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": "smallpdf",
    "competitor_id": "ilovepdf"
  }'

## 🎯 IMPORTANT NOTES

1. **Database Name**: The code uses 'competitor_intelligence' as the DB name.
   If your database has a different name, update line 42 in api/generate-email.js:

   const db = client.db('YOUR_DATABASE_NAME');

2. **Collection Names**: The code expects:
   - website_signals
   - knowledge_chunks

   Make sure these match your MongoDB collections!

3. **Vercel Free Tier Limits**:
   - 30-second function timeout
   - 10 serverless functions
   - 100GB bandwidth/month

4. **Security**: The API keys in .env.local are only for local dev.
   For production, Vercel uses encrypted environment variables.

## 🐛 Troubleshooting

### Error: "Please add your MongoDB URI to .env.local"
- Check that .env.local exists and has MONGODB_URI
- On Vercel, verify environment variables are set in project settings

### Error: "No signals found"
- Verify the org_id and competitor_id exist in MongoDB
- Check the entity_type is 'competitor'
- Use MongoDB Compass to inspect your data

### Error: "Failed to generate email"
- Check OpenRouter API key is valid
- Verify you have credits on OpenRouter
- Check the model name is correct (anthropic/claude-3.5-sonnet)

### MongoDB Connection Timeout
- Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access
- Or add Vercel's IP addresses (changes frequently, so 0.0.0.0/0 is easier)

## 📱 Integration Examples

### JavaScript/Node.js:
```javascript
const response = await fetch('https://your-app.vercel.app/api/generate-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    org_id: 'smallpdf',
    competitor_id: 'ilovepdf'
  })
});
const data = await response.json();
console.log(data.email.subject);
console.log(data.email.body);
```

### Python:
```python
import requests

response = requests.post(
    'https://your-app.vercel.app/api/generate-email',
    json={
        'org_id': 'smallpdf',
        'competitor_id': 'ilovepdf'
    }
)
data = response.json()
print(data['email']['subject'])
print(data['email']['body'])
```

### cURL:
```bash
curl -X POST https://your-app.vercel.app/api/generate-email \
  -H "Content-Type: application/json" \
  -d '{"org_id":"smallpdf","competitor_id":"ilovepdf"}'
```

## 🔒 Adding Authentication (Optional)

If you want to secure the API with an API key:

1. Add to .env.local:
   API_SECRET_KEY=your-secret-key-here

2. In api/generate-email.js, add after line 29:
   ```javascript
   // Add authentication
   const authHeader = req.headers.authorization;
   const expectedKey = process.env.API_SECRET_KEY;

   if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
     return res.status(401).json({
       error: 'Unauthorized',
       message: 'Invalid or missing API key'
     });
   }
   ```

3. Call API with:
   ```bash
   curl -X POST https://your-app.vercel.app/api/generate-email \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-secret-key-here" \
     -d '{"org_id":"smallpdf","competitor_id":"ilovepdf"}'
   ```

## ✅ CHECKLIST

- [ ] All files created in correct folders
- [ ] package.json exists
- [ ] .env.local has all API keys
- [ ] npm install completed successfully
- [ ] Local test works (optional)
- [ ] Vercel CLI installed (or GitHub repo created)
- [ ] Environment variables added to Vercel
- [ ] Deployed to production
- [ ] Production API tested with curl
- [ ] MongoDB IP whitelist configured (0.0.0.0/0)
- [ ] Database name matches in code

## 🎉 You're Done!

Your API is now live and ready to generate competitor comparison emails!

Share your production URL with other services that need to consume it.

Example response:
{
  "success": true,
  "email": {
    "subject": "A more secure PDF solution",
    "body": "Hey there,\n\nI noticed you're using iLovePDF for your PDF needs...",
    "tone": "conversational",
    "word_count": 142
  },
  "metadata": {
    "generated_at": "2026-01-31T22:30:45.123Z",
    "competitor_id": "ilovepdf",
    "org_id": "smallpdf"
  }
}
