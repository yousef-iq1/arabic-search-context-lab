export const MARKET_IDS = ["baghdad", "riyadh", "cairo", "casablanca"] as const;
export type MarketId = (typeof MARKET_IDS)[number];

export type MarketDefinition = {
  id: MarketId;
  labelAr: string;
  labelEn: string;
  countryAr: string;
  countryEn: string;
  location: string;
  gl: string;
  hl: string;
};

export const MARKETS: Record<MarketId, MarketDefinition> = {
  baghdad: {
    id: "baghdad",
    labelAr: "بغداد",
    labelEn: "Baghdad",
    countryAr: "العراق",
    countryEn: "Iraq",
    location: "Baghdad,Baghdad Governorate,Iraq",
    gl: "iq",
    hl: "ar-iq",
  },
  riyadh: {
    id: "riyadh",
    labelAr: "الرياض",
    labelEn: "Riyadh",
    countryAr: "السعودية",
    countryEn: "Saudi Arabia",
    location: "Riyadh,Riyadh Province,Saudi Arabia",
    gl: "sa",
    hl: "ar-sa",
  },
  cairo: {
    id: "cairo",
    labelAr: "القاهرة",
    labelEn: "Cairo",
    countryAr: "مصر",
    countryEn: "Egypt",
    location: "Cairo,Cairo Governorate,Egypt",
    gl: "eg",
    hl: "ar-eg",
  },
  casablanca: {
    id: "casablanca",
    labelAr: "الدار البيضاء",
    labelEn: "Casablanca",
    countryAr: "المغرب",
    countryEn: "Morocco",
    location: "Casablanca,Casablanca-Settat,Morocco",
    gl: "ma",
    hl: "ar-ma",
  },
};
