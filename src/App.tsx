import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Countdown } from './components/Countdown';
import { ImageSlider } from './components/ImageSlider';
import {
  MapPinIcon,
  ShareIcon,
  MusicIcon,
  CheckCircleIcon,
  NavigationIcon
} from './components/Icons';
import { APP_CONFIG, SLIDER_IMAGES } from './constants';

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

// Main App Component
export default function App() {
  const [isShareSupported] = useState(typeof navigator !== 'undefined' && !!navigator.share);

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

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#3b82f6', '#f97316'] });
    fire(0.2, { spread: 60, colors: ['#ffffff'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#3b82f6', '#f97316'] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#ffffff'] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ['#3b82f6', '#f97316'] });
  };

  // Use the first event for the main countdown
  const nextEventDate = APP_CONFIG.events[0].dateIso;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden selection:bg-blue-500 selection:text-white pb-24">
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
          <div className="w-full mb-8">
            <ImageSlider images={SLIDER_IMAGES} />
          </div>

          <button
            onClick={handleImpact}
            className="group relative transition-transform active:scale-95 focus:outline-none"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-lg leading-tight cursor-pointer select-none">
              FIN DE SEMANA
            </h1>
          </button>
          <h2 className="text-lg font-bold text-orange-400 uppercase tracking-wider mb-6">
            Gran Impacto
          </h2>
        </header>

        <Countdown targetDate={nextEventDate} />

        <div className="space-y-6 my-8">
          {APP_CONFIG.events.map((event) => (
            <div key={event.id} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800/60 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-orange-500"></div>

              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wide">
                  {getFormattedDate(event.dateIso)}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
              {event.subtitle && (
                <p className="text-orange-400 font-medium text-sm mb-2 uppercase tracking-wide">{event.subtitle}</p>
              )}
              {event.description && (
                <p className="text-slate-300 text-sm mb-3 italic">{event.description}</p>
              )}

              <div className="space-y-2 mt-4 pt-4 border-t border-slate-800">
                <div className="flex items-start gap-3">
                  <MapPinIcon />
                  <div>
                    <p className="text-sm text-slate-300">{event.locationName}</p>
                    <a
                      href={event.locationMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center mt-0.5"
                    >
                      Ver ubicación <span className="ml-1">→</span>
                    </a>
                  </div>
                </div>

                {event.guests && event.guests.length > 0 && (
                  <div className="flex items-start gap-3">
                    <MusicIcon />
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold mb-0.5">Invitados:</p>
                      <p className="text-sm text-slate-200">{event.guests.join(" & ")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-50 flex justify-center">
          <div className="w-full max-w-md flex gap-3">
            <button
              onClick={handleShare}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg border border-slate-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <ShareIcon />
              <span>Compartir</span>
            </button>

            <a
              href={`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(APP_CONFIG.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2] bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircleIcon />
              <span>Confirmar</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
