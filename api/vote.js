import { handleVoteSubmit } from './_lib/voteHandler.js';

/**
 * Vercel Serverless Function: POST /api/vote
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Parse JSON body if needed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'invalid_json' });
    }
  }

  return await handleVoteSubmit(req, res, body);
}
