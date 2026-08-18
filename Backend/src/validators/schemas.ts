import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  fullName: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string({ required_error: 'Username is required' }).min(1, 'Username is required'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export const verifyOtpSchema = z.object({
  target: z.string({ required_error: 'Target (username or email) is required' }).min(1),
  code: z
    .string({ required_error: 'OTP code is required' })
    .length(6, 'OTP code must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must only contain numbers'),
  flow: z.enum(['login', 'register'], { required_error: 'Flow must be either login or register' }),
});

export const resendOtpSchema = z.object({
  target: z.string({ required_error: 'Target (username or email) is required' }).min(1),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  fullName: z.string().max(60).optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100)
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const verbExampleSchema = z.object({
  sentence: z.string().min(1, 'Example sentence is required'),
  tense: z.string().min(1, 'Tense label is required'),
  formType: z.string().min(1, 'Form type is required'), // "V1" | "V2" | "V3" | "V4" | "V5"
  highlightWord: z.string().min(1, 'Highlight word is required'),
  orderIndex: z.number().optional(),
});

export const verbUsageRuleSchema = z.object({
  form: z.string().min(1, 'Rule form is required'),
  name: z.string().min(1, 'Rule name is required'),
  usageContext: z.string().min(1, 'Usage context is required'),
  highlighted: z.boolean().optional(),
  orderIndex: z.number().optional(),
});

export const createVerbSchema = z.object({
  id: z.string().optional(),
  verb: z.string().min(1, 'Verb name is required'),
  category: z.string().min(1, 'Category is required'),
  v1: z.string().min(1, 'V1 form is required'),
  v2: z.string().min(1, 'V2 form is required'),
  v3: z.string().min(1, 'V3 form is required'),
  v4: z.string().min(1, 'V4 form is required'),
  v5: z.string().min(1, 'V5 form is required'),
  hindiMeaning: z.string().min(1, 'Hindi meaning is required'),
  hindiTransliteration: z.string().min(1, 'Hindi transliteration is required'),
  phoneticEnglish: z.string().min(1, 'Phonetic English is required'),
  explanation: z.string().min(1, 'Explanation is required'),
  examples: z.array(verbExampleSchema).optional(),
  usageRules: z.array(verbUsageRuleSchema).optional(),
});

export const updateVerbSchema = z.object({
  verb: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  v1: z.string().min(1).optional(),
  v2: z.string().min(1).optional(),
  v3: z.string().min(1).optional(),
  v4: z.string().min(1).optional(),
  v5: z.string().min(1).optional(),
  hindiMeaning: z.string().min(1).optional(),
  hindiTransliteration: z.string().min(1).optional(),
  phoneticEnglish: z.string().min(1).optional(),
  explanation: z.string().min(1).optional(),
  examples: z.array(verbExampleSchema).optional(),
  usageRules: z.array(verbUsageRuleSchema).optional(),
});

export const importVerbsSchema = z.object({
  verbs: z.array(createVerbSchema).min(1, 'At least one verb is required for import'),
});
