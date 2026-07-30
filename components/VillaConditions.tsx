'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

// Villa Sera sits at Land's End, facing the Arch.
const LAT = 22.8905;
const LNG = -109.9167;
const TZ = 'America/Mazatlan'; // Baja California Sur — UTC-7, no DST

/** Sunset in UTC hours for a given date and coordinates (NOAA approximation). */
function sunsetUtcHours(date: Date, lat: number, lng: number): number | null {
  const D2R = Math.PI / 180;
  const R2D = 180 / Math.PI;
  const zenith = 90.8333;

  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 0);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayOfYear = Math.floor((today - yearStart) / 86_400_000);

  const lngHour = lng / 15;
  const t = dayOfYear + (18 - lngHour) / 24;

  const M = 0.9856 * t - 3.289;
  let L = M + 1.916 * Math.sin(M * D2R) + 0.02 * Math.sin(2 * M * D2R) + 282.634;
  L = ((L % 360) + 360) % 360;

  let RA = R2D * Math.atan(0.91764 * Math.tan(L * D2R));
  RA = ((RA % 360) + 360) % 360;
  RA += Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90;
  RA /= 15;

  const sinDec = 0.39782 * Math.sin(L * D2R);
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH =
    (Math.cos(zenith * D2R) - sinDec * Math.sin(lat * D2R)) /
    (cosDec * Math.cos(lat * D2R));
  if (cosH > 1 || cosH < -1) return null;

  const H = (R2D * Math.acos(cosH)) / 15;
  const T = H + RA - 0.06571 * t - 6.622;

  let ut = (T - lngHour) % 24;
  if (ut < 0) ut += 24;
  return ut;
}

export default function VillaConditions() {
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Rendered only after mount — the clock would not match the server otherwise.
  if (!now) return null;

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: TZ,
    }).format(d);

  const utcHours = sunsetUtcHours(now, LAT, LNG);
  const sunset =
    utcHours === null
      ? null
      : fmt(
          new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              0,
              Math.round(utcHours * 60)
            )
          )
        );

  const labels =
    locale === 'es'
      ? { time: 'Hora local', sunset: 'Atardecer', place: "Land's End · Mar de Cortés" }
      : { time: 'Local time', sunset: 'Sunset', place: "Land's End · Sea of Cortez" };

  const Item = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-baseline gap-2.5">
      <span className="text-[#EFE7DA]/35 text-[9px] tracking-[0.22em] uppercase font-sans">
        {label}
      </span>
      <span className="text-[#EFE7DA]/85 text-xs font-sans tabular-nums">{value}</span>
    </div>
  );

  return (
    // Left-aligned on mobile with room reserved for the floating concierge
    // button; centred once there is width for it.
    <div className="flex flex-wrap items-center justify-start sm:justify-center gap-x-5 sm:gap-x-7 gap-y-2 pr-40 sm:pr-0">
      <Item label={labels.time} value={fmt(now)} />
      <span className="hidden sm:block h-3 w-px bg-[#EFE7DA]/15" />
      {sunset && <Item label={labels.sunset} value={sunset} />}
      <span className="hidden sm:block h-3 w-px bg-[#EFE7DA]/15" />
      <span className="hidden sm:inline text-[#EFE7DA]/35 text-[9px] tracking-[0.22em] uppercase font-sans">
        {labels.place}
      </span>
    </div>
  );
}
