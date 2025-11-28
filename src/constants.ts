import { AppConfig } from './types';



export const APP_CONFIG: AppConfig = {
  whatsappNumber: "5492995046674",
  whatsappMessage: "¡Hola! Quiero confirmar mi asistencia a los eventos del fin de semana.",
  events: [
    {
      id: "event-1",
      title: "24HS CASA DE ORACIÓN",
      description: "24 horas de clamor e intercesión",
      dateIso: "2025-11-28T19:00:00-03:00",
      locationName: "Av. San Martin 440, Plottier",
      locationMapUrl: "https://www.google.com/maps/search/?api=1&query=Av+San+Martin+440+Plottier+Neuquen",
      image: "slide1.jpg"
    },
    {
      id: "event-2",
      title: "GRAN IMPACTO EVANGELÍSTICO",
      subtitle: "Culto Unido Juvenil",
      dateIso: "2025-11-29T17:00:00-03:00",
      locationName: "Plaza San Martín, Plottier",
      locationMapUrl: "https://www.google.com/maps/search/?api=1&query=Plaza+San+Martin+Plottier+Neuquen",
      guests: ["Maxi y Daniela Gianfelici"],
      image: "slide2.jpg"
    },
    {
      id: "event-3",
      title: "EL CIELO EN LA TIERRA",
      subtitle: "Fiesta de Salvación & Milagros",
      description: "Fiesta de Salvación & Milagros",
      dateIso: "2025-11-30T20:00:00-03:00",
      locationName: "Av. San Martin 440, Plottier",
      locationMapUrl: "https://www.google.com/maps/search/?api=1&query=Av+San+Martin+440+Plottier+Neuquen",
      guests: ["Maxi y Daniela Gianfelici"],
      image: "slide3.jpg"
    }
  ]
};
