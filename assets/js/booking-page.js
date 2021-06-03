document.addEventListener("load", onPageLoad());
document.getElementById('number-0f-tickets').addEventListener('change', fetchTicketCharge);

function onPageLoad() {
  makeSeats();
  getTicketChargeInfo();
}

function makeSeats() {
  const divs = document.querySelectorAll('.seat');
  divs.forEach(el => el.addEventListener('click', event => {
    onSeatClick(event);
  }));

}
function onSeatClick(event) {
  event.target.classList.toggle('active');
}

function getTicketChargeInfo(num = 1) {
  callGetApi('ticket-charge?num=' + num).then(response => {
    if (response.status === 'success') {
      makeTicketInfoDiv(response.data);
    }
  });
}

function makeTicketInfoDiv(data) {

  let divContent = '';
  for (let [key, value] of Object.entries(data.pricing)) {
    divContent += key + ': ' + value + '<br>';
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

}
