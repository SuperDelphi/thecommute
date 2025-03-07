let collectedStamps = [];
let stamps = [];

document.addEventListener("DOMContentLoaded", init);

async function init() {
    const savedStamps = localStorage.getItem("stamps");
    if (savedStamps) {
        collectedStamps = JSON.parse(savedStamps);
    }

    stamps = await fetchStamps();
}

function navigateToPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(page).classList.add("active");
}

async function fetchStamps() {
    return await fetch("/stamps.json")
        .then(response => response.json());
}

function collectStamp(stampId) {
    if (collectedStamps.includes(stampId) || !stamps.find(stamp => stamp.id === stampId)) {
        return;
    }
    console.log("Adding stamp", stampId);
    collectedStamps.push(stampId);
    localStorage.setItem("stamps", JSON.stringify(collectedStamps));
}