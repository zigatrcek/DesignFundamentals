import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    assetsInclude: [
        '**/*.glb',
        '**/*.gltf',
        '**/*.jpg',

        '**/*.png',
        '**/*.svg',
        '**/*.mp4',
        '**/*.webm',
        '**/*.ogg',
        '**/*.mp3',
        '**/*.wav',
        '**/*.flac',
        '**/*.aac',
    ],
});
