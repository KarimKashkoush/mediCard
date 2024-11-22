function healthyChange() {
    let healthySelect = document.getElementById("healthy");
    let healthyInput = document.getElementById("healthyInput")
    if (healthySelect.value == "لا يوجد" || healthySelect.value == "") {
        healthyInput.style.display = "none";
        healthyInput.value = "لا يوجد";
    } else {
        healthyInput.value = "";
        healthyInput.style.display = "block";
    }
}


function birthdayFun() {
    let day = document.getElementById("day")
    let month = document.getElementById("month")
    let year = document.getElementById("year")
    let birthday = document.getElementById("birthday")

    birthday.value = `${year.value}-${month.value}-${day.value}`
}

function openCloseNavbar() {
    let nav = document.getElementById('navbar');
    let icon = document.getElementById("iconNav");
    nav.classList.toggle('open');

    if (nav.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-x');
    } else {
        icon.classList.remove('fa-x');
        icon.classList.add('fa-bars');
    }
}


