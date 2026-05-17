import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ml";

const dict = {
  en: {
    appName: "Where is My Bus",
    tagline: "Live tracking for Kerala public transport",
    searchPlaceholder: "Search Kerala places, routes or bus number",
    from: "From",
    to: "To",
    search: "Search",
    track: "Track Bus",
    book: "Book Ticket",
    nearby: "Nearby Stops",
    routes: "Routes",
    home: "Home",
    tickets: "Tickets",
    profile: "Profile",
    liveBuses: "Live buses across Kerala",
    onTime: "On Time",
    delayed: "Delayed",
    full: "Full",
    seatsAvailable: "Seats",
    standingRoom: "Standing",
    eta: "ETA",
    minutes: "min",
    viewRoute: "View",
    quickActions: "Quick actions",
    popularRoutes: "Popular routes",
    fare: "Fare",
    stops: "stops",
    everyMins: "Every {n} mins",
    findBus: "Find your bus",
    findBusSub: "Search by route, stop, district or bus number",
    nearbyStops: "Nearby stops",
    away: "away",
    walk: "walk",
    bookNow: "Book Now",
    backToBuses: "Back",
    busDetails: "Bus details",
    operator: "Operator",
    type: "Type",
    departure: "Departure",
    arrival: "Arrival",
    duration: "Duration",
    routeStops: "Route stops",
    selectSeats: "Select your seats",
    passenger: "Passenger details",
    fullName: "Full name",
    phone: "Mobile number",
    travelDate: "Travel date",
    payment: "Payment",
    confirmPay: "Confirm & Pay",
    paymentSuccess: "Payment successful!",
    yourPNR: "Your PNR",
    viewTicket: "View Ticket",
    noTickets: "No tickets yet",
    cancelTicket: "Cancel",
    noResults: "No results found",
    seatsSelected: "seat(s) selected",
    seatLegendAvail: "Available",
    seatLegendBooked: "Booked",
    seatLegendSelected: "Selected",
    total: "Total",
    liveTracking: "Live tracking",
  },
  ml: {
    appName: "എന്റെ ബസ് എവിടെ",
    tagline: "കേരള പൊതുഗതാഗതത്തിന്റെ തത്സമയ ട്രാക്കിംഗ്",
    searchPlaceholder: "കേരളത്തിലെ സ്ഥലങ്ങൾ, റൂട്ടുകൾ, ബസ് നമ്പർ തിരയുക",
    from: "എവിടെ നിന്ന്",
    to: "എവിടേക്ക്",
    search: "തിരയുക",
    track: "ട്രാക്ക്",
    book: "ടിക്കറ്റ്",
    nearby: "സമീപം",
    routes: "റൂട്ടുകൾ",
    home: "ഹോം",
    tickets: "ടിക്കറ്റുകൾ",
    profile: "പ്രൊഫൈൽ",
    liveBuses: "കേരളത്തിലെ തത്സമയ ബസുകൾ",
    onTime: "സമയത്ത്",
    delayed: "വൈകി",
    full: "നിറഞ്ഞു",
    seatsAvailable: "സീറ്റുകൾ",
    standingRoom: "നിൽക്കാൻ",
    eta: "എത്തുന്നു",
    minutes: "മിനിറ്റ്",
    viewRoute: "കാണുക",
    quickActions: "ദ്രുത പ്രവർത്തനങ്ങൾ",
    popularRoutes: "ജനപ്രിയ റൂട്ടുകൾ",
    fare: "ചാർജ്",
    stops: "സ്റ്റോപ്പുകൾ",
    everyMins: "ഓരോ {n} മിനിറ്റിലും",
    findBus: "നിങ്ങളുടെ ബസ് കണ്ടെത്തൂ",
    findBusSub: "റൂട്ട്, സ്റ്റോപ്പ്, ജില്ല അല്ലെങ്കിൽ ബസ് നമ്പർ",
    nearbyStops: "സമീപമുള്ള സ്റ്റോപ്പുകൾ",
    away: "അകലെ",
    walk: "നടത്തം",
    bookNow: "ഇപ്പോൾ ബുക്ക് ചെയ്യുക",
    backToBuses: "തിരികെ",
    busDetails: "ബസ് വിവരങ്ങൾ",
    operator: "ഓപ്പറേറ്റർ",
    type: "തരം",
    departure: "പുറപ്പെടൽ",
    arrival: "എത്തിച്ചേരൽ",
    duration: "ദൈർഘ്യം",
    routeStops: "റൂട്ട് സ്റ്റോപ്പുകൾ",
    selectSeats: "സീറ്റുകൾ തിരഞ്ഞെടുക്കുക",
    passenger: "യാത്രക്കാരന്റെ വിവരങ്ങൾ",
    fullName: "പൂർണ്ണനാമം",
    phone: "മൊബൈൽ നമ്പർ",
    travelDate: "യാത്രാ തീയതി",
    payment: "പേയ്മെന്റ്",
    confirmPay: "സ്ഥിരീകരിച്ച് പേയ് ചെയ്യുക",
    paymentSuccess: "പേയ്മെന്റ് വിജയകരം!",
    yourPNR: "നിങ്ങളുടെ PNR",
    viewTicket: "ടിക്കറ്റ് കാണുക",
    noTickets: "ടിക്കറ്റുകൾ ഇല്ല",
    cancelTicket: "റദ്ദാക്കുക",
    noResults: "ഫലങ്ങളൊന്നും ഇല്ല",
    seatsSelected: "സീറ്റുകൾ തിരഞ്ഞെടുത്തു",
    seatLegendAvail: "ലഭ്യം",
    seatLegendBooked: "ബുക്ക് ചെയ്തു",
    seatLegendSelected: "തിരഞ്ഞെടുത്തു",
    total: "ആകെ",
    liveTracking: "തത്സമയ ട്രാക്കിംഗ്",
  },
} as const;

type Key = keyof (typeof dict)["en"];

const I18nCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key, vars?: Record<string, string | number>) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang)) || "en";
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: Key, vars?: Record<string, string | number>) => {
    let s: string = dict[lang][k] ?? dict.en[k] ?? k;
    if (vars) for (const [key, val] of Object.entries(vars)) s = s.replace(`{${key}}`, String(val));
    return s;
  };

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
