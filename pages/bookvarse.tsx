import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Book } from '@prisma/client';
const StoryVerse = () => {
  const [books, setBooks] = useState([]);

  function downloadPdf(url: string) {
    try{
      console.log(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = url.substring(url.lastIndexOf('/') + 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }catch(e){
      alert("Error while downloading")
    }
    
  }

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await axios.get('/api/books', {
          params: {
            visibility: true,
          },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
    fetchBooks();
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      </Head>
      {/* Header */}
      <header className="header flex justify-between items-center">
        <div className="image mx-auto">
          <img src="https://i.ibb.co/k3FYjHD/Story-Verse-1.gif" alt="Story-Verse-1" />
        </div>
        <div>
          <a href="/" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded font-semibold flex items-center">
            Generate A Story<i className="fas fa-arrow-right ml-2"></i>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Field and Button */}
        <section className="mb-8">
          <div className="flex">
            <input type="text" placeholder="Search for books" className="w-full border rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button className="search-button text-white px-4 py-2 rounded-r font-semibold hover:bg-purple-600 transition-colors">Search</button>
          </div>
        </section>

        {/* Upload Button
        <section className="mb-8">
          <div className="flex items-center justify-center">
            <input
              type="file"
              className="file-input w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 border bg-white rounded-l py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="upload-button text-white px-4 py-2 rounded font-semibold bg-purple-600 hover:bg-purple-700 transition-colors">
              Upload
            </button>
          </div>
        </section> */}

        {/* Book Listing */}
        <section className="book-listing mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">Available Books</h2>
          <hr />
          <div className="flex flex-wrap justify-center">
            {books.map((book: Book) => (
              <div key={book.id} className="book-card rounded shadow m-2 w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4">
                <div className="bg-image">
                  <img src={book.thumbnail} alt="Book 1" />
                </div>

                <div className="content">
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-gray-600">{book.content.substring(0, 20)}</p>
                  <div className="mt-4">
                    <a href={'/book/' + book.id} className="view-button text-white px-2 py-2 rounded font-semibold">
                      <i className="fas fa-eye mr-2"></i>Read
                    </a>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        downloadPdf(book.file);
                      }}
                      download
                      className="download-button text-white ml-1 px-1 py-2 rounded font-semibold"
                    >
                      <i className="fas fa-download mr-2"></i> Download
                    </a>
                    <span className="text-white px-4 py-2 rounded font-semibold">
                      <i className="fas fa-star"></i> 100
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination */}
        {/* <section className="pagination mt-8">
          <div className="flex justify-center items-center">
            <button className="page-button text-white px-4 py-2 rounded font-semibold mr-2">
              <i className="fas fa-chevron-left"></i> Prev
            </button>
            <button className="page-button text-white px-4 py-2 rounded font-semibold">
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="footerStory bg-gray-800 text-white text-center py-4">
        &copy; 2023 MeghBuzz by <a href="https://github.com/jhm69">Jahangir</a>, <a href="https://github.com/fms-byte">Farhan</a>,{' '}
        <a href="https://github.com/mtasfi">MT Asfi</a>. All Rights Reserved.
      </footer>
    </>
  );
};

export default StoryVerse;
