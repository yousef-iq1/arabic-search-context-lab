export const QUERY_IDS = ["ai-tools", "learn-nextjs", "arabic-programming"] as const;
export type QueryId = (typeof QUERY_IDS)[number];

export type QueryPreset = {
  id: QueryId;
  ar: string;
  en: string;
};

export const QUERY_PRESETS: Record<QueryId, QueryPreset> = {
  "ai-tools": {
    id: "ai-tools",
    ar: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",
    en: "Best AI tools for developers",
  },
  "learn-nextjs": {
    id: "learn-nextjs",
    ar: "تعلم Next.js بالعربي",
    en: "Learn Next.js in Arabic",
  },
  "arabic-programming": {
    id: "arabic-programming",
    ar: "أفضل مصادر تعلم البرمجة بالعربي",
    en: "Best Arabic programming learning resources",
  },
};
