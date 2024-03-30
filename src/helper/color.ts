const colorMap = {
  ar: "green",
  en: "blue",
  es: "red",
  fr: "yellow",
  hi: "orange",
  ja: "purple",
  ru: "pink",
  de: "brown",
  it: "gray",
  pt: "black",
  zh: "purple",
  ko: "red",
  nl: "green",
  tr: "yellow",
  حركة: "red",
  مغامرة: "green",
  كوميديا: "green",
  دراما: "brown",
  وثائقي: "orange",
  عائلي: "pink",
  خيال: "green",
  رعب: "red",
  لغز: "purple",
  رومانسية: "red",
  "علمي خيالي": "blue",
  إثارة: "purple",
} as const;

const getOrderStatusColor = (key?: string): string => {
  return colorMap[key as keyof typeof colorMap] || "blue";
};

export { getOrderStatusColor };
