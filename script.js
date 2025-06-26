document.getElementById('showButton').addEventListener('click', function() {
    var sideAngleFields = document.getElementById('sideAngleFields');
    var twoSidesFields = document.getElementById('twoSidesFields');
    var triangleImage = document.getElementById('triangleImage');

    if (document.querySelector('input[name="inputType"]:checked').value === 'sideAngle') {
        sideAngleFields.style.display = 'block';
        twoSidesFields.style.display = 'none';
        triangleImage.src = 'img/sideAngle.png';
    } else {
        sideAngleFields.style.display = 'none';
        twoSidesFields.style.display = 'block';
        triangleImage.src = 'img/twoSides.png';
    }
});

function removeErrorOnInput() {
    this.classList.remove('error-input');
    var errorText = this.parentNode.querySelector('.error-text');
    if (errorText) errorText.remove();
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', removeErrorOnInput);
});

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        document.querySelector('.calculate-options').classList.remove('error-checkbox');
    });
});

document.getElementById('calculateButton').addEventListener('click', function() {
    var results = document.getElementById('results');
    results.innerHTML = '';

    var calculateBisector = document.getElementById('bisectorCheckbox').checked;
    var calculateHeight = document.getElementById('heightCheckbox').checked;
    var calculatePerimeter = document.getElementById('perimeterCheckbox').checked;
    var calculateMedian = document.getElementById('medianCheckbox').checked;
    var checkboxContainer = document.querySelector('.calculate-options');

    var a, alpha, base;
    var hasError = false;
    var allFieldsEmpty = true;

    var inputType = document.querySelector('input[name="inputType"]:checked').value;
    var sideAInput, angleBaseInput, sideA2Input, baseSideInput;

    if (inputType === 'sideAngle') {
        sideAInput = document.getElementById('sideA');
        angleBaseInput = document.getElementById('angleBase');
        a = parseFloat(sideAInput.value);
        alpha = parseFloat(angleBaseInput.value);
        
        allFieldsEmpty = sideAInput.value === '' && angleBaseInput.value === '';
    } else {
        sideA2Input = document.getElementById('sideA2');
        baseSideInput = document.getElementById('baseSide');
        a = parseFloat(sideA2Input.value);
        base = parseFloat(baseSideInput.value);

        allFieldsEmpty = sideA2Input.value === '' && baseSideInput.value === '';
    }

    var noCheckboxChecked = !calculateBisector && !calculateHeight && !calculatePerimeter && !calculateMedian;

    if (allFieldsEmpty && noCheckboxChecked) {
        document.querySelectorAll('input[type="number"]').forEach(input => input.classList.add('error-input'));
        checkboxContainer.classList.add('error-checkbox');
        results.innerHTML = '<p class="error">Заполните хотя бы одно поле и выберите характеристику для расчета.</p>';
        return;
    } else {
        document.querySelectorAll('input[type="number"]').forEach(input => input.classList.remove('error-input'));
        checkboxContainer.classList.remove('error-checkbox');
    }

    if (inputType === 'sideAngle') {
        if (isNaN(a) || a <= 0) showError(sideAInput, "Введите корректное значение для боковой стороны.");
        if (isNaN(alpha) || alpha <= 0 || alpha >= 90) showError(angleBaseInput, "Угол должен быть от 0 до 90 градусов.");
        if (hasError) return;
        base = 2 * a * Math.sin((alpha * Math.PI) / 180 / 2);
    } else {
        if (isNaN(a) || a <= 0) showError(sideA2Input, "Введите корректное значение для боковой стороны.");
        if (isNaN(base) || base <= 0 || base >= 2 * a) showError(baseSideInput, "Основание должно быть меньше 2 * a.");
        if (hasError) return;
        alpha = 2 * Math.asin((base / 2) / a) * (180 / Math.PI);
    }

    var output = '';
    if (calculateBisector) output += `<p>Биссектриса: ${calculateBisectorLength(a, base).toFixed(2)}</p>`;
    if (calculateHeight) output += `<p>Высота: ${calculateHeightLength(a, alpha).toFixed(2)}</p>`;
    if (calculatePerimeter) output += `<p>Периметр: ${(2 * a + base).toFixed(2)}</p>`;
    if (calculateMedian) output += `<p>Медиана: ${calculateMedianLength(a, base).toFixed(2)}</p>`;

    results.innerHTML = output;
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
        input.classList.remove('error-input');
    });
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
    document.querySelector('.calculate-options').classList.remove('error-checkbox');
    document.getElementById('results').innerHTML = '';
});

function calculateBisectorLength(a, base) {
    return Math.sqrt(a * a + (base / 2) * (base / 2)) - (base / 2);
}

function calculateHeightLength(a, alpha) {
    return a * Math.sin((alpha * Math.PI) / 180);
}

function calculateMedianLength(a, base) {
    return 0.5 * Math.sqrt(2 * a * a + base * base);
}

function showError(input, message) {
    input.classList.add('error-input');
    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-text')) {
        var errorText = document.createElement('span');
        errorText.classList.add('error-text');
        errorText.innerText = message;
        input.parentNode.appendChild(errorText);
    }
}
