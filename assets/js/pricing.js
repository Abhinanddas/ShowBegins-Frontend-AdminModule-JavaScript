document.addEventListener("load", onPageLoad());
document
    .getElementById("sumbit-add-pricing")
    .addEventListener("click", submitAddPricingForm);
document.getElementById('sumbit-pricing-package').addEventListener('click', sumbitPricePackageForm);
document.getElementById('base-charges').addEventListener('change', loadOtherChargeOptions);
function onPageLoad() {
    loadPricingTable();
    loadPricePackageTable();
    makeBasePriceOptions();
}

function loadPricingTable() {
    let pricingTableHtml = '';
    callGetApi("pricing").then((response) => {
        response.data.forEach(function (price) {
            pricingTableHtml += `
            <tr>
            <td>${price.name}</td>
            <td>${price.value} ${price.is_percentage ? '%' : ''}</td>
            <td><i class="tim-icons icon-trash-simple pointer" onclick="removePrice(${price.id})" id="screen-${price.id}" data-name="${price.name}"></i></td>
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
        makeBasePriceOptions();
        clearForm(form);
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
    callGetApi("pricing").then((response) => {
        if(response.status==='success'){

            let select = document.getElementById("base-charges");
            response.data.forEach(function (data) {
                if (!data.is_percentage) {
                    let option = document.createElement("option");
                    option.value = data.id;
                    option.innerHTML = data.name;
                    select.append(option);
                }
            });
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
        clearForm(form);
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
    let pricingPackageTableHtml = '';
    callGetApi('price-package').then(response => {
        if (response.status === 'success') {
            response.data.forEach(price => {

                let baseCharge = '';
                let otherCharge = '';
                price.price.forEach(charge => {
                    if (charge.is_base_charge == true) {
                        baseCharge += charge.name + '<br>';
                    } else {
                        otherCharge += charge.name + '<br>';
                    }
                });

                pricingPackageTableHtml += `
                <tr>
                <td>${price.name}</td>
                <td>${baseCharge}</td>
                <td>${otherCharge}</td>
                <td><i class="tim-icons icon-trash-simple pointer" onclick="removePricePackage(${price.id})" id="screen-${price.id}" data-name="${price.name}"></i></td>
                </tr>`;
            });
            if (pricingPackageTableHtml === '') {
                pricingPackageTableHtml = `
                <tr>
                <td colspan="4" class="text-center"> No data found.</td>
                </tr>
                `;
            }
            document.getElementById("pricing-package-table-body").innerHTML = pricingPackageTableHtml;
        }
    });

}

function makePricePackageFormData() {
    return {
        name: document.getElementById("price-package-name").value,
        base_charges: getSelectedValues(document.getElementById("base-charges").selectedOptions),
        other_charges: getSelectedValues(document.getElementById("other-charges").selectedOptions),
    };

}