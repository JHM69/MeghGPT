import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { html } = req.body;

        // Create an in-memory HTML file
        const htmlFilePath = path.resolve('tmp', `${Date.now()}.html`);
        fs.writeFileSync(htmlFilePath, html);

        const pdfFilePath = path.resolve('public', 'pdfs', `${Date.now()}.pdf`);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`file://${htmlFilePath}`, { waitUntil: 'networkidle0' });

        const pdfOptions = { path: pdfFilePath, format: 'A4' };
        await page.pdf(pdfOptions);

        await browser.close();

        // Delete temporary HTML file
        fs.unlinkSync(htmlFilePath);

        res.status(200).json({ url: `/pdfs/${path.basename(pdfFilePath)}` });
    } else {
        res.status(405).json({ message: 'Method not allowed. Use POST' });
    }
}
