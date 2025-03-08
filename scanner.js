export default class Scanner {
    constructor(canvasId) {
        this.html5Qrcode = null;
        this.cameraId = null;
        this.canvasId = canvasId;
        this.initialized = false;

        this.onScanSuccess = this.onScanSuccess.bind(this);
        this.onScanFailure = this.onScanFailure.bind(this);
    }

    async init() {
        this.html5Qrcode = new Html5Qrcode(this.canvasId, { verbose: false });

        try {
            let hasPermission = false;

            try {
                // Check if we already have permissions
                const permissions = await navigator.permissions.query({ name: "camera" });
                hasPermission = permissions.state === "granted";
                console.log("Permission state:", permissions.state);
            } catch (permErr) {
                console.error("Error checking permissions:", permErr);
            }

            const config = {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            };

            // Try environment facing mode
            try {
                await this.html5Qrcode.start(
                    { facingMode: "environment"},
                    config,
                    this.onScanSuccess,
                    this.onScanFailure
                );
                this.initialized = true;
                console.log("Scanned started with environment facing mode.");
                return;
            } catch (envErr) {
                console.log("Failed to start scanner with environment facing mode:", envErr);
            }

            // Try user facing mode
            try {
                await this.html5Qrcode.start(
                    { facingMode: "user"},
                    config,
                    this.onScanSuccess,
                    this.onScanFailure
                );
                this.initialized = true;
                console.log("Scanned started with user facing mode.");
                return;
            } catch (userErr) {
                console.log("Failed to start scanner with user facing mode:", userErr);
            }

            // Try camera enumeration as last resort
            try {
                const devices = await Html5Qrcode.getCameras();

                if (devices && devices.length) {
                    this.cameraId = devices[0].id;

                    await this.html5Qrcode.start(
                        { deviceId: this.cameraId },
                        config,
                        this.onScanSuccess,
                        this.onScanFailure
                    );
                    this.initialized = true;
                    console.log("Scanned started with camera enumeration.");
                }
            } catch (enumErr) {
                console.error("Error enumerating cameras:", enumErr);
            }
        } catch (err) {
            console.error("Error starting scanner:", err);
        }
    }

    onScanSuccess(decodedText, decodedResult) {
        console.log("Ceci est un test : " + decodedText);
    }

    onScanFailure(error) {}

    stop() {
        if (this.html5Qrcode && this.html5Qrcode.isScanning) {
            this.html5Qrcode.stop().catch(err => {
                console.log("Stop error: ", err);
            });
        }
    }
}