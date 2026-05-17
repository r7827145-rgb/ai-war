export type BusStatus = "on-time" | "delayed" | "full";

export interface Place {
  id: string;
  name: { en: string; ml: string };
  district: string;
  lat: number;
  lng: number;
}

export interface Bus {
  id: string;
  number: string;
  operator: { en: string; ml: string };
  type: "Ordinary" | "Fast Passenger" | "Super Fast" | "AC Low Floor" | "Volvo AC";
  routeName: { en: string; ml: string };
  from: { en: string; ml: string };
  to: { en: string; ml: string };
  status: BusStatus;
  etaMinutes: number;
  seatsAvailable: number;
  totalSeats: number;
  fare: number;
  frequencyMins: number;
  departure: string;
  arrival: string;
  durationMins: number;
  // Polyline path the bus follows (lat,lng pairs across Kerala)
  path: [number, number][];
  // Stop names with progress 0..1 along the path
  stopList: { name: { en: string; ml: string }; progress: number }[];
  // Initial progress along path 0..1 (for live simulation)
  progress: number;
  speed: number; // progress units per tick
}

export interface Stop {
  id: string;
  name: { en: string; ml: string };
  district: string;
  distanceMeters: number;
  lat: number;
  lng: number;
  routes: string[];
}

// Kerala center & bounds
export const KERALA_CENTER: [number, number] = [10.5, 76.3];
export const KOCHI_CENTER: [number, number] = [9.9816, 76.2999];
export const KERALA_BOUNDS: [[number, number], [number, number]] = [
  [8.18, 74.85],
  [12.85, 77.45],
];

