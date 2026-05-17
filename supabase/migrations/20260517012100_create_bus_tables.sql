-- =============================================
-- Bus Buddy Kerala – Schema + Seed Data
-- =============================================

-- 1. PLACES
CREATE TABLE IF NOT EXISTS public.places (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ml TEXT NOT NULL,
  district TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL
);

-- 2. BUSES
CREATE TABLE IF NOT EXISTS public.buses (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  operator_en TEXT NOT NULL,
  operator_ml TEXT NOT NULL,
  type TEXT NOT NULL,
  route_name_en TEXT NOT NULL,
  route_name_ml TEXT NOT NULL,
  from_en TEXT NOT NULL,
  from_ml TEXT NOT NULL,
  to_en TEXT NOT NULL,
  to_ml TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'on-time',
  eta_minutes INTEGER NOT NULL DEFAULT 0,
  seats_available INTEGER NOT NULL DEFAULT 0,
  total_seats INTEGER NOT NULL DEFAULT 48,
  fare NUMERIC NOT NULL DEFAULT 0,
  frequency_mins INTEGER NOT NULL DEFAULT 30,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  duration_mins INTEGER NOT NULL DEFAULT 0,
  path JSONB NOT NULL DEFAULT '[]',
  stop_list JSONB NOT NULL DEFAULT '[]',
  progress DOUBLE PRECISION NOT NULL DEFAULT 0,
  speed DOUBLE PRECISION NOT NULL DEFAULT 0.001
);

-- 3. STOPS
CREATE TABLE IF NOT EXISTS public.stops (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ml TEXT NOT NULL,
  district TEXT NOT NULL,
  distance_meters INTEGER NOT NULL DEFAULT 0,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  routes TEXT[] NOT NULL DEFAULT '{}'
);

-- 4. CONDUCTORS
CREATE TABLE IF NOT EXISTS public.conductors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  bus_id TEXT REFERENCES public.buses(id) ON DELETE SET NULL,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
);

-- 5. TICKETS
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  bus_id TEXT NOT NULL,
  bus_number TEXT NOT NULL,
  route_name TEXT NOT NULL,
  operator TEXT NOT NULL,
  bus_type TEXT NOT NULL,
  from_stop TEXT NOT NULL,
  to_stop TEXT NOT NULL,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  date TEXT NOT NULL,
  seat_count INTEGER NOT NULL DEFAULT 1,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  passenger_email TEXT,
  passenger_age TEXT,
  passenger_gender TEXT,
  boarding_point TEXT,
  fare NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'active',
  booked_at BIGINT NOT NULL,
  completed_at BIGINT,
  pnr TEXT NOT NULL UNIQUE
);

-- 6. SCHEDULES
CREATE TABLE IF NOT EXISTS public.schedules (
  id TEXT PRIMARY KEY,
  bus_id TEXT NOT NULL,
  date TEXT NOT NULL,
  departure TEXT NOT NULL,
  notes TEXT
);

-- 7. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
  read BOOLEAN NOT NULL DEFAULT FALSE
);
