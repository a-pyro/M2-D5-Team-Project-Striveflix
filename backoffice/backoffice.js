// console.log('im here from the back office');

// window.onload = getInputData;
// dom references
const form = document.getElementById('mainForm');
const inputFields = Array.from(document.getElementsByTagName('input'));
const textArea = document.getElementById('description');

// listeners
form.addEventListener('submit', getInputData);

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

// helper functions
function clearForm() {
  inputFields.forEach((field) => (field.value = ''));
  textArea.value = '';
}
