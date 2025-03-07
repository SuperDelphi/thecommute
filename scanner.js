let cameraId;
const html5Qrcode = new Html5Qrcode("scanner");

function onScanSuccess(decodedText, decodedResult) {
    console.log("Ceci est un test : " + decodedText);
}

function onScanFailure(error) {
    
}

// TODO: Mettre caméra arrière

Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
        cameraId = devices[0].id;

        html5Qrcode.start(
            { facingMode: "environment"},
            {
                fps: 10,
                qrbox: {
                    width: 700,
                    height: 700
                }
            },
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.log(err);
        });
    }
}).catch(err => {
    console.log(err);
});