// Major Kerala places (used by search)
export const KERALA_PLACES: Place[] = [
  { id: "p_tvm", name: { en: "Thiruvananthapuram", ml: "തിരുവനന്തപുരം" }, district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { id: "p_klm", name: { en: "Kollam", ml: "കൊല്ലം" }, district: "Kollam", lat: 8.8932, lng: 76.6141 },
  { id: "p_ptm", name: { en: "Pathanamthitta", ml: "പത്തനംതിട്ട" }, district: "Pathanamthitta", lat: 9.2648, lng: 76.787 },
  { id: "p_alp", name: { en: "Alappuzha", ml: "ആലപ്പുഴ" }, district: "Alappuzha", lat: 9.4981, lng: 76.3388 },
  { id: "p_ktm", name: { en: "Kottayam", ml: "കോട്ടയം" }, district: "Kottayam", lat: 9.5916, lng: 76.5222 },
  { id: "p_idk", name: { en: "Idukki", ml: "ഇടുക്കി" }, district: "Idukki", lat: 9.85, lng: 76.97 },
  { id: "p_mun", name: { en: "Munnar", ml: "മൂന്നാർ" }, district: "Idukki", lat: 10.0889, lng: 77.0595 },
  { id: "p_ekm", name: { en: "Ernakulam", ml: "എറണാകുളം" }, district: "Ernakulam", lat: 9.9816, lng: 76.2999 },
  { id: "p_alv", name: { en: "Aluva", ml: "ആലുവ" }, district: "Ernakulam", lat: 10.1081, lng: 76.3517 },
  { id: "p_tcr", name: { en: "Thrissur", ml: "തൃശൂർ" }, district: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { id: "p_pkd", name: { en: "Palakkad", ml: "പാലക്കാട്" }, district: "Palakkad", lat: 10.7867, lng: 76.6548 },
  { id: "p_mlp", name: { en: "Malappuram", ml: "മലപ്പുറം" }, district: "Malappuram", lat: 11.0735, lng: 76.0741 },
  { id: "p_ckd", name: { en: "Kozhikode", ml: "കോഴിക്കോട്" }, district: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { id: "p_wyd", name: { en: "Wayanad (Kalpetta)", ml: "വയനാട് (കൽപ്പറ്റ)" }, district: "Wayanad", lat: 11.6094, lng: 76.083 },
  { id: "p_knr", name: { en: "Kannur", ml: "കണ്ണൂർ" }, district: "Kannur", lat: 11.8745, lng: 75.3704 },
  { id: "p_ksd", name: { en: "Kasaragod", ml: "കാസർഗോഡ്" }, district: "Kasaragod", lat: 12.4996, lng: 74.9869 },
  { id: "p_gur", name: { en: "Guruvayur", ml: "ഗുരുവായൂർ" }, district: "Thrissur", lat: 10.5945, lng: 76.0419 },
  { id: "p_sbr", name: { en: "Sabarimala", ml: "ശബരിമല" }, district: "Pathanamthitta", lat: 9.4365, lng: 77.0817 },
  { id: "p_kmy", name: { en: "Kumily / Thekkady", ml: "കുമളി / തേക്കടി" }, district: "Idukki", lat: 9.6, lng: 77.165 },
  { id: "p_var", name: { en: "Varkala", ml: "വർക്കല" }, district: "Thiruvananthapuram", lat: 8.7379, lng: 76.7163 },
  { id: "p_fkc", name: { en: "Fort Kochi", ml: "ഫോർട്ട് കൊച്ചി" }, district: "Ernakulam", lat: 9.9647, lng: 76.2424 },
  { id: "p_vyt", name: { en: "Vyttila", ml: "വൈറ്റില" }, district: "Ernakulam", lat: 9.9678, lng: 76.3186 },
  { id: "p_kkn", name: { en: "Kakkanad", ml: "കാക്കനാട്" }, district: "Ernakulam", lat: 10.0159, lng: 76.34 },
  { id: "p_per", name: { en: "Perinthalmanna", ml: "പെരിന്തൽമണ്ണ" }, district: "Malappuram", lat: 10.9745, lng: 76.2253 },
  { id: "p_ttv", name: { en: "Thalassery", ml: "തലശ്ശേരി" }, district: "Kannur", lat: 11.7484, lng: 75.4929 },
  { id: "p_klp", name: { en: "Kalpetta", ml: "കൽപ്പറ്റ" }, district: "Wayanad", lat: 11.6094, lng: 76.083 },
];

// Helper: build a path between named places via intermediate places
const place = (id: string) => {
  const p = KERALA_PLACES.find((x) => x.id === id)!;
  return [p.lat, p.lng] as [number, number];
};

const stopOf = (id: string, progress: number) => {
  const p = KERALA_PLACES.find((x) => x.id === id)!;
  return { name: p.name, progress };
};

export const MOCK_BUSES: Bus[] = [
  {
    id: "b1",
    number: "KL-15-A-2210",
    operator: { en: "KSRTC Super Fast", ml: "കെ.എസ്.ആർ.ടി.സി സൂപ്പർ ഫാസ്റ്റ്" },
    type: "Super Fast",
    routeName: { en: "Thiruvananthapuram → Ernakulam", ml: "തിരുവനന്തപുരം → എറണാകുളം" },
    from: KERALA_PLACES.find((p) => p.id === "p_tvm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    status: "on-time", etaMinutes: 8, seatsAvailable: 22, totalSeats: 48,
    fare: 245, frequencyMins: 30, departure: "06:00", arrival: "11:30", durationMins: 330,
    path: [place("p_tvm"), place("p_var"), place("p_klm"), place("p_alp"), place("p_ekm")],
    stopList: [stopOf("p_tvm", 0), stopOf("p_var", 0.18), stopOf("p_klm", 0.4), stopOf("p_alp", 0.72), stopOf("p_ekm", 1)],
    progress: 0.32, speed: 0.0015,
  },
  {
    id: "b2",
    number: "KL-07-BR-1180",
    operator: { en: "KURTC Volvo", ml: "കെ.യു.ആർ.ടി.സി വോൾവോ" },
    type: "Volvo AC",
    routeName: { en: "Ernakulam → Bangalore (via Salem)", ml: "എറണാകുളം → ബാംഗ്ലൂർ" },
    from: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_pkd")!.name,
    status: "delayed", etaMinutes: 14, seatsAvailable: 4, totalSeats: 42,
    fare: 380, frequencyMins: 60, departure: "21:00", arrival: "05:30", durationMins: 510,
    path: [place("p_ekm"), place("p_alv"), place("p_tcr"), place("p_pkd")],
    stopList: [stopOf("p_ekm", 0), stopOf("p_alv", 0.12), stopOf("p_tcr", 0.55), stopOf("p_pkd", 1)],
    progress: 0.55, speed: 0.0018,
  },
  {
    id: "b3",
    number: "KL-13-CK-9051",
    operator: { en: "KSRTC Fast Passenger", ml: "കെ.എസ്.ആർ.ടി.സി ഫാസ്റ്റ് പാസഞ്ചർ" },
    type: "Fast Passenger",
    routeName: { en: "Kozhikode → Wayanad", ml: "കോഴിക്കോട് → വയനാട്" },
    from: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_wyd")!.name,
    status: "full", etaMinutes: 3, seatsAvailable: 0, totalSeats: 50,
    fare: 120, frequencyMins: 20, departure: "07:30", arrival: "10:15", durationMins: 165,
    path: [place("p_ckd"), place("p_klp")],
    stopList: [stopOf("p_ckd", 0), stopOf("p_klp", 1)],
    progress: 0.62, speed: 0.0022,
  },
  {
    id: "b4",
    number: "KL-07-DT-4422",
    operator: { en: "KSRTC Ordinary", ml: "കെ.എസ്.ആർ.ടി.സി ഓർഡിനറി" },
    type: "Ordinary",
    routeName: { en: "Kakkanad → Fort Kochi", ml: "കാക്കനാട് → ഫോർട്ട് കൊച്ചി" },
    from: KERALA_PLACES.find((p) => p.id === "p_kkn")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_fkc")!.name,
    status: "on-time", etaMinutes: 6, seatsAvailable: 25, totalSeats: 42,
    fare: 30, frequencyMins: 15, departure: "Every 15 min", arrival: "—", durationMins: 55,
    path: [place("p_kkn"), place("p_vyt"), place("p_ekm"), place("p_fkc")],
    stopList: [stopOf("p_kkn", 0), stopOf("p_vyt", 0.35), stopOf("p_ekm", 0.7), stopOf("p_fkc", 1)],
    progress: 0.45, speed: 0.0035,
  },
  {
    id: "b5",
    number: "KL-09-MN-7711",
    operator: { en: "KSRTC Super Fast", ml: "കെ.എസ്.ആർ.ടി.സി സൂപ്പർ ഫാസ്റ്റ്" },
    type: "Super Fast",
    routeName: { en: "Ernakulam → Munnar", ml: "എറണാകുളം → മൂന്നാർ" },
    from: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_mun")!.name,
    status: "on-time", etaMinutes: 11, seatsAvailable: 18, totalSeats: 48,
    fare: 175, frequencyMins: 90, departure: "08:30", arrival: "13:00", durationMins: 270,
    path: [place("p_ekm"), place("p_alv"), place("p_idk"), place("p_mun")],
    stopList: [stopOf("p_ekm", 0), stopOf("p_alv", 0.1), stopOf("p_idk", 0.65), stopOf("p_mun", 1)],
    progress: 0.28, speed: 0.0012,
  },
  {
    id: "b6",
    number: "KL-13-KK-3344",
    operator: { en: "KSRTC Long Distance", ml: "കെ.എസ്.ആർ.ടി.സി" },
    type: "Super Fast",
    routeName: { en: "Kannur → Thiruvananthapuram", ml: "കണ്ണൂർ → തിരുവനന്തപുരം" },
    from: KERALA_PLACES.find((p) => p.id === "p_knr")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_tvm")!.name,
    status: "on-time", etaMinutes: 26, seatsAvailable: 12, totalSeats: 48,
    fare: 720, frequencyMins: 120, departure: "17:00", arrival: "07:30", durationMins: 870,
    path: [place("p_knr"), place("p_ttv"), place("p_ckd"), place("p_mlp"), place("p_tcr"), place("p_ekm"), place("p_alp"), place("p_klm"), place("p_tvm")],
    stopList: [stopOf("p_knr", 0), stopOf("p_ckd", 0.18), stopOf("p_tcr", 0.42), stopOf("p_ekm", 0.55), stopOf("p_klm", 0.85), stopOf("p_tvm", 1)],
    progress: 0.5, speed: 0.001,
  },
  {
    id: "b7",
    number: "KL-04-SF-9090",
    operator: { en: "KSRTC Sabari", ml: "കെ.എസ്.ആർ.ടി.സി ശബരി" },
    type: "Fast Passenger",
    routeName: { en: "Pathanamthitta → Sabarimala", ml: "പത്തനംതിട്ട → ശബരിമല" },
    from: KERALA_PLACES.find((p) => p.id === "p_ptm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_sbr")!.name,
    status: "delayed", etaMinutes: 18, seatsAvailable: 8, totalSeats: 42,
    fare: 95, frequencyMins: 45, departure: "Every 45 min", arrival: "—", durationMins: 120,
    path: [place("p_ptm"), place("p_sbr")],
    stopList: [stopOf("p_ptm", 0), stopOf("p_sbr", 1)],
    progress: 0.38, speed: 0.0014,
  },
  {
    id: "b8",
    number: "KL-22-GW-1212",
    operator: { en: "KSRTC", ml: "കെ.എസ്.ആർ.ടി.സി" },
    type: "Fast Passenger",
    routeName: { en: "Thrissur → Guruvayur", ml: "തൃശൂർ → ഗുരുവായൂർ" },
    from: KERALA_PLACES.find((p) => p.id === "p_tcr")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_gur")!.name,
    status: "on-time", etaMinutes: 5, seatsAvailable: 30, totalSeats: 48,
    fare: 45, frequencyMins: 10, departure: "Every 10 min", arrival: "—", durationMins: 40,
    path: [place("p_tcr"), place("p_gur")],
    stopList: [stopOf("p_tcr", 0), stopOf("p_gur", 1)],
    progress: 0.6, speed: 0.004,
  },
  {
    id: "b9",
    number: "KL-60-KS-1001",
    operator: { en: "KSRTC", ml: "കെ.എസ്.ആർ.ടി.സി" },
    type: "Super Fast",
    routeName: { en: "Kasaragod → Kozhikode", ml: "കാസർഗോഡ് → കോഴിക്കോട്" },
    from: KERALA_PLACES.find((p) => p.id === "p_ksd")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    status: "on-time", etaMinutes: 9, seatsAvailable: 20, totalSeats: 48,
    fare: 260, frequencyMins: 60, departure: "09:00", arrival: "13:30", durationMins: 270,
    path: [place("p_ksd"), place("p_knr"), place("p_ttv"), place("p_ckd")],
    stopList: [stopOf("p_ksd", 0), stopOf("p_knr", 0.45), stopOf("p_ckd", 1)],
    progress: 0.4, speed: 0.0016,
  },
  {
    id: "b10",
    number: "KL-05-KT-7788",
    operator: { en: "KSRTC", ml: "കെ.എസ്.ആർ.ടി.സി" },
    type: "Fast Passenger",
    routeName: { en: "Kottayam → Kumily (Thekkady)", ml: "കോട്ടയം → കുമളി" },
    from: KERALA_PLACES.find((p) => p.id === "p_ktm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_kmy")!.name,
    status: "on-time", etaMinutes: 12, seatsAvailable: 16, totalSeats: 42,
    fare: 135, frequencyMins: 60, departure: "Every 1 hr", arrival: "—", durationMins: 180,
    path: [place("p_ktm"), place("p_idk"), place("p_kmy")],
    stopList: [stopOf("p_ktm", 0), stopOf("p_idk", 0.55), stopOf("p_kmy", 1)],
    progress: 0.22, speed: 0.0013,
  },
  {
    id: "b11",
    number: "KL-10-PK-5050",
    operator: { en: "KSRTC", ml: "കെ.എസ്.ആർ.ടി.സി" },
    type: "Ordinary",
    routeName: { en: "Palakkad → Perinthalmanna", ml: "പാലക്കാട് → പെരിന്തൽമണ്ണ" },
    from: KERALA_PLACES.find((p) => p.id === "p_pkd")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_per")!.name,
    status: "on-time", etaMinutes: 7, seatsAvailable: 28, totalSeats: 42,
    fare: 75, frequencyMins: 20, departure: "Every 20 min", arrival: "—", durationMins: 90,
    path: [place("p_pkd"), place("p_per")],
    stopList: [stopOf("p_pkd", 0), stopOf("p_per", 1)],
    progress: 0.5, speed: 0.0025,
  },
  {
    id: "b12",
    number: "KL-07-LF-3030",
    operator: { en: "Kochi Metro Feeder", ml: "കൊച്ചി മെട്രോ" },
    type: "AC Low Floor",
    routeName: { en: "Aluva → Tripunithura (Metro Feeder)", ml: "ആലുവ → തൃപ്പൂണിത്തുറ" },
    from: KERALA_PLACES.find((p) => p.id === "p_alv")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_vyt")!.name,
    status: "on-time", etaMinutes: 4, seatsAvailable: 32, totalSeats: 50,
    fare: 25, frequencyMins: 8, departure: "Every 8 min", arrival: "—", durationMins: 60,
    path: [place("p_alv"), place("p_ekm"), place("p_vyt")],
    stopList: [stopOf("p_alv", 0), stopOf("p_ekm", 0.55), stopOf("p_vyt", 1)],
    progress: 0.7, speed: 0.005,
  },
  {
    id: "b13", number: "KL-15-B-8801",
    operator: { en: "KSRTC Super Express", ml: "കെ.എസ്.ആർ.ടി.സി സൂപ്പർ എക്സ്പ്രസ്" },
    type: "Super Fast",
    routeName: { en: "Thiruvananthapuram → Kozhikode", ml: "തിരുവനന്തപുരം → കോഴിക്കോട്" },
    from: KERALA_PLACES.find((p) => p.id === "p_tvm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    status: "on-time", etaMinutes: 15, seatsAvailable: 14, totalSeats: 48,
    fare: 480, frequencyMins: 60, departure: "05:30", arrival: "14:00", durationMins: 510,
    path: [place("p_tvm"), place("p_klm"), place("p_alp"), place("p_ekm"), place("p_tcr"), place("p_mlp"), place("p_ckd")],
    stopList: [stopOf("p_tvm", 0), stopOf("p_klm", 0.15), stopOf("p_alp", 0.35), stopOf("p_ekm", 0.5), stopOf("p_tcr", 0.7), stopOf("p_mlp", 0.85), stopOf("p_ckd", 1)],
    progress: 0.35, speed: 0.0012,
  },
  {
    id: "b14", number: "KL-39-A-5567",
    operator: { en: "KSRTC Garuda Maharaja", ml: "കെ.എസ്.ആർ.ടി.സി ഗരുഡ മഹാരാജ" },
    type: "Volvo AC",
    routeName: { en: "Ernakulam → Thiruvananthapuram", ml: "എറണാകുളം → തിരുവനന്തപുരം" },
    from: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_tvm")!.name,
    status: "on-time", etaMinutes: 5, seatsAvailable: 8, totalSeats: 44,
    fare: 650, frequencyMins: 120, departure: "22:00", arrival: "03:30", durationMins: 330,
    path: [place("p_ekm"), place("p_alp"), place("p_klm"), place("p_tvm")],
    stopList: [stopOf("p_ekm", 0), stopOf("p_alp", 0.3), stopOf("p_klm", 0.65), stopOf("p_tvm", 1)],
    progress: 0.15, speed: 0.0018,
  },
  {
    id: "b15", number: "KL-15-C-3321",
    operator: { en: "KSRTC Minnal", ml: "കെ.എസ്.ആർ.ടി.സി മിന്നൽ" },
    type: "AC Low Floor",
    routeName: { en: "Thiruvananthapuram → Ernakulam (Expressway)", ml: "തിരുവനന്തപുരം → എറണാകുളം (എക്സ്പ്രസ്സ്‌വേ)" },
    from: KERALA_PLACES.find((p) => p.id === "p_tvm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    status: "on-time", etaMinutes: 3, seatsAvailable: 20, totalSeats: 50,
    fare: 350, frequencyMins: 90, departure: "07:00", arrival: "11:00", durationMins: 240,
    path: [place("p_tvm"), place("p_ptm"), place("p_ktm"), place("p_ekm")],
    stopList: [stopOf("p_tvm", 0), stopOf("p_ptm", 0.35), stopOf("p_ktm", 0.65), stopOf("p_ekm", 1)],
    progress: 0.42, speed: 0.0016,
  },
  {
    id: "b16", number: "KL-08-AA-7734",
    operator: { en: "Kallada Travels", ml: "കല്ലട ട്രാവൽസ്" },
    type: "Volvo AC",
    routeName: { en: "Ernakulam → Bangalore", ml: "എറണാകുളം → ബാംഗ്ലൂർ" },
    from: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_pkd")!.name,
    status: "delayed", etaMinutes: 22, seatsAvailable: 6, totalSeats: 42,
    fare: 890, frequencyMins: 0, departure: "21:30", arrival: "06:00", durationMins: 510,
    path: [place("p_ekm"), place("p_alv"), place("p_tcr"), place("p_pkd")],
    stopList: [stopOf("p_ekm", 0), stopOf("p_alv", 0.15), stopOf("p_tcr", 0.5), stopOf("p_pkd", 1)],
    progress: 0.3, speed: 0.001,
  },
  {
    id: "b17", number: "KL-58-D-2290",
    operator: { en: "KSRTC Ordinary", ml: "കെ.എസ്.ആർ.ടി.സി ഓർഡിനറി" },
    type: "Ordinary",
    routeName: { en: "Kannur → Kasaragod", ml: "കണ്ണൂർ → കാസർഗോഡ്" },
    from: KERALA_PLACES.find((p) => p.id === "p_knr")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ksd")!.name,
    status: "on-time", etaMinutes: 10, seatsAvailable: 35, totalSeats: 52,
    fare: 85, frequencyMins: 25, departure: "Every 25 min", arrival: "—", durationMins: 120,
    path: [place("p_knr"), place("p_ksd")],
    stopList: [stopOf("p_knr", 0), stopOf("p_ksd", 1)],
    progress: 0.55, speed: 0.003,
  },
  {
    id: "b18", number: "KL-07-BV-4455",
    operator: { en: "KSRTC Swift", ml: "കെ.എസ്.ആർ.ടി.സി സ്വിഫ്റ്റ്" },
    type: "AC Low Floor",
    routeName: { en: "Ernakulam → Thrissur", ml: "എറണാകുളം → തൃശൂർ" },
    from: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_tcr")!.name,
    status: "on-time", etaMinutes: 7, seatsAvailable: 26, totalSeats: 50,
    fare: 110, frequencyMins: 20, departure: "Every 20 min", arrival: "—", durationMins: 90,
    path: [place("p_ekm"), place("p_alv"), place("p_tcr")],
    stopList: [stopOf("p_ekm", 0), stopOf("p_alv", 0.4), stopOf("p_tcr", 1)],
    progress: 0.65, speed: 0.004,
  },
  {
    id: "b19", number: "KL-13-EF-6677",
    operator: { en: "KSRTC Deluxe", ml: "കെ.എസ്.ആർ.ടി.സി ഡീലക്സ്" },
    type: "Fast Passenger",
    routeName: { en: "Kozhikode → Malappuram", ml: "കോഴിക്കോട് → മലപ്പുറം" },
    from: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_mlp")!.name,
    status: "full", etaMinutes: 2, seatsAvailable: 0, totalSeats: 48,
    fare: 55, frequencyMins: 15, departure: "Every 15 min", arrival: "—", durationMins: 60,
    path: [place("p_ckd"), place("p_mlp")],
    stopList: [stopOf("p_ckd", 0), stopOf("p_mlp", 1)],
    progress: 0.48, speed: 0.005,
  },
  {
    id: "b20", number: "KL-05-GH-1199",
    operator: { en: "KSRTC Super Fast", ml: "കെ.എസ്.ആർ.ടി.സി സൂപ്പർ ഫാസ്റ്റ്" },
    type: "Super Fast",
    routeName: { en: "Kottayam → Ernakulam", ml: "കോട്ടയം → എറണാകുളം" },
    from: KERALA_PLACES.find((p) => p.id === "p_ktm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ekm")!.name,
    status: "on-time", etaMinutes: 9, seatsAvailable: 19, totalSeats: 48,
    fare: 75, frequencyMins: 20, departure: "Every 20 min", arrival: "—", durationMins: 75,
    path: [place("p_ktm"), place("p_vyt"), place("p_ekm")],
    stopList: [stopOf("p_ktm", 0), stopOf("p_vyt", 0.7), stopOf("p_ekm", 1)],
    progress: 0.4, speed: 0.003,
  },
  {
    id: "b21", number: "KL-42-JK-8833",
    operator: { en: "KPN Travels", ml: "കെ.പി.എൻ ട്രാവൽസ്" },
    type: "Volvo AC",
    routeName: { en: "Kozhikode → Chennai", ml: "കോഴിക്കോട് → ചെന്നൈ" },
    from: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_pkd")!.name,
    status: "delayed", etaMinutes: 30, seatsAvailable: 10, totalSeats: 44,
    fare: 1200, frequencyMins: 0, departure: "20:00", arrival: "07:00", durationMins: 660,
    path: [place("p_ckd"), place("p_mlp"), place("p_pkd")],
    stopList: [stopOf("p_ckd", 0), stopOf("p_mlp", 0.4), stopOf("p_pkd", 1)],
    progress: 0.2, speed: 0.0008,
  },
  {
    id: "b22", number: "KL-07-MN-5566",
    operator: { en: "KSRTC Town-to-Town", ml: "കെ.എസ്.ആർ.ടി.സി" },
    type: "Ordinary",
    routeName: { en: "Aluva → Kakkanad", ml: "ആലുവ → കാക്കനാട്" },
    from: KERALA_PLACES.find((p) => p.id === "p_alv")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_kkn")!.name,
    status: "on-time", etaMinutes: 4, seatsAvailable: 30, totalSeats: 42,
    fare: 20, frequencyMins: 10, departure: "Every 10 min", arrival: "—", durationMins: 35,
    path: [place("p_alv"), place("p_ekm"), place("p_kkn")],
    stopList: [stopOf("p_alv", 0), stopOf("p_ekm", 0.55), stopOf("p_kkn", 1)],
    progress: 0.72, speed: 0.006,
  },
  {
    id: "b23", number: "KL-17-PQ-9900",
    operator: { en: "KSRTC Super Fast", ml: "കെ.എസ്.ആർ.ടി.സി സൂപ്പർ ഫാസ്റ്റ്" },
    type: "Super Fast",
    routeName: { en: "Thrissur → Kozhikode", ml: "തൃശൂർ → കോഴിക്കോട്" },
    from: KERALA_PLACES.find((p) => p.id === "p_tcr")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    status: "on-time", etaMinutes: 13, seatsAvailable: 15, totalSeats: 48,
    fare: 180, frequencyMins: 45, departure: "06:30", arrival: "10:00", durationMins: 210,
    path: [place("p_tcr"), place("p_per"), place("p_mlp"), place("p_ckd")],
    stopList: [stopOf("p_tcr", 0), stopOf("p_per", 0.3), stopOf("p_mlp", 0.6), stopOf("p_ckd", 1)],
    progress: 0.45, speed: 0.0015,
  },
  {
    id: "b24", number: "KL-03-RS-4411",
    operator: { en: "KSRTC Fast Passenger", ml: "കെ.എസ്.ആർ.ടി.സി ഫാസ്റ്റ് പാസഞ്ചർ" },
    type: "Fast Passenger",
    routeName: { en: "Kollam → Pathanamthitta", ml: "കൊല്ലം → പത്തനംതിട്ട" },
    from: KERALA_PLACES.find((p) => p.id === "p_klm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ptm")!.name,
    status: "on-time", etaMinutes: 8, seatsAvailable: 22, totalSeats: 42,
    fare: 65, frequencyMins: 30, departure: "Every 30 min", arrival: "—", durationMins: 90,
    path: [place("p_klm"), place("p_ptm")],
    stopList: [stopOf("p_klm", 0), stopOf("p_ptm", 1)],
    progress: 0.6, speed: 0.003,
  },
  {
    id: "b25", number: "KL-63-TU-2200",
    operator: { en: "KSRTC Kannur Depot", ml: "കെ.എസ്.ആർ.ടി.സി കണ്ണൂർ" },
    type: "Fast Passenger",
    routeName: { en: "Kannur → Kozhikode", ml: "കണ്ണൂർ → കോഴിക്കോട്" },
    from: KERALA_PLACES.find((p) => p.id === "p_knr")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    status: "on-time", etaMinutes: 6, seatsAvailable: 18, totalSeats: 48,
    fare: 95, frequencyMins: 20, departure: "Every 20 min", arrival: "—", durationMins: 105,
    path: [place("p_knr"), place("p_ttv"), place("p_ckd")],
    stopList: [stopOf("p_knr", 0), stopOf("p_ttv", 0.35), stopOf("p_ckd", 1)],
    progress: 0.5, speed: 0.003,
  },
  {
    id: "b26", number: "KL-15-VW-7788",
    operator: { en: "KSRTC City Circular", ml: "കെ.എസ്.ആർ.ടി.സി സിറ്റി" },
    type: "Ordinary",
    routeName: { en: "Thiruvananthapuram → Varkala", ml: "തിരുവനന്തപുരം → വർക്കല" },
    from: KERALA_PLACES.find((p) => p.id === "p_tvm")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_var")!.name,
    status: "on-time", etaMinutes: 5, seatsAvailable: 28, totalSeats: 42,
    fare: 35, frequencyMins: 15, departure: "Every 15 min", arrival: "—", durationMins: 50,
    path: [place("p_tvm"), place("p_var")],
    stopList: [stopOf("p_tvm", 0), stopOf("p_var", 1)],
    progress: 0.38, speed: 0.005,
  },
  {
    id: "b27", number: "KL-11-XY-3344",
    operator: { en: "KSRTC Wayanad Special", ml: "കെ.എസ്.ആർ.ടി.സി വയനാട്" },
    type: "Super Fast",
    routeName: { en: "Kozhikode → Wayanad via Thalassery", ml: "കോഴിക്കോട് → വയനാട്" },
    from: KERALA_PLACES.find((p) => p.id === "p_ckd")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_wyd")!.name,
    status: "delayed", etaMinutes: 20, seatsAvailable: 5, totalSeats: 48,
    fare: 140, frequencyMins: 60, departure: "08:00", arrival: "11:30", durationMins: 210,
    path: [place("p_ckd"), place("p_ttv"), place("p_klp")],
    stopList: [stopOf("p_ckd", 0), stopOf("p_ttv", 0.4), stopOf("p_klp", 1)],
    progress: 0.25, speed: 0.0014,
  },
  {
    id: "b28", number: "KL-07-AB-9911",
    operator: { en: "Kochi Water Metro Feeder", ml: "കൊച്ചി വാട്ടർ മെട്രോ ഫീഡർ" },
    type: "AC Low Floor",
    routeName: { en: "Fort Kochi → Vyttila", ml: "ഫോർട്ട് കൊച്ചി → വൈറ്റില" },
    from: KERALA_PLACES.find((p) => p.id === "p_fkc")!.name,
    to: KERALA_PLACES.find((p) => p.id === "p_vyt")!.name,
    status: "on-time", etaMinutes: 3, seatsAvailable: 35, totalSeats: 50,
    fare: 20, frequencyMins: 8, departure: "Every 8 min", arrival: "—", durationMins: 30,
    path: [place("p_fkc"), place("p_ekm"), place("p_vyt")],
    stopList: [stopOf("p_fkc", 0), stopOf("p_ekm", 0.5), stopOf("p_vyt", 1)],
    progress: 0.6, speed: 0.007,
  },
];

// Compute current lat/lng of a bus given progress along its polyline
export function pointOnPath(path: [number, number][], progress: number): [number, number] {
  if (path.length === 0) return [0, 0];
  if (path.length === 1) return path[0];
  // Compute total length via segment fractions
  const segLens: number[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dy = path[i + 1][0] - path[i][0];
    const dx = path[i + 1][1] - path[i][1];
    const d = Math.hypot(dy, dx);
    segLens.push(d);
    total += d;
  }
  const target = Math.max(0, Math.min(1, progress)) * total;
  let acc = 0;
  for (let i = 0; i < segLens.length; i++) {
    if (acc + segLens[i] >= target) {
      const t = (target - acc) / (segLens[i] || 1);
      const lat = path[i][0] + (path[i + 1][0] - path[i][0]) * t;
      const lng = path[i][1] + (path[i + 1][1] - path[i][1]) * t;
      return [lat, lng];
    }
    acc += segLens[i];
  }
  return path[path.length - 1];
}

export const MOCK_STOPS: Stop[] = [
  { id: "s1", name: { en: "MG Road", ml: "എം.ജി റോഡ്" }, district: "Ernakulam", distanceMeters: 220, lat: 9.981, lng: 76.282, routes: ["KL-15-A-2210", "KL-07-DT-4422"] },
  { id: "s2", name: { en: "Marine Drive", ml: "മറൈൻ ഡ്രൈവ്" }, district: "Ernakulam", distanceMeters: 480, lat: 9.9847, lng: 76.2772, routes: ["KL-07-BR-1180"] },
  { id: "s3", name: { en: "Ernakulam South", ml: "എറണാകുളം സൗത്ത്" }, district: "Ernakulam", distanceMeters: 760, lat: 9.9684, lng: 76.292, routes: ["KL-13-CK-9051", "KL-15-A-2210"] },
  { id: "s4", name: { en: "Vyttila Hub", ml: "വൈറ്റില ഹബ്" }, district: "Ernakulam", distanceMeters: 950, lat: 9.9678, lng: 76.3186, routes: ["KL-07-BR-1180", "KL-07-DT-4422"] },
];

export const STATUS_COLOR: Record<BusStatus, string> = {
  "on-time": "#10b981",
  delayed: "#f59e0b",
  full: "#ef4444",
};

export const getBusById = (id: string) => MOCK_BUSES.find((b) => b.id === id);
