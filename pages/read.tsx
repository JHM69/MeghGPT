import React from 'react';
import Head from 'next/head';
const Read = () => {
  return (
    <>
        <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        </Head>

        <header className="headerRead">
        <div className="image mx-auto">
            <img src="https://i.ibb.co/k3FYjHD/Story-Verse-1.gif" alt="Story-Verse-1"/>
        </div>
        <div className="generate">
            <a href="/">
              Generate A Story<i className="fas fa-arrow-right ml-2"></i>
            </a>
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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus cursus nunc at gravida. Integer eget
            tellus sed mauris placerat efficitur at vitae sem. Duis at sem vel tellus scelerisque bibendum. Fusce a
            lectus lectus. Sed ultrices, tortor a auctor gravida, neque massa varius ipsum, vel malesuada lorem velit eget
            orci. Phasellus rhoncus viverra ante, in consectetur quam sollicitudin ut. Suspendisse lacinia facilisis est,
            vitae aliquam dolor. Aliquam erat volutpat. Donec fringilla tortor ac justo posuere feugiat. Nam ultrices
            lacus sed leo gravida, sed lacinia nunc vulputate. Nulla ultricies nisl eget orci accumsan fringilla. Morbi
            eleifend elit et tempor rhoncus. Curabitur aliquam metus non urna feugiat, nec bibendum metus elementum. Sed vitae
            gravida odio.</p>

          <p>Pellentesque facilisis eleifend ipsum, at tristique dui interdum vitae. Etiam malesuada orci a eros lacinia
            bibendum. Vivamus vitae posuere quam, ac tempor neque. Nulla facilisi. Nunc feugiat ligula non pellentesque
            sagittis. Fusce eu velit vitae leo porttitor bibendum. Donec ut urna id justo euismod tempus id sed mauris.
            Maecenas sagittis lacus sed lectus mattis, ac posuere urna finibus. Phasellus pellentesque varius dui, ac
            elementum ipsum tincidunt id. Curabitur finibus, dui a posuere finibus, elit risus ullamcorper lorem, non
            consequat sem quam ut nunc. Suspendisse lobortis bibendum sollicitudin. Suspendisse congue malesuada mi ac
            facilisis.</p>

          <p>Proin euismod interdum turpis eget egestas. Vestibulum elementum, lectus at pharetra laoreet, erat lectus
            lacinia ligula, sit amet finibus purus sem eget lorem. Donec eget quam lacinia, cursus tellus a, faucibus enim.
            Vestibulum vitae sem hendrerit, sagittis enim sed, suscipit libero. Aenean in lacus nec risus sollicitudin
            elementum. Morbi cursus, risus ut tincidunt consequat, dui ex pharetra orci, non cursus nisi libero sed ligula.
            Fusce iaculis vestibulum odio at euismod. Praesent ut mi vitae est bibendum congue. Proin in lacus ac leo
            fermentum facilisis id et dui. In pretium lacus a ex consectetur aliquam.</p>

          {/* More paragraphs go here */}
        </div>
        <a href="/bookvarse" className="back-button"><i className="fas fa-arrow-left"></i>Back to Book Listing</a>
      </div>

      <footer className="footerRead bg-gray-800 text-white text-center py-4">
        &copy; 2023 MeghBuzz by <a href="https://github.com/jhm69">Jahangir</a>, <a href="https://github.com/fms-byte">Farhan</a>, <a href="https://github.com/mtasfi">MT Asfi</a>. All Rights Reserved.
      </footer>
    </>
  );
}

export default Read;
