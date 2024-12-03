// We manage chart.js in a class named Graph to simplify the process of handling the chart.

class Graph {
    #chart; // Chart object
    #temperatureColor = "rgba(255, 165, 0, 1)";
    #humidityColor = "rgba(75, 192, 192, 1)";
    #datasets = [
        {
            label: "Temperature",
            data: [],
            borderColor: this.#temperatureColor,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            yAxisID: "y1",
            lineTension: 0.4,
        },
        {
            label: "Humidity",
            data: [],
            borderColor: this.#humidityColor,
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            yAxisID: "y2",
            lineTension: 0.4,
        },
    ];
    #scales = {
        x: {
            type: "linear",
            title: {
                display: true,
                text: "Time",
            },

            // Display timestamp as a date
            ticks: {
                color: "black",
                callback: (value) =>
                    new Date(value).toLocaleTimeString("sv-SE", {
                        timeZone: "Europe/Berlin",
                    }),
            },
            // Will be set dynamically
            min: 0,
            max: 0,
        },
        y1: this.#axisConfig("linear", "left", "Temperature (°C)"),
        y2: this.#axisConfig("linear", "right", "Humidity (%)"),
    };

    #plugins = {
        // Display time on hover
        tooltip: {
            callbacks: {
                title: (context) => this.#formatTime(context[0].raw.x),
            },
        },
    };

    // Methods
    // Private methods
    #axisConfig(type, position, title) {
        return {
            type,
            position,
            title: {
                display: true,
                text: title,
                color: "black",
            },
            ticks: {
                color: "black",
            },
        };
    }

    #formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    #getType(type) {
        return type == "temperature" ? 0 : 1;
    }

    // Public methods
    constructor(ctx) {
        this.ctx = ctx;
    }

    init() {
        this.#chart = new Chart(this.ctx, {
            type: "line",
            data: {
                datasets: this.#datasets,
            },
            options: {
                responsive: true,
                scaleFontColor: "#000000",
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    axis: "x",
                },
                animation: false,
                parse: false,
                scales: this.#scales,
                plugins: this.#plugins,
            },
        });
    }

    // Clear a specific dataset, type = ("temperature", "humidity")
    clearDataset(type) {
        let i = this.#getType(type);
        this.#chart.data.datasets[i].data = [];
        this.#chart.update();
    }

    // Clear the entire chart
    clearChart() {
        this.clearDataset("temperature");
        this.clearDataset("humidity");
    }

    updateChart(type, dataset) {
        let i = this.#getType(type);
        this.#chart.data.datasets[i].data = dataset;
        this.#chart.update();
    }

    setScale(min, max) {
        this.#chart.options.scales.x.min = min;
        this.#chart.options.scales.x.max = max;
    }
}

const ctx = document.getElementById("measurement-graph").getContext("2d");
const graph = new Graph(ctx);
graph.init();
