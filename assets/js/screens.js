document.addEventListener("load", onPageLoad());
document
  .getElementById("sumbit-add-screen")
  .addEventListener("click", sumbitForm);

function onPageLoad() {
  loadScreenTable();
}

function loadScreenTable() {
  let screenTableHtml = "";
  callGetApi("screens").then((response) => {
    response.data.forEach(function (screen) {
      screenTableHtml += `
            <tr>
            <td>${screen.name}</td>
            <td>${screen.seating_capacity??''}</td>
            `;
    });
    document.getElementById("screen-table-body").innerHTML = screenTableHtml;
  });
}

function sumbitForm(e) {
  e.preventDefault();
  let form = this.closest("form");
  let formElements = form.elements;
  let isValidForm = validateForm(formElements);

  if (!isValidForm) {
    addToast("Please submit valid input!", "error");
    return;
  }
  let params = makeFormData();
  callPostApi("screens", params).then((response) => {
    addToast(response.msg, response.status);
    loadScreenTable();
  });
}

function makeFormData() {
  return {
    name: document.getElementById("name").value,
    seating_capacity: document.getElementById("seating_capacity").value,
  };
}
