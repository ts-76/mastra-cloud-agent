import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const searchTool = createTool({
    id: 'search-tool',
    description: 'Search for the latest AI news',
    inputSchema: z.object({
        query: z.string().describe('Search query for AI news'),
    }),
    outputSchema: z.object({
        results: z.array(
            z.object({
                title: z.string(),
                url: z.string(),
                content: z.string(),
            })
        ),
    }),
    execute: async ({ context }) => {
        const apiKey = process.env.TAVILY_API_KEY;

        if (apiKey) {
            try {
                const response = await fetch('https://api.tavily.com/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        api_key: apiKey,
                        query: context.query,
                        search_depth: 'basic',
                        include_answer: false,
                        include_images: false,
                        include_raw_content: false,
                        max_results: 5,
                    }),
                });

                if (!response.ok) {
                    console.error('Tavily API error:', response.statusText);
                    // Fallback to mock if API fails
                } else {
                    const data = await response.json() as any;
                    return {
                        results: data.results.map((result: any) => ({
                            title: result.title,
                            url: result.url,
                            content: result.content,
                        })),
                    };
                }
            } catch (error) {
                console.error('Error fetching from Tavily:', error);
                // Fallback to mock
            }
        }

        console.log('Using mock search results (TAVILY_API_KEY not found or API failed)');
        return {
            results: [
                {
                    title: 'OpenAI Releases GPT-5 Preview',
                    url: 'https://example.com/gpt-5-preview',
                    content: 'OpenAI has announced the preview of GPT-5, featuring enhanced reasoning capabilities and multimodal support.',
                },
                {
                    title: 'Google DeepMind Solves New Protein Folding Challenge',
                    url: 'https://example.com/deepmind-protein',
                    content: 'DeepMind\'s AlphaFold 3 has successfully predicted the structure of complex protein interactions previously thought impossible.',
                },
                {
                    title: 'Meta Introduces Llama 4 for Mobile Devices',
                    url: 'https://example.com/llama-4-mobile',
                    content: 'Meta\'s new Llama 4 model is optimized for on-device processing, bringing powerful AI to smartphones without cloud dependency.',
                },
            ],
        };
    },
});
