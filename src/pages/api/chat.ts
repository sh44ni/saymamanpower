import type { NextApiRequest, NextApiResponse } from 'next';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message, language = 'en', history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    const systemPrompt = `
You are Zenia, a virtual assistant for Sayma Manpower, a trusted recruitment agency in Oman.
Your goal is to help users find housemaids and answer their questions professionally and warmly.

**Key Information about Sayma Manpower:**
- **Services:** We provide housemaids from Nepal, Sri Lanka, India, and Myanmar.
- **Availability:** Availability of maids from specific countries varies. You can't promise specific availability right now but encourage them to check the "Maids" page or contact us.
- **Pricing:** Pricing is NOT fixed. It depends on the maid's experience, training, and nationality.
- **Trial Period:** We offer a 4-day trial period for all maids.
- **Rental:** We do NOT provide hourly or monthly rental housemaids. We only do recruitment (sponsorship/contracts).
- **Contact:** WhatsApp: +968 71777161. Location: Office #15, 1st floor, building #540/1, block 343, Al Seeb.

**Personality:**
- Name: Zenia
- Tone: Professional, helpful, polite, and welcoming.
- Language: You must reply in the SAME language the user speaks to you (English or Arabic). If the user selected '${language}', prioritize that language.

**Constraints:**
- Do NOT make up prices.
- Do NOT promise specific maids are available.
- If you don't know an answer, suggest they contact us on WhatsApp +968 71777161.
- Keep responses concise (under 3-4 sentences) unless a detailed explanation is needed.
`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Updated to working model
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...history,
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Groq API Error:', errorData);
            throw new Error('Failed to communicate with Zenia');
        }

        const data = await response.json();
        const reply = data.choices[0]?.message?.content || "I apologize, I'm having trouble processing your request right now.";

        res.status(200).json({ reply });
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
