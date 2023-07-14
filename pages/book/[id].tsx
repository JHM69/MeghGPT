import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Book } from '@prisma/client';
import { speakText } from '@/lib/text-to-speech';
const Read = () => {
  const router = useRouter();

  console.log(JSON.stringify(router));

  let id = router.params.id;

  // var bookId = id[0];

  const [book, setBook] = useState<Book | null>(null);

  console.log(id);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/api/books/${id}`);
        console.log(response.data);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Book not found.</div>;
  }
  const handleMenuSpeak = async (e: React.MouseEvent) => {
    e.preventDefault();
    await speakText(book.content);
  };
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </Head>

      <header className="headerRead">
        <div className="image mx-auto">
          <img src="https://i.ibb.co/k3FYjHD/Story-Verse-1.gif" alt="Story-Verse-1" />
        </div>
        <div className="generate" onClick={handleMenuSpeak}>
          {book.title}
          <i className="fas fa-arrow-right ml-2"></i>
        </div>
      </header>
      <div className="containerRead">
        <div className="book-info">
          <div>
            <h1 className="book-title text-4xl font-bold">The Adventure Begins</h1>
            <p className="book-author text-lg text-gray-600">By JohnDoe</p>
          </div>
          <div className="read-aloud">
            <button className="read-aloud-button">
              <i className="fas fa-volume-up mr-2"></i> Listen
            </button>
          </div>
        </div>

        <div className="book-content">
          <article>{book.content}</article>

          {/* More paragraphs go here */}
        </div>
        <a href="/bookvarse" className="back-button">
          <i className="fas fa-arrow-left"></i>Back to Book Listing
        </a>
      </div>

      <footer className="footerRead bg-gray-800 text-white text-center py-4">
        &copy; 2023 MeghBuzz by <a href="https://github.com/jhm69">Jahangir</a>, <a href="https://github.com/fms-byte">Farhan</a>,{' '}
        <a href="https://github.com/mtasfi">MT Asfi</a>. All Rights Reserved.
      </footer>
    </>
  );
};

export default Read;
