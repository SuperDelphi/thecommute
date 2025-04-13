import QrScanner from "./lib/qr-scanner.min.js";

// Elements
let startBtn = null;

let scanner = null;
let collectedStamps = [];
let stamps = [];
let playIntroduction = false;

let holdingPercentage = 0;
const holdingTime = 2000;
const holdingInterval = 100;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    // DOM elements
    startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", loadMain);

    // Get param from URL
    const urlParams = new URLSearchParams(window.location.search);
    const startId = urlParams.get("s");
    if (localStorage.getItem("s") == null && startId) {
        if (["1", "2"].includes(startId)) {
            localStorage.setItem("s", startId); // Set the experience ID to 1 or 2 based on the URL parameter
        } else {
            localStorage.setItem("s", "0"); // Default to 0 if the user entered the experience from any QR code
        }
        playIntroduction = true;
    }

    const savedStamps = localStorage.getItem("stamps");
    if (savedStamps) {
        collectedStamps = JSON.parse(savedStamps);
    }

    stamps = await fetchStamps();
}

/**
 * Shows the stamp modal, playing the audio and displaying the transcription in real-time.
 * @param {string} stampId The stamp ID
 */
function showStampModal(stampId) {
    const stamp = stamps.find(s => s.id === stampId);

    if (!stamp) {
        return;
    }

    console.log(stamp);
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

    // Init scanner
    startScanner();
}

function holdQRCode(decodedText) {
    const urlParams = new URLSearchParams(decodedText);
    const stampId = urlParams.get("c");

    if (!stampId) {
        return;
    }

    holdingPercentage = 0;
    const interval = setInterval(() => {
        holdingPercentage += holdingInterval;
        console.log("Holding percentage:", holdingPercentage);
        // Make phone vibrate
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        if (holdingPercentage >= holdingTime) {
            clearInterval(interval);
            holdingPercentage = 0;
            showStampModal();
            collectStamp();
            console.log("Stamp collected:", stampId);
        }
    })
}

function releaseQRCode(error) {
    if (error) {
        console.error("Error releasing QR code:", error);
    } else {
        // holdingPercentage = 0;
    }
}

function startScanner() {
    if (!scanner) {
        // try {
        //     scanner = new Scanner("scanner", holdQRCode, releaseQRCode);
        //     scanner.init();
        // } catch (err) {
        //     console.error("Error creating scanner: ", err);
        // }
        scanner = new QrScanner(
            document.getElementById("scanner"),
            holdQRCode,
            {
                onDecodeError: releaseQRCode,
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
                maxScansPerSecond: 5
            }
        )
        scanner.setInversionMode("invert");
        scanner.start();
    } else if (scanner && typeof scanner.stop === "function" && typeof scanner.start === "function") {
        scanner.stop();
        scanner.start();
    }
}