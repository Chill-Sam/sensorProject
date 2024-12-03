firebase.initializeApp(firebaseConfig);
var database = firebase.database();

var temperature_dataset;
var humidity_dataset;

// Event listener for latest value, updated more often than long term storage.
database.ref("latest").on("value", (snapshot) => {
    const data = snapshot.val();
    updateLatest(data);
});

// Reformat the date to remove leading zeroes. We do this to conform to the ESP8266 upload code which does not add leading zeroes.
const rawDateValue = dateInput.value; // e.g., "2024-01-01"
const [year, month, day] = rawDateValue.split("-");
const formattedDate = `${year}-${parseInt(month)}-${parseInt(day)}`; // e.g., "2024-1-1"

var dateRef = database.ref(formattedDate);

// When a new date is selected, update the database reference to the selected date
dateInput.addEventListener("change", (_event) => {
    graph.clearChart();
    if (!dateInput.value) {
        dateRef = database.ref("0000-00-00");
        return;
    }
    // Reformat date to conform to ESP8266 code.
    const rawDateValue = dateInput.value; // e.g., "2024-01-01"
    const [year, month, day] = rawDateValue.split("-");
    const formattedDate = `${year}-${parseInt(month)}-${parseInt(day)}`; // e.g., "2024-1-1"

    dateRef = database.ref(formattedDate);

    // We run get() here to get the data, this is because .on does not activate when we update dateRef
    dateRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();

            // We multiply timestamp by 1000 to conform to chart.js using ms for timestamps
            temperature_dataset = Object.values(data).map((entry) => ({
                x: entry.timestamp * 1000,
                y: entry.temperature,
            }));

            humidity_dataset = Object.values(data).map((entry) => ({
                x: entry.timestamp * 1000,
                y: entry.humidity,
            }));
        }
        update();
    });
});

// Listener on dateRef
dateRef.on("value", (snapshot) => {
    if (!dateInput.value) {
        return; // No date selected
    }

    const data = snapshot.val();
    if (!data) {
        return;
    }

    // We multiply timestamp by 1000 to conform to chart.js using ms for timestamps
    temperature_dataset = Object.values(data).map((entry) => ({
        x: entry.timestamp * 1000,
        y: entry.temperature,
    }));

    humidity_dataset = Object.values(data).map((entry) => ({
        x: entry.timestamp * 1000,
        y: entry.humidity,
    }));
    update();
});
