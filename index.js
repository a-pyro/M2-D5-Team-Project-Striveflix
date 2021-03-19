const mainEntryPoint = document.getElementById('mainEntryPoint');

// nav scrolling effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', showNav);
function showNav() {
  // console.log(pageYOffset);
  if (pageYOffset > 250) {
    if (nav.classList.contains('backdrop-blur')) return;
    nav.style.transform = 'translateY(-200px)';
    setTimeout(() => {
      nav.classList.remove('bg-transparent');
      nav.classList.add('backdrop-blur');
      nav.style.transform = 'translateY(0)';
    }, 100);
  }

  if (pageYOffset === 0) {
    nav.style.transform = 'translateY(-200px)';
    setTimeout(() => {
      nav.style.transform = 'translateY(0)';
      nav.classList.add('bg-transparent');
      nav.classList.remove('backdrop-blur');
    }, 100);
  }
}

window.onload = getCategories;

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
    // console.log('categories: ', data);
    getDatas(data);
  } catch (error) {
    console.log(error);
  }
}

async function getDatas(categories) {
  try {
    const arrayOfPromises = categories.map(async (category) => {
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
    console.log(arrayOfPromises);
    const dataFromPromiseAll = await Promise.all(arrayOfPromises);
    console.log(dataFromPromiseAll);
    renderData(dataFromPromiseAll);
    //render Data
  } catch (error) {
    console.log(error);
  }
}

function renderData(data) {
  mainEntryPoint.innerHTML += data
    .map((category) => {
      return `
    
            <section class="container-fluid my-3">
              <h3 class="genre text-white">${category[0].category}</h3>
              <div class="row flex-nowrap">
                ${category.reduce((acc, cv) => acc + ColCardComponent(cv), '')}
            
              </div>
            </section>
             
             
             `;
    })
    .join('');
}

// function RowComponent() {}

function ColCardComponent({ imageUrl, _id: id, name }) {
  return `
      <div class="col mb-3">
        <a href="detailpage.html?${id}">
          <img src="${imageUrl}" class="" alt="${name} pic"/>
        </a>
      </div>
  `;
}
