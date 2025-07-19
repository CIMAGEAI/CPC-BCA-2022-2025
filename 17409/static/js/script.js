function handlePlanClick(planName) {
  if (typeof isLoggedIn !== 'undefined' && isLoggedIn === true) {
    window.location.href = `/purchase/${planName}/`;
  } 
  else {
    alert("Please log in to purchase a plan.");
    window.location.href = "/login/";
  }
}
