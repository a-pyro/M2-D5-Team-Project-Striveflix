// console.log('im here from the back office');

// window.onload = getInputData;
// dom references
const form = document.getElementById('mainForm');
const inputFields = Array.from(document.getElementsByTagName('input'));
const textArea = document.getElementById('description');
const submitBtn = document.getElementById('submitBtn');
const editBtn = document.getElementById('editBtn');
const select = document.getElementById('select');
const deleteBtn = document.getElementById('deleteBtn');
const putBtn = document.getElementById('putBtn');
const imdb = [];
let globalId;

// listeners
form.addEventListener('submit', getInputData);
editBtn.addEventListener('click', pickMovie);
select.addEventListener('change', getSingleMovie);
deleteBtn.addEventListener('click', deleteFilm);
putBtn.addEventListener('click', editFilm);

function getInputData(e) {
  e.preventDefault();
  const newMovie = inputFields.reduce((acc, cv) => {
    acc[cv.id] = cv.value;
    return acc;
  }, {});
  newMovie.description = textArea.value;
  console.log(newMovie);
  postData(newMovie).then(clearForm());
}

async function postData(movie) {
  try {
    const response = await fetch(
      'https://striveschool-api.herokuapp.com/api/movies/',
      {
        method: 'POST',
        headers: new Headers({
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUyMDNjNDg5YzI2ZjAwMTU3ZjljNDMiLCJpYXQiOjE2MTU5ODgzMzUsImV4cCI6MTYxNzE5NzkzNX0.ZkirlemsOm9gKIdP1GliGmMvD2oYPJDMHyPyrTjZkUU',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(movie),
      }
    );
    if (response.ok) {
      console.log('movie loaded');
      console.log(response);
      // !implement messaggio notification
      return response;
    } else {
      // !implement messaggio notification
      console.log('something went wrong');
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
}

function pickMovie(e) {
  e.preventDefault();
  const navLink = e.currentTarget;
  getCategories();
  toggleForm();
}

// GET DATA FOR SELETCT
async function getCategories() {
  try {
    const respone = await fetch(
      'https://striveschool-api.herokuapp.com/api/movies/',
      {
        method: 'GET',
        headers: new Headers({
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUyMDNjNDg5YzI2ZjAwMTU3ZjljNDMiLCJpYXQiOjE2MTU5ODgzMzUsImV4cCI6MTYxNzE5NzkzNX0.ZkirlemsOm9gKIdP1GliGmMvD2oYPJDMHyPyrTjZkUU',
        }),
      }
    );
    const data = await respone.json();
    console.log('categories: ', data);
    getDatas(data);
  } catch (error) {
    console.log(error);
  }
}

async function getDatas(categories) {
  try {
    const arrayOfPromises = await categories.map(async (category) => {
      const resp = await fetch(
        `https://striveschool-api.herokuapp.com/api/movies/${category}`,
        {
          method: 'GET',
          headers: new Headers({
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUyMDNjNDg5YzI2ZjAwMTU3ZjljNDMiLCJpYXQiOjE2MTU5ODgzMzUsImV4cCI6MTYxNzE5NzkzNX0.ZkirlemsOm9gKIdP1GliGmMvD2oYPJDMHyPyrTjZkUU',
          }),
        }
      );
      const data = await resp.json();
      return data;
    });

    const dataFromPromiseAll = await Promise.all(arrayOfPromises);
    console.log(dataFromPromiseAll);
    const unifiedDatas = dataFromPromiseAll.reduce(
      (acc, cv) => acc.concat(cv),
      []
    );
    // push in local
    unifiedDatas.forEach((movie) => imdb.push(movie));
    renderOptions(unifiedDatas);

    //render Data
  } catch (error) {
    console.log(error);
  }
}

function renderOptions(data) {
  select.innerHTML += data.reduce((acc, cv) => acc + OptionComponent(cv), '');
}

function OptionComponent({ name, category, _id: id }) {
  return `
  <option value="${id}"><span>${name}</span>:<span>${category}</span></option>
  `;
}

async function getSingleMovie() {
  const id = select.value;
  globalId = id;
  const itemToEdit = imdb.find((movie) => movie._id === id);
  console.log(id);
  console.log(itemToEdit);
  const { name, description, category, imageUrl } = itemToEdit;
  inputFields.forEach((field) => {
    switch (field.id) {
      case 'name':
        field.value = name;
        break;
      case 'category':
        field.value = category;
        break;
      case 'imageUrl':
        field.value = imageUrl;
        break;
    }
  });
  textArea.value = description;
  toggleForm();
  toggleBtns();
}

async function deleteFilm() {
  try {
    const resp = await fetch(
      `https://striveschool-api.herokuapp.com/api/movies/${globalId}`,
      {
        method: 'DELETE',
        headers: new Headers({
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUyMDNjNDg5YzI2ZjAwMTU3ZjljNDMiLCJpYXQiOjE2MTU5ODgzMzUsImV4cCI6MTYxNzE5NzkzNX0.ZkirlemsOm9gKIdP1GliGmMvD2oYPJDMHyPyrTjZkUU',
          'Content-Type': 'application/json',
        }),
      }
    );

    if (resp.ok) {
      const optionToRemove = document.getElementById(globalId);
      optionToRemove.remove();
      console.log(resp);
      clearForm();
      toggleForm();
      toggleBtns();
      alert('tappposto!! CANCELLATO');
    } else {
      alert('fanculo!');
    }
  } catch (error) {
    console.log(error);
  }
}

async function editFilm() {
  try {
    const modifiedMovie = inputFields.reduce((acc, cv) => {
      acc[cv.id] = cv.value;
      return acc;
    }, {});
    modifiedMovie.description = textArea.value;

    console.log(modifiedMovie);

    const resp = await fetch(
      `https://striveschool-api.herokuapp.com/api/movies/${globalId}`,
      {
        method: 'PUT',
        headers: new Headers({
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDUyMDNjNDg5YzI2ZjAwMTU3ZjljNDMiLCJpYXQiOjE2MTU5ODgzMzUsImV4cCI6MTYxNzE5NzkzNX0.ZkirlemsOm9gKIdP1GliGmMvD2oYPJDMHyPyrTjZkUU',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(modifiedMovie),
      }
    );

    if (resp.ok) {
      console.log(resp);
      clearForm();
      toggleForm();
      toggleBtns();
      alert('tappposto!!');
    } else {
      alert('fanculo!');
    }
  } catch (error) {
    console.log(error);
  }
}

// helper functions
function clearForm() {
  inputFields.forEach((field) => (field.value = ''));
  textArea.value = '';
}
function toggleBtns() {
  submitBtn.classList.toggle('d-none');
  putBtn.classList.toggle('d-none');
  deleteBtn.classList.toggle('d-none');
}
function toggleForm() {
  form.classList.toggle('d-none');
  select.classList.toggle('d-none');
}

/* 
function to grab stuff from netflix
const objectGenreBuilder = (rowNumer) => {
  const row = document.getElementById('row-`${rowNumer}`');
  const links = Array.from(row.querySelectorAll('p[class="fallback-text"]'));
  const images = Array.from(row.querySelectorAll('img.boxart-image'));
  const genreTitle = document.querySelector('.genreTitle');
  const genre = links.reduce((acc, cv, idx) => {
    acc.push({
      name: cv.innerText,
      description: 'some dummy text that can be edited later',
      category: genreTitle.innerText.toLowerCase(),
      imageUrl: images[idx].src,
    });
    return acc;
  }, []);
  console.log(genre);
  return genre;
}; */

// function to feed the back-office
const feedBackOffice = (array) => {
  array.forEach((movie) => {
    const { name, description, imageUrl, category } = movie;
    inputFields.forEach((field) => {
      switch (field.id) {
        case 'name':
          field.value = name;
          break;
        case 'category':
          field.value = category;
          break;
        case 'imageUrl':
          field.value = imageUrl;
          break;
      }
    });
    textArea.value = description;
    submitBtn.click();
    console.log('now i should submit');
  });
};
