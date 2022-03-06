// https://openlibrary.org/dev/docs/api/covers
// https://developers.google.com/books/docs/v1/using#RetrievingVolume

// Reponse Google Books API : industrie identifier : donne un ISBN ou un OCLC : OCLC:... . Voir comment filtre ça pour modifier le fetch OpenLibrary selon la donnée fournie.
// reponse google API : book.volumeInfo.industryIdentifiers => tableau d'objets
// objet : { type: '', identifier:'' }
//
//
//
//
//

import { APIKeys } from './api-keys.js';

const searchQuery = document.querySelector('#search-bar');
const authorQuery = document.querySelector('#author-bar');
const submitBtn = document.querySelector('#search-btn');

const bookResultBlock = document.querySelector('#bookResult');
const bookListDiv = document.querySelector('#bookList');
const bookList = [];

submitBtn.addEventListener('click', () => {
  let query = '';
  const regex = /\s/g;

  if (searchQuery.value) {
    query += `intitle:${searchQuery.value.replace(regex, '+')}`;
  }

  if (authorQuery.value) {
    if (query) {
      query += '+';
    }
    query += `inauthor:${authorQuery.value.replace(regex, '+')}`;
  }

  // return input.value.replace(regex, '+');

  console.log(query);

  bookResultBlock.innerHTML = '';
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10&key=${APIKeys[0].value}`
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const bookResult = data.items;

      bookResult.forEach(book => {
        const bookInfos = document.createElement('div');

        const bookTitle = document.createElement('h3');
        bookTitle.innerText = book.volumeInfo.title;

        const bookThumbnail = document.createElement('img');
        if (book.volumeInfo.imageLinks) {
          // bookThumbnail.src = book.volumeInfo.imageLinks.thumbnail;
          bookThumbnail.src = 'resources/bookThumbnail.png';
        } else {
          //   bookThumbnail.src = 'resources/bookThumbnail.png';
          // console.log(book.volumeInfo.industryIdentifiers[0].identifier);

          if (
            book.volumeInfo.industryIdentifiers.find(e =>
              e.type.includes('ISBN')
            )
          ) {
            console.log('trouvé');
          }

          fetch(
            `https://covers.openlibrary.org/b/isbn/${book.volumeInfo.industryIdentifiers[0].identifier}-M.jpg?default=false`
          ).then(response => {
            console.log(response);
            bookThumbnail.src = response.url;
          });
        }

        bookInfos.append(bookThumbnail, bookTitle);

        bookResultBlock.appendChild(bookInfos);

        bookThumbnail.addEventListener('click', e => {
          //   Check if book already in bookList
          if (!bookList.includes(e.target)) {
            // If not, add to bookList
            bookList.push(e.target);
            addBook();
            bookResultBlock.innerHTML = '';
          } else {
            // exit if book already in bookList
            return;
          }
        });
      });
    })
    .catch(error => alert(`une erreur est survenue : ${error}`));
});

function addBook() {
  const bookThumbnail = document.createElement('img');
  bookThumbnail.src = bookList[bookList.length - 1].currentSrc;

  bookListDiv.appendChild(bookThumbnail);
}

function controlInput(input, query) {
  if (input.value) {
    const regex = /\s/g;
    return input.value.replace(regex, '+');
  }
}

// const industryIdentifiers = [
//   {
//     type: 'ISBN_13',
//     identifier: '9782823817195',
//   },
//   {
//     type: 'ISBN_10',
//     identifier: '2823817190',
//   },
//   {
//     type: 'OTHER',
//     identifier: 'OCLC:459424212',
//   },
// ];

// const industryIdentifiers1 = [
//   {
//     type: 'OTHER',
//     identifier: 'OCLC:459424212',
//   },
// ];

// const identifierValue = industryIdentifiers.find(e => e.type.includes('ISBN'));

// console.log(identifierValue);
