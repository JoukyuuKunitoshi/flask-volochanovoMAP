function toggleContactField() {
    var checkBox = document.getElementById("contact_permission");
    var contactInfo = document.getElementById("contact-info");
    if (checkBox.checked) {
        contactInfo.style.display = "block";
    } else {
        contactInfo.style.display = "none";
    }
}

function submitForm(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки submit
    var form = document.getElementById("feedback-form");
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/feedback");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Успешно отправлено
                console.log("Успешно отправлено!");
                // Изменяем содержимое popup
                var popupContent = document.getElementById("feedback-popup").querySelector(".popup-content");
                popupContent.innerHTML = "<span class='close' onclick='document.getElementById(\"feedback-popup\").style.display=\"none\"'>&times;</span><p>Спасибо за ваш отзыв!</p>";
            } else {
                // Ошибка отправки
                console.error("Ошибка отправки");
            }
        }
    };
    xhr.send(formData);
}

window.onclick = function(event) {
    const popup = document.getElementById('feedback-popup');
    const popupContent = document.getElementById('popup-content');
    if (event.target == popup && !popupContent.contains(event.target)) {
        popup.style.display = 'none';
    }
}