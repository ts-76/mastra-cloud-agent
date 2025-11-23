import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { researchAgent } from '../agents/researchAgent';
import { emailTool } from '../tools/emailTool';

const researchStep = createStep({
    id: 'research-step',
    inputSchema: z.object({}),
    outputSchema: z.object({
        report: z.string(),
    }),
    execute: async () => {
        const result = await researchAgent.generate(
            'Find the latest AI news from the last 24 hours and summarize it.',
        );
        return { report: result.text };
    },
});

const emailStep = createStep({
    id: 'email-step',
    inputSchema: z.object({
        report: z.string(),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    execute: async ({ inputData }) => {
        const { report } = inputData;
        const emailDomain = process.env.SUBSCRIPTION_EMAIL_DOMAIN || 'user@example.com';

        if (!report) {
            throw new Error('No report generated from research step');
        }

        // Manually executing the tool logic or mocking the context
        // Since emailTool.execute requires a full context, we'll just invoke the logic directly here
        // or pass a minimal mock that satisfies the type if possible. 
        // For simplicity and robustness, we'll just log it here as the tool does.

        console.log('--- Sending Email (Workflow Step) ---');
        console.log(`To: ${emailDomain}`);
        console.log(`Subject: Daily AI News Report`);
        console.log(`Body:\n${report}`);
        console.log('---------------------');

        return {
            success: true,
            message: 'Email sent successfully (mock)',
        };
    },
});

export const newsWorkflow = createWorkflow({
    id: 'ai-news-workflow',
    inputSchema: z.object({}),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
})
    .then(researchStep)
    .then(emailStep);

newsWorkflow.commit();
