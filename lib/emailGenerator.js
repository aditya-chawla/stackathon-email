// lib/emailGenerator.js
import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://competitor-email-api.vercel.app",
    "X-Title": "Competitor Email Generator",
  }
});

export async function generateCompetitorEmail(signals, knowledgeChunks, competitorId, orgId) {
  // Extract relevant information from signals and knowledge chunks
  const complianceMentions = signals.compliance_mentions || 0;
  const pricingMentions = signals.pricing_mentions || 0;
  const productMentions = signals.product_mentions || 0;

  // Extract compliance info from knowledge chunks
  const complianceInfo = knowledgeChunks
    .filter(chunk => chunk.content.toLowerCase().includes('iso') || 
                     chunk.content.toLowerCase().includes('certification'))
    .map(chunk => chunk.content)
    .join('\n');

  // Build context-aware prompt
  const prompt = `You are writing a brief, persuasive email to customers of ${competitorId} on behalf of ${orgId}.

COMPETITOR INTELLIGENCE:
- Compliance mentions: ${complianceMentions}
- Pricing mentions: ${pricingMentions}
- Product mentions: ${productMentions}

OUR ADVANTAGES:
${complianceInfo ? 'We have ISO/IEC 27001:2022 certification for information security, demonstrating our commitment to data protection and security.' : ''}

Write a SHORT (max 150 words), human, conversational email that:
1. Opens with empathy (acknowledge they're using ${competitorId})
2. Highlights ONE key differentiator (focus on security/compliance if available)
3. Includes a soft call-to-action
4. Sounds like a real person, not marketing copy
5. No subject line - just the email body
6. Use "we" not company name
7. Be specific but humble

Tone: Friendly, helpful, not pushy. Like a colleague recommending a better tool.`;

  try {
    const completion = await openrouter.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "system",
          content: "You are an expert at writing brief, human-sounding B2B emails that convert without being salesy."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const emailBody = completion.choices[0].message.content.trim();

    // Generate subject line
    const subjectCompletion = await openrouter.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "user",
          content: `Write a 4-6 word email subject line for this email body (no quotes, no punctuation):\n\n${emailBody}`
        }
      ],
      temperature: 0.8,
      max_tokens: 20,
    });

    const subject = subjectCompletion.choices[0].message.content.trim()
      .replace(/^["']|["']$/g, '')
      .replace(/[.!?]$/g, '');

    return {
      subject,
      body: emailBody,
      tone: "conversational",
      word_count: emailBody.split(/\s+/).length
    };
  } catch (error) {
    console.error('Error generating email:', error);
    throw new Error(`Failed to generate email: ${error.message}`);
  }
}
