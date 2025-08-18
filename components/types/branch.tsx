export interface Branch {
  id: string;
  merchant: string;
  packageIds: string;
  name: string;
  description: string;
  acceptKid: boolean;
  city: string;
  district: string;
  address: string;
  googleMap: string;
  cuisineTypeIds: string[];
  diningStyleIds: string[];
  phone: Phone;
  servicesOffer:'dine-in',
  openingHourShort: OpeningHours;
  openingHourWeekDays: OpeningHourWeekDays;
}

interface OpeningHours {
  start: string;
  end: string;
}

interface TimeRange {
  start: string;
  end: string;
  isAvailable: boolean;
  totalBooks: number;
}

interface DaySchedule {
  timeRanges: TimeRange[];
  isAvailable: boolean;
}

interface OpeningHourWeekDays {
  mon: DaySchedule;
  tue: DaySchedule;
  wed: DaySchedule;
  thu: DaySchedule;
  fri: DaySchedule;
  sat: DaySchedule;
  sun: DaySchedule;
}

interface Phone {
  phoneCode: string;
  phoneNumber: string;
}
