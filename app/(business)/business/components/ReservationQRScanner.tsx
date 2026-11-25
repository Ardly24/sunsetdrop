"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ReservationQRScannerProps = {
  scannerOpen: boolean;
  scanResult: string;
  onClose: () => void;
  onVerify: (token: string) => void;
  onScanResult: (message: string) => void;
  verifyingQR: boolean;
};

export default function ReservationQRScanner({
  scannerOpen,
  scanResult,
  onClose,
  onVerify,
  onScanResult,
  verifyingQR,
}: ReservationQRScannerProps) {
  const onVerifyRef = useRef(onVerify);
  const onScanResultRef = useRef(onScanResult);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onScanResultRef.current = onScanResult;
    onCloseRef.current = onClose;
  }, [onVerify, onScanResult, onClose]);

  useEffect(() => {
    if (!scannerOpen) return;

    let cancelled = false;
    let startPromise: Promise<null> | null = null;

    const scanner = new Html5Qrcode("qr-reader");

    async function initialiseScanner() {
      try {
        const cameras = await Html5Qrcode.getCameras();

        if (cancelled) return;

        if (cameras.length === 0) {
          throw new Error("No camera detected.");
        }

        const camera =
          cameras.find((camera) =>
            /back|rear|environment/i.test(camera.label),
          ) || cameras[0];

        startPromise = scanner.start(
          camera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (cancelled) return;

            if (!/^[a-f0-9]{64}$/i.test(decodedText)) {
              onScanResultRef.current(
                "Invalid QR code. Please scan a SunsetDrop collection QR.",
              );
              return;
            }

            onVerifyRef.current(decodedText);
          },
          () => {},
        );

        await startPromise;
      } catch (error) {
        console.error("Camera initialization error:", error);

        if (!cancelled) {
          onScanResultRef.current(
            "Unable to access the camera. Please check your camera permissions.",
          );
          //onClose();
          onCloseRef.current();
        }
      }
    }

    initialiseScanner();

    return () => {
      cancelled = true;

      async function stopScanner() {
        try {
          if (startPromise) {
            await startPromise.catch(() => null);
          }

          if (scanner.isScanning) {
            await scanner.stop();
          }
        } catch (error) {
          console.error("Camera cleanup error:", error);
        }
      }

      void stopScanner();
    };
  }, [scannerOpen]);

  return (
    <>
      {scannerOpen && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-forest">Scan Customer QR Code</h2>

            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Close Scanner
            </button>
          </div>

          <div id="qr-reader" className="mx-auto w-full max-w-lg" />

          {verifyingQR && (
            <p className="mt-4 text-center text-sm font-medium text-forest">
              Verifying QR code...
            </p>
          )}

          {!verifyingQR && scanResult && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                scanResult === "Collection verified successfully!"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {scanResult}
            </p>
          )}
        </div>
      )}
    </>
  );
}
