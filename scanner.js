export default class Scanner {
    constructor(id) {
        this.html5Qrcode = new Html5Qrcode(id);
        this.cameraId = null;
    }

    async init() {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                this.cameraId = devices[0].id;

                this.html5Qrcode.start(
                    { facingMode: "environment"},
                    {
                        fps: 10,
                        qrbox: {
                            width: 700,
                            height: 700
                        }
                    },
                    this.onScanSuccess,
                    this.onScanFailure
                ).catch(err => {
                    console.log(err);
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    onScanSuccess(decodedText, decodedResult) {
        console.log("Ceci est un test : " + decodedText);
    }

    onScanFailure(error) {}

    // TODO: Mettre caméra arrière
}