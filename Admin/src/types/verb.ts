export interface VerbExample {
  id?: string;
  sentence: string;
  tense: string;
  formType: string;
  highlightWord: string;
  orderIndex?: number;
}

export interface VerbUsageRule {
  id?: string;
  form: string;
  name: string;
  usageContext: string;
  highlighted?: boolean;
  orderIndex?: number;
}

export interface Verb {
  id: string;
  verb: string;
  category: 'Regular' | 'Irregular' | string;
  v1: string;
  v2: string;
  v3: string;
  v4: string;
  v5: string;
  hindiMeaning: string;
  hindiTransliteration: string;
  phoneticEnglish: string;
  explanation: string;
  createdAt?: string;
  updatedAt?: string;
  examples: VerbExample[];
  usageRules: VerbUsageRule[];
}

export interface CreateVerbPayload {
  id?: string;
  verb: string;
  category: string;
  v1: string;
  v2: string;
  v3: string;
  v4: string;
  v5: string;
  hindiMeaning: string;
  hindiTransliteration: string;
  phoneticEnglish: string;
  explanation: string;
  examples: VerbExample[];
  usageRules: VerbUsageRule[];
}

export interface ImportSummary {
  total: number;
  created: number;
  skipped: number;
  rejected: number;
  details: Array<{
    verb: string;
    status: 'CREATED' | 'SKIPPED' | 'REJECTED';
    reason?: string;
  }>;
}
