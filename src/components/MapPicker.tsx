"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { toast } from "react-toastify";

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
    const [search, setSearch] = useState<string>("");

    // Ref to hold the map instance
    const mapRef = useRef<any>(null);

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                setPosition(e.latlng);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        return position ? <Marker position={position} icon={customMarkerIcon} /> : null;
    }

    async function handleSearch() {
        if (!search) {
            toast.error("Please enter a location.");
            return;
        }

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
            const data = await res.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                const latLng = { lat: parseFloat(lat), lng: parseFloat(lon) };

                setPosition(latLng);
                onLocationSelect(latLng.lat, latLng.lng);

                if (mapRef.current) {
                    mapRef.current.flyTo(latLng, 13); // Add Zoom Level
                }
            } else {
                toast.error("Location not found!");
            }
        } catch (error) {
            console.error("Search Error:", error);
            toast.error("Something went wrong!");
        }
    }
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            {/* Search Input */}
            <div className="mb-2 flex items-center">
                <input
                    type="text"
                    placeholder="Search Location"
                    className="w-full text-black px-4 py-2 border rounded-md outline-none shadow-sm focus:ring focus:ring-blue-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            {/* Map Container */}
            <div className="rounded-lg overflow-hidden">
                <MapContainer
                    center={[25.286135350000002, 87.13042293057262]}
                    zoom={13}
                    className="w-full h-[400px]"
                    whenReady={() => {
                        mapRef.current = mapRef.current; // Store map instance inside ref
                    }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                </MapContainer>
            </div>
        </motion.div>
    );
}
