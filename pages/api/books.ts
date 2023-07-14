// pages/api/books.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.query);
  if (req.method === 'GET') {
    if (req.query.id) {
      const { id } = req.query;
      const book = await prisma.book.findUnique({
        where: { id: String(id) },
      });
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    }
    // Search books by title
    else if (req.query.title) {
      const { title } = req.query;
      const booksByTitle = await prisma.book.findMany({
        where: {
          title: { contains: String(title) },
        },
      });
      res.status(200).json(booksByTitle);
    }
    // Get all books
    else {
      const allBooks = await prisma.book.findMany();
      res.status(200).json(allBooks);
    }
  } else if (req.method === 'POST') {
    // Create a new book
    const { title, thumbnail, content, file, addedBy, timestamp } = req.body;
    const newBook = await prisma.book.create({
      data: {
        title,
        thumbnail,
        content,
        file,
        addedBy,
        timestamp,
      },
    });
    res.status(201).json(newBook);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
