let urlParams = new URLSearchParams(window.location.search);
var showId = urlParams.get('showId');
let screenId = urlParams.get('screenId');
let movieId = urlParams.get('movieId');

document.addEventListener("load", onPageLoad());
document.getElementById('number-0f-tickets').addEventListener('change', fetchTicketCharge);

function onPageLoad() {
  getShowDetails();
  getTicketChargeInfo();
  makeSeats();
}

function makeSeats() {

  callGetApi('show-ticket-details' + '?showId=' + showId).then(response => {
    let bookedSeats = response.data.seats;
    const seats = document.querySelectorAll('.seat');

    seats.forEach(function (seat) {
      if (bookedSeats.includes(seat.id)) {
        seat.classList.add('booked-seat');
        seat.removeEventListener('click', onSeatClick)
      } else {
        seat.removeEventListener('click', onSeatClick)
        seat.addEventListener('click', onSeatClick)
      }
    });
  });

}
function onSeatClick(event) {
  event.target.classList.toggle('active');
}

function getTicketChargeInfo(num = 1) {
  callGetApi('ticket-charge' + '?num=' + num).then(response => {
    if (response.status === 'success') {
      makeTicketInfoDiv(response.data);
    }
  });
}

function makeTicketInfoDiv(data) {

  let divContent = '';
  for (let [key, price] of Object.entries(data.pricing)) {
    divContent += price.name + ': ' + price.amount + '<br>';
  }
  divContent += 'Total: ' + data.total_amount;
  document.getElementById('ticket-chagre-view').innerHTML = divContent;
}

function fetchTicketCharge() {
  let numOfTickets = document.getElementById('number-0f-tickets').value;
  getTicketChargeInfo(numOfTickets);
}

function checkPrice() {
  let num = document.getElementsByClassName('active').length;
  document.getElementById('number-0f-tickets').value = num;
  getTicketChargeInfo(num);
}

function cancelSelection() {
  document.querySelectorAll('.active').forEach(function (seat) {
    seat.classList.remove('active');
  });
}

function bookTickets() {

  let seats = document.querySelectorAll('.active');
  let num =seats.length;
  if (num === 0) {
    addToast('Please select a seat.', 'error');
    return;
  }

  callGetApi('ticket-charge' + '?num=' + num).then(response => {
    if (response.status === 'success') {
      promptTicketConfirm(response.data.total_amount, num);
    }
  });

}

function promptTicketConfirm(amount, numOfTickets) {
  cuteAlert({
    type: "question",
    title: "Confirm Ticket",
    message: "Are you sure you want to buy <b>"+ numOfTickets+"</b> ticket for an amount of <b>"+ amount +"</b>",
    confirmText: "Okay",
    cancelText: "Cancel"
  }).then((e) => {
    if (e == ("confirm")) {
      purchaseTicket();
    } 
  })
}

function purchaseTicket() {
  let seats = document.querySelectorAll('.active');
  let seatArray = [];
  seats.forEach(function (seat) {
    seatArray.push(seat.id);
  });
  let data = {
    'show_id': showId,
    'screen_id': screenId,
    'movie_id': movieId,
    'num_of_tickets': seats.length,
    'selected_seats': seatArray,
  };
  callPostApi('purchase-order', data).then((response) => {
    addToast(response.msg, response.status);
    seats.forEach(function (seat) {
      seat.classList.remove('active');
    })
    makeSeats();
  });
}

function getShowDetails() {

  callGetApi('show-details' + '?showId=' + showId).then((response) => {

    let data = response.data;
    let showTime = new Date(response.data.show_time); 
    let div = ` <div class="col-12">
            <div class="card card-chart">
              <div class="card-header ">
                <div class="row">
                  <div class="col-sm-6 text-left">
                    <h4>${data.movie_name}  &nbsp| ${data.screen_name} &nbsp| ${showTime.toLocaleTimeString().slice(0,5)}</h4>
                    <h4>${data.movie_name}  &nbsp| ${data.screen_name} &nbsp| ${showTime.toLocaleTimeString().slice(0,5)}</h4>
                  </div>
                  </div>
              </div>
            </div>
          </div>`;
    document.getElementById('show-info').innerHTML += div;
  });
}
