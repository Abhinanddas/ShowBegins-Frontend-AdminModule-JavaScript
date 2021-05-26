let movies = [];
let screens = [];
let timeArray = ['11:00', '14:00', '18:00', '22:00'];
document.addEventListener("load", onPageLoad());
document.getElementById('sumbit-add-show').addEventListener('click', submitAddShowForm);

function onPageLoad() {

    makeTimeOptions(1);
    callPostApi('list-active-movies').then((response) => {
        movies = response.data;
        makeMovieOptions(1);
    });

    callPostApi('list-all-screens').then((response) => {
        screens = response.data;
        makeScreenOptions(1);
    });

}

function makeScreenOptions(index) {
    let select = document.getElementById('screens' + index);
    screens.forEach(function (data) {
        let option = document.createElement('option');
        option.value = data.id;
        option.innerHTML = data.name;
        select.append(option);
    });
}

function makeMovieOptions(index) {
    let select = document.getElementById('movies' + index);
    movies.forEach(function (data) {
        let option = document.createElement('option');
        option.value = data.id;
        option.innerHTML = data.name;
        option.className = 'selectOption';
        select.append(option);
    });
}

function makeTimeOptions(index) {
    let select = document.getElementById('time' + index);
    timeArray.forEach(function (data) {
        let option = document.createElement('option');
        option.value = data;
        option.innerHTML = data;
        select.append(option);
    });
}

function submitAddShowForm(e) {
    e.preventDefault();
    let form = this.closest('form');
    let formElements = form.elements;
    let isValidForm = validateForm(formElements);

    if (!isValidForm) {
        addToast('Please submit valid input!', 'error');
        return;
    }
    let params = makeFormData();
    callPostApi('add-show', params).then((response) => {
        addToast(response.msg,response.status);
    })
}

function makeFormData() {
    let movies = document.getElementsByName('movies[]');
    let screens = document.getElementsByName('screens[]');
    let dates = document.getElementsByName('dates[]');
    let time = document.getElementsByName('time[]');

    let formData = [];

    for (let i = 0; i < movies.length; i++) {
        let showArray = {
            'movie': movies[i].value,
            'screen': getSelectedValues(screens[i].selectedOptions),
            'date': dates[i].value,
            'time': getSelectedValues(time[i].selectedOptions),
        };
        formData.push(showArray);
    }
    return formData;
}

function getSelectedValues(selectedOptions) {

    let selectedValues = [];
    Array.from(selectedOptions).forEach(option => {
        selectedValues.push(option.value);
    });
    return selectedValues;
}
