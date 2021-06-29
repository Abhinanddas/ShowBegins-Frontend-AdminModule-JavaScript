document.addEventListener("load", onPageLoad());
document
  .getElementById("sumbit-add-movie")
  .addEventListener("click", submitAddMovieForm);

function onPageLoad() {
  loadMovieTable();
}

function loadMovieTable() {
  let movieTableHtml = "";
  callGetApi("movies").then((response) => {
    response.data.forEach(function (movie) {
      movieTableHtml += `
            <tr>
            <td>${movie.name}</td>
            <td>${movie.language??''}</td>
            <td>${movie.rating??''}</td>
            <td>${movie.show_count}</td>
            <td>${movie.num_of_tickets}</td>
            <td>${movie.collection}</td>
            `;
    });
    document.getElementById("movie-table-body").innerHTML = movieTableHtml;
  });
}

function submitAddMovieForm(e) {
  e.preventDefault();
  let form = this.closest("form");
  let formElements = form.elements;
  let isValidForm = validateForm(formElements);

  if (!isValidForm) {
    addToast("Please submit valid input!", "error");
    return;
  }
  let params = makeFormData();
  callPostApi("movies", params).then((response) => {
    addToast(response.msg, response.status);
    loadMovieTable();
  });
}

function makeFormData() {
  return {
    name: document.getElementById("name").value,
    language: document.getElementById("language").value,
    rating: document.getElementById("rating").value,
  };
}
