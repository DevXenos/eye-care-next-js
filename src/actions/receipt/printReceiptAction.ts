"use server";
import { convert } from "html-to-text";
import { printerStore } from '@/libs/printer-store';
import { createRequire } from 'module';
import * as fs from 'fs'; // Added for file system access
import path from 'path';

const require = createRequire(import.meta.url);
const escpos = require('escpos');
const ConsoleModule = require('escpos-console');
const Console = typeof ConsoleModule === 'function' ? ConsoleModule : ConsoleModule.Console;

export default async function printReceiptAction(html: string) {
  const text = convert(html, {
    wordwrap: 32, 
    selectors: [
      { selector: 'h1', options: { uppercase: true } },
    ]
  });

  const device = new Console();
  const printer = new escpos.Printer(device);
  const chunks: Buffer[] = [];
  
  device.write = (buf: Buffer) => {
    chunks.push(buf);
    return true;
  };

  return new Promise((resolve, reject) => {
    try {
      device.open((error?: Error) => {
        if (error) return reject(error);

        printer
          .font('a')
          .align('ct')
          .text(text) 
          .feed(2)
          .cut()
          .close();

        // 1. Concatenate all chunks into the final binary buffer
        const finalBuffer = Buffer.concat(chunks);

        // 2. Save to file (receipt-test.bin in your project root)
        const filePath = path.join(process.cwd(), 'receipt-test.bin');
        fs.writeFileSync(filePath, finalBuffer);

        // 3. Keep your existing memory store logic
        const rawOutput = finalBuffer.toString('utf-8');
        const cleanLines = rawOutput.replace(/[\x1b\x1d][\x00-\x7f][\x00-\x7f]?/g, '').split('\n');

        printerStore.setReceipt(cleanLines);
        
        console.log(`✅ Binary saved to: ${filePath}`);
        resolve({ success: true });
      });
    } catch (err) {
      reject(err);
    }
  });
}