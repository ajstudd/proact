"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

// Custom Marker Icon with React Icons
const customMarkerIcon = new L.DivIcon({
    html: ReactDOMServer.renderToString(<FaMapMarkerAlt className="text-red-500 text-3xl animate-bounce" />),
    className: "custom-marker-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            },
        });
        return position ? <Marker position={position} icon={customMarkerIcon} /> : null;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-64 rounded-lg overflow-hidden">
            <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
            </MapContainer>
        </motion.div>
    );
}
