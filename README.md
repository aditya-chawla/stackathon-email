# Competitor Email Generator API

AI-powered API for generating personalized competitor comparison emails using OpenRouter and MongoDB.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` file with:
   ```
   OPENROUTER_API_KEY=your_key_here
   MONGODB_URI=your_mongodb_uri
   VOYAGE_API_KEY=your_voyage_key
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   curl -X POST http://localhost:3000/api/generate-email \
     -H "Content-Type: application/json" \
     -d '{
       "org_id": "smallpdf",
       "competitor_id": "ilovepdf"
     }'
   ```

## 📦 Deployment to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables:**
   ```bash
   vercel env add OPENROUTER_API_KEY
   vercel env add MONGODB_URI
   vercel env add VOYAGE_API_KEY
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy automatically

## 🔌 API Usage

### Endpoint
```
POST /api/generate-email
```

### Request Body
```json
{
  "org_id": "smallpdf",
  "competitor_id": "ilovepdf"
}
```

### Response
```json
{
  "success": true,
  "email": {
    "subject": "A more secure PDF solution",
    "body": "Hey there,\n\nI noticed you're using iLovePDF...",
    "tone": "conversational",
    "word_count": 145
  },
  "metadata": {
    "generated_at": "2026-01-31T...",
    "competitor_id": "ilovepdf",
    "org_id": "smallpdf",
    "signals_used": {...},
    "knowledge_chunks_count": 5
  }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing required fields",
  "message": "Both org_id and competitor_id are required"
}
```

**404 Not Found:**
```json
{
  "error": "No signals found",
  "message": "No website signals found for org_id: ..., competitor_id: ..."
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```

## 🧪 Testing

### Test with curl:
```bash
# Production
curl -X POST https://your-app.vercel.app/api/generate-email \
  -H "Content-Type: application/json" \
  -d '{
    "org_id": "smallpdf",
    "competitor_id": "ilovepdf"
  }'
```

### Test with JavaScript:
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
console.log(data.email.body);
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Vercel Serverless Functions
- **Database:** MongoDB Atlas
- **LLM:** OpenRouter (Claude 3.5 Sonnet)
- **Libraries:** 
  - `mongodb` - Database driver
  - `openai` - OpenRouter API client

## 📁 Project Structure

```
competitor-email-api/
├── api/
│   └── generate-email.js    # Main API endpoint
├── lib/
│   ├── mongodb.js            # MongoDB connection utility
│   └── emailGenerator.js     # LLM email generation logic
├── .env.local                # Environment variables
├── package.json              # Dependencies
├── vercel.json               # Vercel configuration
└── README.md                 # This file
```

## 🔒 Security Notes

- Never commit `.env.local` to Git
- Use Vercel environment variables for production
- API keys are server-side only (not exposed to client)
- CORS is enabled for all origins (adjust in production if needed)

## 📊 Database Schema

### website_signals collection:
```javascript
{
  org_id: "smallpdf",
  entity_id: "ilovepdf",
  entity_type: "competitor",
  snapshot_time: Date,
  signals: {
    pricing_mentions: Number,
    compliance_mentions: Number,
    product_mentions: Number
  }
}
```

### knowledge_chunks collection:
```javascript
{
  org_id: "smallpdf",
  entity_id: "ilovepdf",
  entity_type: "competitor",
  content: String,
  embedding: Array,
  source: String
}
```

## 🎯 Customization

### Change LLM Model:
Edit `lib/emailGenerator.js`:
```javascript
model: "anthropic/claude-3.5-sonnet" // or "openai/gpt-4-turbo"
```

### Adjust Email Length:
Modify the prompt in `lib/emailGenerator.js`:
```javascript
max 150 words // Change to your preference
```

### Add Authentication:
Add to `api/generate-email.js`:
```javascript
const apiKey = req.headers.authorization;
if (apiKey !== process.env.API_SECRET_KEY) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

## 🐛 Troubleshooting

**MongoDB connection issues:**
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string is correct
- Test connection timeout settings

**OpenRouter API errors:**
- Verify API key is valid
- Check rate limits and credits
- Review model availability

**Vercel deployment issues:**
- Ensure Node.js version is 18+
- Check function timeout (max 30s on free tier)
- Verify environment variables are set

## 📝 License

MIT
