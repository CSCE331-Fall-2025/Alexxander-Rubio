let toggle = document.getElementById("toggle");
let bulbOn = false;


if (localStorage.getItem("bulbOn") !== null) {
    bulbOn = localStorage.getItem("bulbOn") === "true";
}


if (toggle) {
    if (bulbOn) {
        toggle.classList.remove('off');
        document.body.classList.remove('dim');
        changeBulbColor('#fff');
    } else {
        toggle.classList.add('off');
        document.body.classList.add('dim');
        changeBulbColor('#444');
    }

    toggle.onclick = function () {
        bulbOn = !bulbOn;
        localStorage.setItem("bulbOn", bulbOn);

        if (bulbOn) {
            toggle.classList.remove('off');
            document.body.classList.remove('dim');
            changeBulbColor('#fff');
        } else {
            toggle.classList.add('off');
            document.body.classList.add('dim');
            changeBulbColor('#444');
        }
    };
}

function changeBulbColor(color) {
    document.documentElement.style.setProperty('--light-color', color);
}


const switchBtn = document.getElementById("style-switch");
const stylesheet = document.querySelector("link[rel='stylesheet']");


if (stylesheet && localStorage.getItem("altStyle") === "true") {
    stylesheet.href = "styles-alt.css";
}

if (switchBtn && stylesheet) {
    switchBtn.addEventListener("click", () => {
        const isAlt = stylesheet.href.includes("styles-alt.css");
        if (isAlt) {
            stylesheet.href = "styles.css";
            localStorage.setItem("altStyle", false);
        } else {
            stylesheet.href = "styles-alt.css";
            localStorage.setItem("altStyle", true);
        }
    });
}
