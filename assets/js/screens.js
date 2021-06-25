document.addEventListener("load", onPageLoad());
document
  .getElementById("sumbit-add-screen")
  .addEventListener("click", sumbitForm);
document
  .getElementById("sumbit-update-screen")
  .addEventListener("click", submitUpdateForm);

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
            <td>${screen.seating_capacity ?? ''}</td>
            <td>
            <i class="tim-icons icon-pencil" onclick="edit(${screen.id})" id="screen-${screen.id}" data-name="${screen.name}"></i>/
            <i class="tim-icons icon-trash-simple" onclick="remove(${screen.id})" id="screen-${screen.id}" data-name="${screen.name}"></i>
            </td>
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
    clearForm(form);
  });
}

function makeFormData() {
  return {
    name: document.getElementById("name").value,
    seating_capacity: document.getElementById("seating_capacity").value,
  };
}

function edit(id) {
  let name = document.getElementById('screen-' + id).getAttribute('data-name');
  loadEditForm(id);
}

function remove(id) {
  let name = document.getElementById('screen-' + id).getAttribute('data-name');
  showRemovalPrompt(id, name);
}

function showRemovalPrompt(id, name) {
  cuteAlert({
    type: "question",
    title: "Confirm Removal",
    message:
      "Are you sure you want to remove <b>" +
      name,
    confirmText: "Remove",
    cancelText: "Cancel",
  }).then((e) => {
    if (e == "confirm") {
      removeScreen(id);
    }
  });
}

function removeScreen(id) {
  callDeleteApi('screens', id).then(response => {
    if (response.status === 'success') {
      addToast(response.msg, response.status);
    }
  });
}

function loadEditForm(id) {

  callGetApi('screen' + '/' + id).then(response => {
    if (response.status === 'success') {
      makeUpdateForm(response.data);
    } else {
      addToast(response.msg, response.status);
    }
  })
}

function makeUpdateForm(data) {
  document.getElementById("name").value = data.name;
  document.getElementById("seating_capacity").value = data.seating_capacity;
  document.getElementById('sumbit-update-screen').classList.remove('hidden');
  document.getElementById('sumbit-add-screen').classList.add('hidden');
  document.getElementById('sumbit-update-screen').setAttribute('data-id', data.id);
}

function submitUpdateForm(e) {
  e.preventDefault();
  let form = this.closest("form");
  let formElements = form.elements;
  let isValidForm = validateForm(formElements);

  if (!isValidForm) {
    addToast("Please submit valid input!", "error");
    return;
  }
  let params = makeFormData();
  params.id = document.getElementById('sumbit-update-screen').getAttribute('data-id');
  callPostApi("screens", params).then((response) => {
    addToast(response.msg, response.status);
    loadScreenTable();
    clearForm(form);
    document.getElementById('sumbit-update-screen').classList.add('hidden');
    document.getElementById('sumbit-add-screen').classList.remove('hidden');
    document.getElementById('sumbit-update-screen').removeAttribute('data-id');
  });
}