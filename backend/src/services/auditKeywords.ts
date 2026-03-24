export type AuditKeywordsResult = {
  total: number;
  matches: string[];
};

export function auditKeywords(text: string, keywords: string[] | string): AuditKeywordsResult {
  const keywordList = Array.isArray(keywords)
    ? keywords
    : keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

  const lowerText = text.toLowerCase();
  const matches: string[] = [];

  keywordList.forEach((keyword: string) => {
    if (lowerText.includes(keyword.toLowerCase())) {
      matches.push(keyword);
    }
  });

  return {
    total: keywordList.length,
    matches,
  };
}
