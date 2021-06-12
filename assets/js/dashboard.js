document.addEventListener('load', onPageLoad());

function onPageLoad() {
    callPostApi('list-active-shows').then(response => {
        if (response.status === 'success') {
            makeBookingScreen(response.data);
        }
    });
}

function makeBookingScreen(response) {

    response.forEach((movie) => {
        let movieName = movie.movie_name;
        let movieId = movie.movie_id;
        addMovieDiv(movieId, movieName);
        movie.screens.forEach((screen) => {
            let screenId = screen.screen_id;
            let screenName = screen.screen_name;
            addScreenDiv(movieId, screenId, screenName);
            screen.shows.forEach((show) => {
                let showId = show.show_id;
                let showTime = show.show_time;
                addShowDiv(movieId, screenId, showId, showTime);
            });
        });
    });
}

function addMovieDiv(movieId, movieName) {

    let div = ` <div class="col-12">
            <div class="card card-chart">
              <div class="card-header ">
                <div class="row">
                  <div class="col-sm-6 text-left">
                    <h2 class="card-title">${movieName}</h2>
                  </div>
                  </div>
              </div>
              <div class="card-body">
                <div id="movie-div-${movieId}"></div>
              </div>
            </div>
          </div>`;
    document.getElementById('dashboard-section').innerHTML += div;
}

function addScreenDiv(movieId, screenId, screenName) {

    let div = `
    <div class="col-sm-12">
    <h4 class="card-title">${screenName}</h2>
    <div id="screen-div-${movieId}-${screenId}"></div>
  </div>
    `;
    document.getElementById('movie-div-' + movieId).innerHTML += div;
}

function addShowDiv(movieId, screenId, showId, showTime) {
    let div = `
        <button type="" class="btn btn-fill btn-primary" onClick="showButtonClick(${showId},${movieId},${screenId})" data-show-id="${showId}">${showTime}</button>
    `;
    document.getElementById(`screen-div-${movieId}-${screenId}`).innerHTML += div;
}

function showButtonClick(showId, movieId, screenId) {
    window.location = 'booking_page.html' + '?showId=' + showId + '&screenId=' + screenId + '&movieId=' + movieId;
}