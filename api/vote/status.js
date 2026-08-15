import { handleVoteStatus } from '../_lib/voteHandler.js';

/**
 * Vercel Serverless Function: GET /api/vote/status
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  return await handleVoteStatus(req, res);
}
