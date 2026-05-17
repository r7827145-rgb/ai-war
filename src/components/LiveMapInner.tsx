import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import {
  KERALA_CENTER,
  KOCHI_CENTER,
  MOCK_BUSES,
  STATUS_COLOR,
  pointOnPath,
  type Bus,
} from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";

const busIcon = (status: Bus["status"]) => {
  const color = STATUS_COLOR[status];
  return L.divIcon({
    className: "",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `<div class="bus-marker" style="position:relative;width:34px;height:34px;border-radius:9999px;background:${color};display:grid;place-items:center;box-shadow:0 4px 12px rgba(0,0,0,0.25);border:2px solid white;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>
    </div>`,
  });
};

function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, bounds]);
  return null;
}

export interface LiveMapInnerProps {
  height?: string;
  focusBusId?: string;
  showRoutes?: boolean;
  fitKerala?: boolean;
}

export function LiveMapInner({
  height = "60vh",
  focusBusId,
  showRoutes = true,
  fitKerala = false,
}: LiveMapInnerProps) {
  const { lang } = useI18n();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(id);
  }, []);

  // Animate buses along their polyline
  const buses = useMemo(() => {
    return MOCK_BUSES.map((b) => {
      const p = (b.progress + b.speed * tick) % 1;
      const [lat, lng] = pointOnPath(b.path, p);
      return { ...b, lat, lng, progress: p };
    });
  }, [tick]);

  const visible = focusBusId ? buses.filter((b) => b.id === focusBusId) : buses;
  const focused = focusBusId ? buses.find((b) => b.id === focusBusId) : null;

  const center: [number, number] = focused
    ? [focused.lat, focused.lng]
    : fitKerala
      ? KERALA_CENTER
      : KOCHI_CENTER;
  const zoom = focused ? 9 : fitKerala ? 8 : 11;

  const bounds: L.LatLngBoundsExpression | null = focused
    ? L.latLngBounds(focused.path.map(([la, ln]) => L.latLng(la, ln)))
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]" style={{ height }}>
      <MapContainer center={center} zoom={zoom} className="size-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bounds && <FitBounds bounds={bounds} />}
        {showRoutes &&
          visible.map((b) => (
            <Polyline
              key={"poly-" + b.id}
              positions={b.path}
              pathOptions={{ color: STATUS_COLOR[b.status], weight: 4, opacity: 0.55 }}
            />
          ))}
        {visible.map((b) => (
          <Marker key={b.id} position={[b.lat, b.lng]} icon={busIcon(b.status)}>
            <Popup>
              <div className={lang === "ml" ? "font-malayalam" : ""} style={{ minWidth: 160 }}>
                <strong>{lang === "ml" ? b.routeName.ml : b.routeName.en}</strong>
                <div style={{ fontSize: 12, color: "#666" }}>{b.number}</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>ETA: {b.etaMinutes} min · ₹{b.fare}</div>
                <Link
                  to="/bus/$busId"
                  params={{ busId: b.id }}
                  style={{ display: "inline-block", marginTop: 6, fontSize: 12, color: "#2563eb", fontWeight: 600 }}
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
