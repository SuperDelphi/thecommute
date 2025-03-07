const collectedStamps = [];

function init() {
    const savedStamps = localStorage.getItem("stamps");
    if (savedStamps) {
        collectedStamps = JSON.parse(savedStamps);
    }
}