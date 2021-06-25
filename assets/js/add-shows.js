let movies = [];
let screens = [];
let timeArray = ["11:00", "14:00", "18:00", "22:00"];
document.addEventListener("load", onPageLoad());
document
  .getElementById("sumbit-add-show")
  .addEventListener("click", submitAddShowForm);

function onPageLoad() {
  makeTimeOptions(1);
  loadShowsTable();
  callGetApi("movies").then((response) => {
    movies = response.data;
    makeMovieOptions(1);
  });

  callGetApi("screens").then((response) => {
    screens = response.data;
    makeScreenOptions(1);
  });
}

function makeScreenOptions(index) {
  let select = document.getElementById("screens" + index);
  screens.forEach(function (data) {
    let option = document.createElement("option");
    option.value = data.id;
    option.innerHTML = data.name;
    select.append(option);
  });
}

function makeMovieOptions(index) {
  let select = document.getElementById("movies" + index);
  movies.forEach(function (data) {
    let option = document.createElement("option");
    option.value = data.id;
    option.innerHTML = data.name;
    option.className = "selectOption";
    select.append(option);
  });
}

function makeTimeOptions(index) {
  let select = document.getElementById("time" + index);
  timeArray.forEach(function (data) {
    let option = document.createElement("option");
    option.value = data;
    option.innerHTML = data;
    select.append(option);
  });
}

function submitAddShowForm(e) {
  e.preventDefault();
  let form = this.closest("form");
  let formElements = form.elements;
  let isValidForm = validateForm(formElements);

  if (!isValidForm) {
    addToast("Please submit valid input!", "error");
    return;
  }
  let params = makeFormData();
  callPostApi("shows", params).then((response) => {
    addToast(response.msg, response.status);
  });
  loadShowsTable();
}

function makeFormData() {
  let movies = document.getElementsByName("movies[]");
  let screens = document.getElementsByName("screens[]");
  let dates = document.getElementsByName("dates[]");
  let time = document.getElementsByName("time[]");

  let formData = [];

  for (let i = 0; i < movies.length; i++) {
    let showArray = {
      movie: movies[i].value,
      screen: getSelectedValues(screens[i].selectedOptions),
      date: dates[i].value,
      time: getSelectedValues(time[i].selectedOptions),
    };
    formData.push(showArray);
  }
  return formData;
}

function loadShowsTable() {
  let showTable = "";
  callGetApi("shows").then((response) => {
    response.data.forEach(function (data) {
      showTable += `
              <tr>
              <td>${data.movie_name  ?? "NA"}</td>
              <td>${data.screen_name ?? "NA"}</td>
              <td>${data.show_time ?? "NA"}</td>
              <td>${data.tickets_sold}/${data.seat_count }</td>
              `;
    });
    document.getElementById("table-body").innerHTML = showTable;
  });
}
