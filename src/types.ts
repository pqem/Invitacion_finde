export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface EventConfig {
  title: string;
  subtitle: string;
  dateIso: string;
  locationName: string;
  locationMapUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  guests: string[];
}
