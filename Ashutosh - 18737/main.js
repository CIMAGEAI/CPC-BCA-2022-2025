// Sample bike data
const bikeData = [
  {
    name: "KTM",
    type: "Racing",
    price: 1799,
    image: "ktm.png",
    tag: "Free Cancellation",
  },
  {
    name: "Continental GT",
    type: "Racing",
    price: 1999,
    image: "continental-gt.png",
    tag: "Free Cancellation",
  },
  {
    name: "Hero Hunk",
    type: "petrol Bike",
    price: 850,
    image: "hunk (1).png",
    tag: "Free Cancellation",
  },
  {
    name: "Bajaj Pulsar",
    type: "petrol Bike",
    price: 999,
    image: "pulsar (1).png",
    tag: "Free Cancellation",
  },
  {
    name: "Royal Enfield",
    type: "petrol Bike",
    price: 1299,
    image: "royal enfield (1).png",
    tag: "Free Cancellation",
  },
  {
    name: "Hero Xpro",
    type: "city Bike",
    price: 799,
    image: "passion xpro.png",
    tag: "Free Cancellation",
  },
  {
    name: "Ola Roadster",
    type: "Electric Bike",
    price: 899,
    image: "ola roadster.png",
    tag: "Free Cancellation",
  },
  {
    name: "TVS IQube",
    type: "Electric Scooty",
    price: 699,
    image: "tvs iqube.png",
    tag: "Free Cancellation",
  },
  {
    name: "TVS Jupiter",
    type: "Petrol Scooty",
    price: 599,
    image: "tvs jupiter.png",
    tag: "Free Cancellation",
  }
];

// Function to create bike box element
const createBikeBox = (bike) => `
  <div class="bikes-box">
    <img src="${bike.image}" alt="${bike.name}" class="box-img">
    <div class="title-price">
      <div class="title-data">
        <h2>${bike.name}</h2>
        <p>${bike.type}</p>
      </div>
      <h3 class="bike-price">Rs.${bike.price} <span>per day</span></h3>
    </div>
    <a href="payment.html" class="book-btn" onclick="handleBooking(event, '${bike.price}')">Book Bike</a>
    <span class="tag">${bike.tag}</span>
  </div>
`;
function handleBooking(event, price) {
  event.preventDefault();
  window.location.href = `payment.html?price=${encodeURIComponent(price)}`;
}



// creating bike data into DOM
const bikeContent = document.querySelector('.bikes-content');
bikeData.forEach((bike) => {
  const bikeBoxHtml = createBikeBox(bike);
  bikeContent.insertAdjacentHTML('beforeend', bikeBoxHtml);
});

// begining of  Swiper
const swiper = new Swiper(".destination-container", {
  slidePerView: 1,
  spaceBetween: 10,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
    clickable: true,
  },
  breakpoints: {
    280:{
      slidesPerView: 1,
      spaceBetween: 10,
    },
    320:{
      slidesPerView: 1,
      spaceBetween: 10,
    },
    510:{
      slidesPerView: 2,
      spaceBetween: 10,
    },
    750:{
      slidesPerView: 3,
      spaceBetween: 15,
    },
    900:{
      slidesPerView: 4,
      spaceBetween: 20,
    },

  },
 
});

// Mobile menu toggle
let menu = document.querySelector(".menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  navbar.classList.toggle("open-menu");
  menu.classList.toggle("move");
};
