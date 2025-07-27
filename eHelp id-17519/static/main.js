function toggleMenu() {
  document.getElementById('navbarLinks').classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  setInterval(nextSlide, 5000);
});
 
// Ask location and show hospitals
document.getElementById("findBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showNearest, showError);
  } else {
    alert("Geolocation not supported.");
  }
});

function showNearest(position) {
  const userLat = position.coords.latitude;
  const userLng = position.coords.longitude;

  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth" });

  const hospitals = [
    { id: "hospital-1", lat: 25.616, lng: 85.131 },
    { id: "hospital-2", lat: 25.620, lng: 85.120 },
    { id: "hospital-3", lat: 25.615, lng: 85.145 }
  ];

  hospitals.forEach(hospital => {
    const dist = getDistance(userLat, userLng, hospital.lat, hospital.lng).toFixed(2);
    const el = document.querySelector(`#${hospital.id} .distance`);
    if (el) {
      el.innerText = `${dist} km away`;
    }
  });
}

function showDetails(id, lat, lon, name, phone) {
  const div = document.getElementById(id);
  div.innerHTML = `
    <iframe src="https://www.google.com/maps?q=${lat},${lon}&hl=es;z=14&output=embed"></iframe>
    <a href="tel:${phone}">📞 Call Now</a>
    <a href="booking.html?hospital=${encodeURIComponent(name)}">🛏️ Book Emergency Bed</a>
  `;
}

function showError(error) {
  alert("Location access denied or unavailable.");
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
 

function getDirections(hospitalAddress) {
  console.log("Clicked! Address is:", hospitalAddress); // Add this line

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${encodeURIComponent(hospitalAddress)}&travelmode=driving`;
      window.open(url, '_blank');
    }, function(error) {
      alert("Location access denied or unavailable.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function getDirections(destinationAddress) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${encodeURIComponent(destinationAddress)}`;
        window.open(mapUrl, '_blank');
      }, function () {
        alert('Location access denied. Please enable location to get directions.');
      });
    } else {
      alert('Geolocation not supported by this browser.');
    }
  }