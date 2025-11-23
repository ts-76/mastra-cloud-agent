import fs from 'fs';
import path from 'path';

async function main() {
    // Load .env manually
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf-8');
            envConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim();
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
            console.log('Loaded .env file');
        }
    } catch (e) {
        console.error('Error loading .env:', e);
    }

    const { mastra } = await import('../src/mastra');

    console.log('Starting AI News Workflow...');

    const workflow = mastra.getWorkflow('newsWorkflow');

    if (!workflow) {
        console.error('Workflow not found!');
        return;
    }

    try {
        const run = await workflow.createRunAsync();
        const result = await run.start({ inputData: {} });

        console.log('Workflow Result:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Workflow failed:', error);
    }
}

main();
