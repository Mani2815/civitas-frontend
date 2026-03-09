import { useRef, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Recenter map when position changes externally (e.g. "Detect My Location")
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng], map.getZoom(), { animate: true });
        }
    }, [lat, lng, map]);
    return null;
};

// Draggable marker sub-component
const DraggableMarker = ({ position, onPositionChange }) => {
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const { lat, lng } = marker.getLatLng();
                    onPositionChange(lat, lng);
                }
            },
        }),
        [onPositionChange]
    );

    return (
        <Marker
            draggable
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        />
    );
};

// Click-to-place marker
const ClickHandler = ({ onPositionChange }) => {
    useMapEvents({
        click(e) {
            onPositionChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

/**
 * Interactive Map Component
 *
 * @param {number}   lat              - Latitude of the pin
 * @param {number}   lng              - Longitude of the pin
 * @param {function} onPositionChange - Callback(lat, lng) when pin is moved. If omitted, map is view-only.
 * @param {string}   height           - CSS height (default "350px")
 * @param {string}   className        - Additional CSS classes
 */
const MapEmbed = ({ lat, lng, onPositionChange, height = '350px', className = '' }) => {
    const isInteractive = typeof onPositionChange === 'function';
    const center = lat && lng ? [lat, lng] : [12.9716, 77.5946]; // Default: Bangalore
    const zoom = 15;

    const handlePositionChange = useCallback(
        (newLat, newLng) => {
            if (isInteractive) {
                onPositionChange(newLat, newLng);
            }
        },
        [isInteractive, onPositionChange]
    );

    return (
        <div className={`w-full rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-700 ${className}`}>
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom
                style={{ height, width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap lat={lat} lng={lng} />
                {lat && lng && (
                    isInteractive ? (
                        <DraggableMarker
                            position={[lat, lng]}
                            onPositionChange={handlePositionChange}
                        />
                    ) : (
                        <Marker position={[lat, lng]} />
                    )
                )}
                {isInteractive && <ClickHandler onPositionChange={handlePositionChange} />}
            </MapContainer>
            {isInteractive && (
                <div className="bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400 text-center border-t border-neutral-200 dark:border-neutral-700">
                    📍 Drag the pin or click anywhere on the map to set location
                </div>
            )}
        </div>
    );
};

export default MapEmbed;
