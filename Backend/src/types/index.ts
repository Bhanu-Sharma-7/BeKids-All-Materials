import { Request } from 'express';

export type UserStatus = 'ACTIVE' | 'DEACTIVATED';
export type VerbCategory = 'Regular' | 'Irregular';
export type FormType = 'V1' | 'V2' | 'V3' | 'V4' | 'V5';

export interface SafeUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  status: string;
  createdAt: Date;
}

export interface AuthTokenPayload {
  userId: string;
  username: string;
  email: string;
  role?: 'ADMIN' | 'USER';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN';
}

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
  admin?: AdminUser;
}

export interface VerbExampleDto {
  id: string;
  sentence: string;
  tense: string;
  formType: string;
  highlightWord: string;
  orderIndex: number;
}

export interface VerbUsageRuleDto {
  id: string;
  form: string;
  name: string;
  usageContext: string;
  highlighted: boolean;
  orderIndex: number;
}

export interface VerbDto {
  id: string;
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
  examples?: VerbExampleDto[];
  usageRules?: VerbUsageRuleDto[];
}
