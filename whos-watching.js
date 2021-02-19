console.log('Hi there! 🔥');
const shit = '💩',
  fire = '🔥',
  rocket = '🚀',
  poudzo = '👍🏻';

// user
let watcher = null;
let editProfileOn = false;
const imgsDom = document.querySelectorAll('.row img');
const editProfileBtn = document.getElementById('editProfileBtn');

imgsDom.forEach((img, idx) => (img.src = `prof-pic/${idx}.png`));

editProfileBtn.addEventListener('click', triggerEdit);

imgsDom.forEach((img) => img.addEventListener('click', setUser));
function setUser(e) {
  e.preventDefault();
  const source = e.target.src;
  const watcher = source.slice(source.indexOf('prof-pic'));
  console.log(watcher);
}

function triggerEdit(e) {
  editProfileOn = !editProfileOn;
  console.log(editProfileOn);
  e.target.classList.toggle('edit-toggled');
}
