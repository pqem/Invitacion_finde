import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Countdown } from './components/Countdown';
import {
  MapPinIcon,
  CalendarIcon,
  ShareIcon,
  MusicIcon,
  CheckCircleIcon,
  NavigationIcon
} from './components/Icons';
import { EVENT_DETAILS, GOOGLE_CALENDAR_LINK } from './constants';

// Calendar download function
const downloadICS = () => {
  const event = {
    title: EVENT_DETAILS.title,
    description: EVENT_DETAILS.subtitle,
    location: EVENT_DETAILS.locationName,
    start: new Date(EVENT_DETAILS.dateIso),
    end: new Date(new Date(EVENT_DETAILS.dateIso).getTime() + 3 * 60 * 60 * 1000) // Assumes 3 hours duration
  };

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gran Impacto//Event//ES',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.start)}`,
    `DTEND:${formatDate(event.end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gran-impacto-evangelistico.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper to format date for display
const getFormattedDate = (dateIso: string) => {
  const date = new Date(dateIso);
  const day = date.getDate();
  const month = date.toLocaleString('es-ES', { month: 'short' });
  const hours = date.getHours();
  // Capitalize first letter of month
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

  return `Sábado ${day} ${monthCapitalized} · ${hours} hs`;
};

// Main App Component
export default function App() {
  const [isShareSupported] = useState(typeof navigator !== 'undefined' && !!navigator.share);

  const handleShare = async () => {
    if (isShareSupported) {
      try {
        await navigator.share({
          title: EVENT_DETAILS.title,
          text: `${EVENT_DETAILS.title} - ${EVENT_DETAILS.subtitle}. ¡Te espero!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  const handleImpact = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#3b82f6', '#f97316'] // Blue & Orange
    });

    fire(0.2, {
      spread: 60,
      colors: ['#ffffff']
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#3b82f6', '#f97316']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#ffffff']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#3b82f6', '#f97316']
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-blue-500 selection:text-white">
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[120px] mix-blend-screen opacity-70"></div>
        <img
          src="https://images.unsplash.com/photo-1459749411177-3c2ea0432499?q=80&w=1000&auto=format&fit=crop"
          alt="Concert Ambience"
          className="w-full h-full object-cover opacity-20 grayscale mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col p-4 sm:p-6">

        <header className="pt-6 pb-4 text-center flex flex-col items-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-gradient-to-r from-blue-600/20 to-orange-500/20 border border-blue-500/30 backdrop-blur-md">
            <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">
              {getFormattedDate(EVENT_DETAILS.dateIso)}
            </span>
          </div>

          <div className="relative group w-full mb-8 max-w-[360px]">
            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-orange-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-80 transition duration-500 group-hover:duration-300"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900">
              <img
                src="preview.jpg"
                alt="Flyer Gran Impacto Evangelístico - Culto Unido Juvenil"
                className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleImpact}
            className="group relative transition-transform active:scale-95 focus:outline-none"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-lg leading-tight cursor-pointer select-none">
              GRAN IMPACTO
            </h1>
          </button>
          <h2 className="text-lg font-bold text-orange-400 uppercase tracking-wider mb-2">
            Evangelístico
          </h2>
          <p className="text-slate-300 font-medium text-base border-b border-slate-800 pb-6 mx-4">
            {EVENT_DETAILS.subtitle}
          </p>
        </header>

        <Countdown targetDate={EVENT_DETAILS.dateIso} />

        <div className="space-y-4 my-6">

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-colors group">
            <div className="bg-blue-600/20 p-2.5 rounded-full text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
              <MapPinIcon />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Ubicación</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-2">
                {EVENT_DETAILS.locationName}
              </p>
              <a
                href={EVENT_DETAILS.locationMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ver en mapa <span className="ml-1">→</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 flex items-start gap-4 hover:bg-slate-800/50 transition-colors group">
            <div className="bg-orange-600/20 p-2.5 rounded-full text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
              <MusicIcon />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Invitados Especiales</h3>
              <ul className="text-sm text-slate-400 leading-relaxed list-disc list-inside marker:text-orange-500">
                {EVENT_DETAILS.guests.map((guest, idx) => (
                  <li key={idx}>{guest}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-auto space-y-3 pb-8">

          <a
            href={`https://wa.me/${EVENT_DETAILS.whatsappNumber}?text=${encodeURIComponent(EVENT_DETAILS.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircleIcon />
            <span>Confirmar Asistencia</span>
            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={EVENT_DETAILS.locationMapUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl border border-slate-600 transition-all active:scale-[0.98]"
            >
              <NavigationIcon />
              <span className="text-xs">Cómo llegar</span>
            </a>

            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl border border-slate-600 transition-all active:scale-[0.98]"
            >
              <ShareIcon />
              <span className="text-xs">Compartir</span>
            </button>
          </div>

          <div className="flex gap-2">
            <a
              href={GOOGLE_CALENDAR_LINK}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-blue-300 font-medium py-3 rounded-xl border border-blue-500/30 transition-colors text-sm"
            >
              <CalendarIcon />
              Google Calendar
            </a>
            <button
              onClick={downloadICS}
              className="flex-1 flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-slate-300 font-medium py-3 rounded-xl border border-slate-600 transition-colors text-sm"
            >
              <CalendarIcon />
              Apple / Outlook
            </button>
          </div>
        </div>

        <footer className="text-center text-slate-500 text-xs py-4">
          <p>Organiza CCE · Entrada libre y gratuita</p>
        </footer>

      </div>
    </div>
  );
}
