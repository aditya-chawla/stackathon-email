// api/generate-email.js
import clientPromise from '../lib/mongodb.js';
import { generateCompetitorEmail } from '../lib/emailGenerator.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests'
    });
  }

  try {
    const { org_id, competitor_id } = req.body;

    // Validate required fields
    if (!org_id || !competitor_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both org_id and competitor_id are required',
        received: { org_id, competitor_id }
      });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('competitor_intelligence'); // Adjust DB name as needed

    // Fetch website signals
    const signalsCollection = db.collection('website_signals');
    const signals = await signalsCollection.findOne({
      org_id: org_id,
      entity_id: competitor_id,
      entity_type: 'competitor'
    });

    if (!signals) {
      return res.status(404).json({
        error: 'No signals found',
        message: `No website signals found for org_id: ${org_id}, competitor_id: ${competitor_id}`
      });
    }

    // Fetch knowledge chunks
    const chunksCollection = db.collection('knowledge_chunks');
    const knowledgeChunks = await chunksCollection
      .find({
        org_id: org_id,
        entity_id: competitor_id,
        entity_type: 'competitor'
      })
      .limit(5) // Limit to 5 most relevant chunks
      .toArray();

    if (knowledgeChunks.length === 0) {
      console.warn('No knowledge chunks found, proceeding with signals only');
    }

    // Generate email using LLM
    const email = await generateCompetitorEmail(
      signals.signals,
      knowledgeChunks,
      competitor_id,
      org_id
    );

    // Return response
    return res.status(200).json({
      success: true,
      email: email,
      metadata: {
        generated_at: new Date().toISOString(),
        competitor_id: competitor_id,
        org_id: org_id,
        signals_used: signals.signals,
        knowledge_chunks_count: knowledgeChunks.length
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
