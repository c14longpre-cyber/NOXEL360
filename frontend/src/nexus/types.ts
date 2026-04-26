export type NexusLanguage = {
  code: string;
  label: string;
};

export type NexusCountry = {
  code: string;
  name: string;
  languages: string[];
  defaultLanguage: string;
};

export type NexusMapping = Record<
  string,
  {
    languages: string[];
    priority: string[];
  }
>;
