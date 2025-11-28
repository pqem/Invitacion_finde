export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface EventDetails {
  id: string;
  title: string;
  subtitle?: string;
  dateIso: string;
  locationName: string;
  locationMapUrl: string;
  guests?: string[];
  description?: string;
}

export interface AppConfig {
  whatsappNumber: string;
  whatsappMessage: string;
  events: EventDetails[];
}
