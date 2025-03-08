import Scanner from "./scanner.js";

// Elements
let startBtn = null;

let scanner = null;
let collectedStamps = [];
let stamps = [];

document.addEventListener("DOMContentLoaded", init);

async function init() {
    // DOM elements
    startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", loadMain);

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
    return fetch("stamps.json")
        .then(response => response.json());
}

function collectStamp(stampId) {
    // Check if the stamp is already collected or if the stamp ID is invalid
    const isStampCollected = collectedStamps.includes(stampId);
    const isStampInvalid = !stamps.find(stamp => stamp.id === stampId);

    if (isStampCollected || isStampInvalid) {
        return;
    }
    
    collectedStamps.push(stampId);
    localStorage.setItem("stamps", JSON.stringify(collectedStamps));
}

function loadMain() {
    navigateToPage("p-main");
    startScanner();
}

function startScanner() {
    if (!scanner) {
        try {
            scanner = new Scanner("scanner");
            scanner.init();
        } catch (err) {
            console.error("Error creating scanner: ", err);
        }
    } else if (scanner && typeof scanner.stop === "function" && typeof scanner.init === "function") {
        scanner.stop();
        scanner.init();
    }
}