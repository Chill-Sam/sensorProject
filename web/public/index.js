// Colors
const temperatureColor = "rgba(255, 165, 0, 1)";
const humidityColor = "rgba(75, 192, 192, 1)";

const dateInput = document.getElementById("date-input");
dateInput.valueAsDate = new Date(); // Set to today by default

var selectedTemp = true;
var selectedHum = false;

function updateLatest(reading) {
    const currentTemperature = document.getElementById("current-temperature");
    const currentHumidity = document.getElementById("current-humidity");

    if (!reading) {
        return; // No data or error
    }

    // Set color of text
    currentTemperature.style.color =
        reading.temperature > 24 ? "rgba(255, 0, 0, 1)" : temperatureColor;

    currentHumidity.style.color =
        reading.humidity > 40 ? "rgba(0, 0, 255, 1)" : humidityColor;

    currentTemperature.innerHTML = reading.temperature + "°C";
    currentHumidity.innerHTML = reading.humidity + "%";
}

function updateChart(type, date, dataset) {
    const offset = 3600000; // Offset for Europe/Berlin timezone
    let start = new Date(date).setHours(0, 0, 0, 0) - offset;
    let end = new Date(date).setHours(23, 59, 59, 999) - offset;

    graph.setScale(start, end);

    graph.updateChart(type, dataset);
}

function update() {
    if (selectedTemp) {
        updateChart("temperature", dateInput.value, temperature_dataset);
    } else {
        graph.clearDataset("temperature");
    }

    if (selectedHum) {
        updateChart("humidity", dateInput.value, humidity_dataset);
    } else {
        graph.clearDataset("humidity");
    }
}

document.querySelectorAll("#setting-wrapper button").forEach((button) => {
    button.addEventListener("click", (event) => {
        let selectedType = event.target.innerText.toLowerCase();

        switch (selectedType) {
            case "temperature":
                selectedTemp = !selectedTemp;
                break;
            case "humidity":
                selectedHum = !selectedHum;
                break;
            default:
                break;
        }
        update();
    });
});

function updateTime() {
    const timeDiv = document.getElementById("current-time");
    const now = new Date();
    timeDiv.textContent = now.toLocaleString("sv-SE", {
        timeZone: "Europe/Berlin",
    });
}

let date = dateInput.valueAsDate;
const offset = 3600000; // Offset for Europe/Berlin timezone
let start = new Date(date).setHours(0, 0, 0, 0) - offset;
let end = new Date(date).setHours(23, 59, 59, 999) - offset;

graph.setScale(start, end);

// Update time immediately and then every second
updateTime();
setInterval(updateTime, 1000);
