let timer;
let deleteFirstPhotoDelay;

async function start() {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    createBreedList(data.message);
  } catch (e) {
    console.log("There was a problem fetching the breed list.");
  }
}

start();

function createBreedList(breedList) {
  document.getElementById("breed").innerHTML = `
    <select onchange="loadByBreed(this.value)">
      <option>Choose a dog breed</option>
      ${Object.keys(breedList).map(breed => `<option>${breed}</option>`).join('')}
    </select>
  `;
}

async function loadByBreed(breed) {
  const slideshow = document.getElementById("slideshow");
  if (breed !== "Choose a dog breed") {
    slideshow.innerHTML = "<p class='loading'>Loading images...</p>";
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
      const data = await response.json();
      createSlideshow(data.message);
    } catch (e) {
      slideshow.innerHTML = "<p class='error'>Failed to load images.</p>";
      console.log("Error fetching images:", e);
    }
  }
}

function createSlideshow(images) {
  let currentPosition = 0;
  const slideshow = document.getElementById("slideshow");
  clearInterval(timer);
  clearTimeout(deleteFirstPhotoDelay);

  if (images.length > 1) {
    slideshow.innerHTML = `
      <div class="slide" style="background-image: url('${images[0]}')"></div>
      <div class="slide" style="background-image: url('${images[1]}')"></div>
    `;
    currentPosition += 2;
    if (images.length === 2) currentPosition = 0;

    timer = setInterval(nextSlide, 3000);
  } else {
    slideshow.innerHTML = `
      <div class="slide" style="background-image: url('${images[0]}')"></div>
      <div class="slide"></div>
    `;
  }

  function nextSlide() {
    slideshow.insertAdjacentHTML(
      "beforeend",
      `<div class="slide" style="background-image: url('${images[currentPosition]}')"></div>`
    );
    deleteFirstPhotoDelay = setTimeout(() => {
      document.querySelector(".slide").remove();
    }, 1000);

    currentPosition = (currentPosition + 1) % images.length;
  }
}

// Reset button functionality
document.getElementById("resetBtn").addEventListener("click", () => {
  const slideshow = document.getElementById("slideshow");
  slideshow.innerHTML = "";
  const selectBox = document.getElementById("breed").querySelector("select");
  selectBox.selectedIndex = 0;
  clearInterval(timer);
  clearTimeout(deleteFirstPhotoDelay);
});
