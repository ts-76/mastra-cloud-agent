import { Agent } from '@mastra/core/agent';
import { searchTool } from '../tools/searchTool';

export const researchAgent = new Agent({
    id: 'ai-news-researcher',
    name: 'AI News Researcher',
    instructions: `
    You are an expert AI Research Agent.
    Your goal is to find the latest and most important developments in Artificial Intelligence from the last 24 hours.
    
    Use the 'search-tool' to find relevant news.
    Focus on:
    - New model releases (LLMs, multimodal, etc.)
    - Major research breakthroughs
    - Significant industry announcements
    
    After gathering information, create a concise summary report.
    The report should be formatted in Markdown.
    Include links to the sources where possible.
  `,
    model: process.env.MODEL || 'google/gemini-2.5-pro',
    tools: {
        searchTool,
    },
});
