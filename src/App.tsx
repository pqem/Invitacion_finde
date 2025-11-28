import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Countdown } from './components/Countdown';
import {
  MapPinIcon,
  ShareIcon,
  MusicIcon,
  CheckCircleIcon,
  NavigationIcon,
  CalendarIcon
} from './components/Icons';
import { APP_CONFIG } from './constants';

// Helper to format date for display
const getFormattedDate = (dateIso: string) => {
  const date = new Date(dateIso);
  const day = date.getDate();
  const month = date.toLocaleString('es-ES', { month: 'short' });
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

  return `${day} ${monthCapitalized} · ${hours}:${minutes} hs`;
};

// Calendar download function
const downloadICS = (eventDetails: any) => {
  const event = {
    title: eventDetails.title,
    description: eventDetails.subtitle || eventDetails.description,
    location: eventDetails.locationName,
    start: new Date(eventDetails.dateIso),
    end: new Date(new Date(eventDetails.dateIso).getTime() + 3 * 60 * 60 * 1000)
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
  link.download = `evento-${eventDetails.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShareSupported] = useState(typeof navigator !== 'undefined' && !!navigator.share);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % APP_CONFIG.events.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    if (isShareSupported) {
      try {
        await navigator.share({
          title: "Fin de Semana de Gran Impacto",
          text: "Te invito a un fin de semana increíble: Casa de Oración, Gran Impacto y Fiesta de Milagros. ¡No te lo pierdas!",
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
    const defaults = { origin: { y: 0.7 } };
    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) });
    }
    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#3b82f6', '#f97316'] });
    fire(0.2, { spread: 60, colors: ['#ffffff'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#3b82f6', '#f97316'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#ffffff'] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ['#3b82f6', '#f97316'] });
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe Left -> Next
      setCurrentIndex((prev) => (prev + 1) % APP_CONFIG.events.length);
    }
    if (touchStartX.current - touchEndX.current < -50) {
      // Swipe Right -> Prev
      setCurrentIndex((prev) => (prev - 1 + APP_CONFIG.events.length) % APP_CONFIG.events.length);
    }
  };

  const currentEvent = APP_CONFIG.events[currentIndex];

  return (
    <div className="h-[100dvh] bg-[#020617] text-white overflow-hidden flex flex-col relative">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[120px] mix-blend-screen opacity-70"></div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col relative z-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >

        {/* Top Half: Image Slider */}
        <div className="relative h-[55%] w-full bg-slate-900 overflow-hidden">
          {APP_CONFIG.events.map((event, index) => (
            <div
              key={event.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              {/* Blurred Background for fill */}
              <div
                className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
                style={{ backgroundImage: `url(${event.image})` }}
              />
              {/* Main Image */}
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-contain p-0 sm:p-4 drop-shadow-2xl"
              />
              {/* Gradient Overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020617]/50 to-transparent" />
            </div>
          ))}

          {/* Dots Navigation */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {APP_CONFIG.events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Half: Info Area */}
        <div className="flex-1 relative bg-[#020617] px-6 pb-6 pt-2 flex flex-col">

          {/* Animated Content Container */}
          <div className="flex-1 flex flex-col items-center text-center">

            {/* Date Badge */}
            <div className="mb-4 animate-fade-in-up">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/20 text-blue-300 text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                {getFormattedDate(currentEvent.dateIso)}
              </span>
            </div>

            {/* Title */}
            <h1
              onClick={handleImpact}
              className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 leading-tight cursor-pointer active:scale-95 transition-transform"
            >
              {currentEvent.title}
            </h1>

            {/* Subtitle / Description */}
            {(currentEvent.subtitle || currentEvent.description) && (
              <p className="text-orange-400 font-medium text-sm uppercase tracking-wide mb-4">
                {currentEvent.subtitle || currentEvent.description}
              </p>
            )}

            {/* Countdown (Compact) */}
            <div className="mb-6 w-full max-w-xs">
              <Countdown targetDate={currentEvent.dateIso} />
            </div>

            {/* Details Grid */}
            <div className="w-full grid grid-cols-2 gap-3 text-left mb-auto">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 flex items-start gap-2">
                <MapPinIcon />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Ubicación</p>
                  <p className="text-xs text-slate-200 line-clamp-2">{currentEvent.locationName}</p>
                </div>
              </div>

              {currentEvent.guests ? (
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 flex items-start gap-2">
                  <MusicIcon />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Invitados</p>
                    <p className="text-xs text-slate-200 line-clamp-2">{currentEvent.guests.join(" & ")}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 flex items-start gap-2">
                  <CheckCircleIcon />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Entrada</p>
                    <p className="text-xs text-slate-200">Libre y Gratuita</p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Action Buttons (Fixed at bottom of container) */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <button
              onClick={() => downloadICS(currentEvent)}
              className="col-span-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center border border-slate-700 active:scale-95 transition-all"
            >
              <CalendarIcon />
            </button>

            <button
              onClick={handleShare}
              className="col-span-1 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-center border border-slate-700 active:scale-95 transition-all"
            >
              <ShareIcon />
            </button>

            <a
              href={`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(APP_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <CheckCircleIcon />
              <span>Asistiré</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
