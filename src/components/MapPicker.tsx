"use client";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";

// Fix Marker Icon Bug
L.Icon.Default.prototype.options.iconUrl = "/marker-icon.png"; // Download marker from leaflet and store in public folder
L.Icon.Default.prototype.options.shadowUrl = "/marker-shadow.png";

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    const LocationClickHandler = () => {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-64 rounded-lg overflow-hidden">
            <MapContainer center={[30.3753, 69.3451]} zoom={6} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationClickHandler />
                {position && <Marker position={position} />}
            </MapContainer>
        </motion.div>
    );
}
