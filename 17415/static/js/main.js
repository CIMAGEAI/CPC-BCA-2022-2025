document.addEventListener("DOMContentLoaded", () => {
  fetch('http://127.0.0.1:8000/courses/') // adjust this if you used "api/courses/"
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("courses-container");
      data.forEach(course => {
        const div = document.createElement("div");
        div.classList.add("course-card");
        div.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <a href="course-detail.html?id=${course.id}" class="btn">View Details</a>
        `;
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.error("Error fetching courses:", error);
    });
});
