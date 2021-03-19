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
}

async function postData(data) {}

// helper functions
function clearForm() {
  inputFields.forEach((field) => (field.value = ''));
  textArea.value = '';
}
