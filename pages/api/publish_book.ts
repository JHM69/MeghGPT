// pages/api/books.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === 'POST') {
    const { content, url } = req.body;

    try {
      // Find the book with the matching content
      const book = await prisma.book.findFirst({
        where: {
          content: content,
        },
      });

      if (book) {
        // Update the visibility to "true" and file to the provided URL
        const updatedBook = await prisma.book.update({
          where: { id: book.id },
          data: { visibility: 'true', file: url },
        });

        res.status(200).json(updatedBook);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
