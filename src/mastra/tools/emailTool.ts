import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const emailTool = createTool({
    id: 'email-tool',
    description: 'Send an email notification',
    inputSchema: z.object({
        to: z.string().describe('Recipient email address'),
        subject: z.string().describe('Email subject'),
        body: z.string().describe('Email body content'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    execute: async ({ context }) => {
        // Check for Cloudflare environment binding
        // In Cloudflare Workers, bindings are attached to the global env object or passed in context
        // Mastra might expose env via context.machine.env or similar, but for now we check global if available
        // or rely on the fact that in the worker, `env.SEND_EMAIL` will be available.

        // However, since we are inside a tool execution which might be running in a Node.js environment (locally)
        // or a Worker environment, we need to be careful.

        // @ts-ignore
        const sendEmailBinding = globalThis.env?.SEND_EMAIL || process.env.SEND_EMAIL;

        if (sendEmailBinding && typeof sendEmailBinding.send === 'function') {
            try {
                const { EmailMessage } = await import('cloudflare:email');

                const message = new EmailMessage(
                    'noreply@example.com', // Sender must be verified in Cloudflare
                    context.to,
                    context.body
                );
                // @ts-ignore - headers property exists on EmailMessage but might be missing in some type definitions
                message.headers.set('Subject', context.subject);

                await sendEmailBinding.send(message);

                return {
                    success: true,
                    message: 'Email sent via Cloudflare Email Worker',
                };
            } catch (error) {
                console.error('Failed to send email via Cloudflare:', error);
                // Fallback to mock
            }
        }

        console.log('--- Sending Email (Mock) ---');
        console.log(`To: ${context.to}`);
        console.log(`Subject: ${context.subject}`);
        console.log(`Body:\n${context.body}`);
        console.log('---------------------');

        return {
            success: true,
            message: 'Email sent successfully (mock)',
        };
    },
});
