// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/**

 * Reference to the Firebase Realtime Database.
 * @type {firebase.database.Database}
 */
var database = firebase.database();

database.ref("latest").on("value", (snapshot) => {
    const data = snapshot.val();
    updateLatest(data);
});

var dateRef = database.ref(dateInput.value);

var temperature_dataset;
var humidity_dataset;
dateInput.addEventListener("change", (_event) => {
    graph.clearChart();
    if (!dateInput.value) {
        dateRef = database.ref("0000-00-00");
        return;
    }
    dateRef = database.ref(dateInput.value);
    dateRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
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

dateRef.on("value", (snapshot) => {
    if (!dateInput.value) {
        return; // No date selected
    }
    const data = snapshot.val();
    if (!data) {
        return;
    }
    // Process data

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
