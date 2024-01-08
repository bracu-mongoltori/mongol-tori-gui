import "./App.css";
import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  ScaleControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Draggable from "react-draggable";
import markerRed from "./assets/markerRed.png";
import markerBlack from "./assets/markerBlack.png";

function App() {
  const onlineURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const offlineURL = "./maps/{z}/{x}/{y}.png";
  const [isOnline, setIsOnline] = useState(true);

  const latRef = useRef(null);
  const lonRef = useRef(null);
  const [position, setPosition] = useState(null);
  const markerIcon = L.icon({
    iconUrl: markerRed,
    iconSize: [38, 38],
    iconAnchor: [19, 40],
    popupAnchor: [-3, -76],
  });
  const markerIcon2 = L.icon({
    iconUrl: markerBlack,
    iconSize: [38, 38],
    iconAnchor: [19, 40],
    popupAnchor: [-3, -76],
  });
  function LocationMarker() {
    const markerRef = useRef(null);
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        // map.flyTo(e.latlng, map.getZoom())
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker
        position={position}
        ref={markerRef}
        icon={markerIcon}
        onClick={(e) => {
          e.preventDefault();
          map.flyTo(position, 13);
        }}
      ></Marker>
    );
  }

  function InputMarker() {
    const markerRef2 = useRef(null);
    

    return latRef.current.value === 0 || lonRef.current.value === 0 ? null : (
      <Marker
        position={[latRef.current.value, lonRef.current.value]}
        ref={markerRef2}
        icon={markerIcon2}
      ></Marker>
    );
  }

  return (
    <div>
      <Draggable cancel=".cancel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            setIsOnline(!isOnline);
          }}
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            zIndex: "9999",
            display: "flex",
            flexDirection: "column",

            background: "rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(13.5px)",
            padding: "10px",
          }}
        >
          {/* <label class="switch">
          <input type="checkbox" />
          <span class="slider round"></span>
        </label> */}
          <label for="inputlat">Latitude:</label>
          <input className="cancel" type="text" id="inputlat" name="inputlat" ref={latRef} />
          <label for="inputlon">Longitude:</label>
          <input className="cancel" type="text" id="inputlon" name="inputlon" ref={lonRef} />
          <button className="button cancel">
            <span>Go</span>
          </button>
        </form>
      </Draggable>
      {position && (
        <Draggable>
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              zIndex: "9999",
              display: "flex",
              flexDirection: "column",

              background: "rgba(255, 255, 255, 0.12)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(13.5px)",
              padding: "10px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>Output</div>
            <div>Latitude: {position && position.lat.toFixed(4)}</div>
            <div>Longitude: {position && position.lng.toFixed(4)}</div>
          </div>
        </Draggable>
      )}
      {!navigator.onLine ? (
        <MapContainer
          attributionControl={true}
          center={[23.777176, 90.399452]}
          zoom={13}
          minZoom={6}
          maxZoom={13}
        >
          <TileLayer url={offlineURL} attribution="&#128308; Offline" />
          <LocationMarker />
          <InputMarker />
          <ScaleControl />
        </MapContainer>
      ) : (
        <MapContainer
          center={[23.777176, 90.399452]}
          zoom={13}
          attributionControl={true}
        >
          <TileLayer url={onlineURL} attribution="&#128994; Online" />
          <LocationMarker />
          <InputMarker />
          <ScaleControl />
        </MapContainer>
      )}
    </div>
  );
}

export default App;
