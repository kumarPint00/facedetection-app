'use client';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';

const FaceDetectionComponent = () => {
    const [faces, setFaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleDetectFaces = async () => {
        setIsLoading(true);

        try {
            const wasmRoot = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";
            const vision = await FilesetResolver.forVisionTasks(wasmRoot);

            const modelAssetPath = 'models/blaze_face_short_range.tflite';
            const faceDetector = await FaceDetector.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: modelAssetPath,
                    delegate: "GPU"
                },
                runningMode: "IMAGE", 
            });

            const image = document.getElementById("image") as HTMLImageElement;
            const faceDetectorResult = await faceDetector.detect(image);
            setFaces(faceDetectorResult.detections);
        } catch (error) {
            console.error("Error detecting faces:", error);
        }

        setIsLoading(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5">Face Detection</Typography>
            </Grid>
            <Grid item xs={12}>
                <input id="image" type="file" accept="image/*" />
                <Button variant="contained" onClick={handleDetectFaces} disabled={isLoading}>
                    {isLoading ? 'Detecting...' : 'Detect Faces'}
                </Button>
            </Grid>
            <Grid item xs={12}>
                {faces.length > 0 ? (
                    <div>
                        <Typography variant="h6">Detected Faces:</Typography>
                        <ul>
                            {faces.map((face, index) => (
                                <li key={index}>
                                    Face {index + 1}: {JSON.stringify(face)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </Grid>
        </Grid>
    );
};

export default FaceDetectionComponent;
