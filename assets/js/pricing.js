document.addEventListener("load", onPageLoad());
document
    .getElementById("sumbit-add-pricing")
    .addEventListener("click", submitAddPricingForm);
document.getElementById('sumbit-pricing-package').addEventListener('click', sumbitPricePackageForm);
document.getElementById('base-charges').addEventListener('change', loadOtherChargeOptions);
function onPageLoad() {
    loadPricingTable();
    callGetApi("pricing").then((response) => {
        makeBasePriceOptions(response.data);
    });
}

function loadPricingTable() {
    let pricingTableHtml = '';
    callGetApi("pricing").then((response) => {
        response.data.forEach(function (price) {
            pricingTableHtml += `
            <tr>
            <td>${price.name}</td>
            <td>${price.value} ${price.is_percentage ? '%' : ''}</td>
            <td></td>
            `;
        });
        if (pricingTableHtml === '') {
            pricingTableHtml = `
            <tr>
            <td colspan="3" class="text-center"> No data found.</td>
            </tr>
            `;
        }
        document.getElementById("pricing-table-body").innerHTML = pricingTableHtml;
    });
}

function submitAddPricingForm(e) {
    e.preventDefault();
    let form = this.closest("form");
    let formElements = form.elements;
    let isValidForm = validateForm(formElements);

    if (!isValidForm) {
        addToast("Please submit valid input!", "error");
        return;
    }
    let params = makeFormData();
    callPostApi("pricing", params).then((response) => {
        addToast(response.msg, response.status);
        loadPricingTable();
    });
}

function makeFormData() {
    return {
        name: document.getElementById("name").value,
        value: document.getElementById("value").value,
        is_value_in_percentage: document.getElementById("is-percentage").checked,
    };
}

function makeBasePriceOptions(prices) {
    let select = document.getElementById("base-charges");
    prices.forEach(function (data) {
        if (!data.is_percentage) {
            let option = document.createElement("option");
            option.value = data.id;
            option.innerHTML = data.name;
            select.append(option);
        }
    });
}

function sumbitPricePackageForm(e) {
    e.preventDefault();
    let form = this.closest("form");
    let formElements = form.elements;
    let isValidForm = validateForm(formElements);

    if (!isValidForm) {
        addToast("Please submit valid input!", "error");
        return;
    }
    let params = makePricePackageFormData();
    callPostApi("price-package", params).then((response) => {
        addToast(response.msg, response.status);
        loadPricePackageTable();
    });
}

function loadOtherChargeOptions() {
    callGetApi('pricing').then(response => {
        if (response.status === 'success') {
            makeOtherPriceOptions(response.data);
        } else {
            addToast(response.msg, response.status);
        }
    })
}

function makeOtherPriceOptions(prices) {

    let baseChargeOptions = getSelectedValues(document.getElementById('base-charges').selectedOptions);
    let select = document.getElementById('other-charges');
    select.innerText = null;
    prices.forEach(function (data) {
        if (!baseChargeOptions.includes(String(data.id))) {
            let option = document.createElement("option");
            option.value = data.id;
            option.innerHTML = data.name;
            select.append(option);
        }
    });
}

function loadPricePackageTable() {

}

function makePricePackageFormData() {
    return {
        name: document.getElementById("price-package-name").value,
        base_charges: getSelectedValues(document.getElementById("base-charges").selectedOptions),
        other_charges: getSelectedValues(document.getElementById("other-charges").selectedOptions),
    };

}