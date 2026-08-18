import { Verb, VerbExample, VerbUsageRule } from '@prisma/client';
import { prisma } from '../config/db';

export type VerbWithRelations = Verb & {
  examples: VerbExample[];
  usageRules: VerbUsageRule[];
};

export interface CreateVerbInput {
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
  examples?: Array<{
    sentence: string;
    tense: string;
    formType: string;
    highlightWord: string;
    orderIndex?: number;
  }>;
  usageRules?: Array<{
    form: string;
    name: string;
    usageContext: string;
    highlighted?: boolean;
    orderIndex?: number;
  }>;
}

export interface UpdateVerbInput {
  verb?: string;
  category?: string;
  v1?: string;
  v2?: string;
  v3?: string;
  v4?: string;
  v5?: string;
  hindiMeaning?: string;
  hindiTransliteration?: string;
  phoneticEnglish?: string;
  explanation?: string;
  examples?: Array<{
    sentence: string;
    tense: string;
    formType: string;
    highlightWord: string;
    orderIndex?: number;
  }>;
  usageRules?: Array<{
    form: string;
    name: string;
    usageContext: string;
    highlighted?: boolean;
    orderIndex?: number;
  }>;
}

export class VerbRepository {
  async findAll(search?: string): Promise<VerbWithRelations[]> {
    if (!search || !search.trim()) {
      return prisma.verb.findMany({
        include: {
          examples: { orderBy: { orderIndex: 'asc' } },
          usageRules: { orderBy: { orderIndex: 'asc' } },
        },
        orderBy: { verb: 'asc' },
      });
    }

    const q = search.trim().toLowerCase();

    // SQLite case-insensitive search via contains
    return prisma.verb.findMany({
      where: {
        OR: [
          { verb: { contains: q } },
          { v1: { contains: q } },
          { v2: { contains: q } },
          { v3: { contains: q } },
          { v4: { contains: q } },
          { v5: { contains: q } },
          { hindiMeaning: { contains: q } },
          { hindiTransliteration: { contains: q } },
        ],
      },
      include: {
        examples: { orderBy: { orderIndex: 'asc' } },
        usageRules: { orderBy: { orderIndex: 'asc' } },
      },
      orderBy: { verb: 'asc' },
    });
  }

  async findById(id: string): Promise<VerbWithRelations | null> {
    return prisma.verb.findFirst({
      where: {
        id: { equals: id },
      },
      include: {
        examples: { orderBy: { orderIndex: 'asc' } },
        usageRules: { orderBy: { orderIndex: 'asc' } },
      },
    });
  }

  async count(): Promise<number> {
    return prisma.verb.count();
  }

  async create(data: CreateVerbInput): Promise<VerbWithRelations> {
    const slugId =
      data.id?.trim().toLowerCase() ||
      data.verb
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');

    return prisma.verb.create({
      data: {
        id: slugId,
        verb: data.verb.trim(),
        category: data.category || 'Regular',
        v1: data.v1.trim(),
        v2: data.v2.trim(),
        v3: data.v3.trim(),
        v4: data.v4.trim(),
        v5: data.v5.trim(),
        hindiMeaning: data.hindiMeaning.trim(),
        hindiTransliteration: data.hindiTransliteration.trim(),
        phoneticEnglish: data.phoneticEnglish.trim(),
        explanation: data.explanation.trim(),
        examples: {
          create: (data.examples || []).map((ex, idx) => ({
            sentence: ex.sentence.trim(),
            tense: ex.tense.trim(),
            formType: ex.formType.trim(),
            highlightWord: ex.highlightWord.trim(),
            orderIndex: ex.orderIndex ?? idx,
          })),
        },
        usageRules: {
          create: (data.usageRules || []).map((rule, idx) => ({
            form: rule.form.trim(),
            name: rule.name.trim(),
            usageContext: rule.usageContext.trim(),
            highlighted: rule.highlighted ?? false,
            orderIndex: rule.orderIndex ?? idx,
          })),
        },
      },
      include: {
        examples: { orderBy: { orderIndex: 'asc' } },
        usageRules: { orderBy: { orderIndex: 'asc' } },
      },
    });
  }

  async update(id: string, data: UpdateVerbInput): Promise<VerbWithRelations> {
    // If examples or usageRules are provided, delete and recreate within transaction
    return prisma.$transaction(async (tx) => {
      if (data.examples !== undefined) {
        await tx.verbExample.deleteMany({ where: { verbId: id } });
      }

      if (data.usageRules !== undefined) {
        await tx.verbUsageRule.deleteMany({ where: { verbId: id } });
      }

      return tx.verb.update({
        where: { id },
        data: {
          ...(data.verb !== undefined ? { verb: data.verb.trim() } : {}),
          ...(data.category !== undefined ? { category: data.category } : {}),
          ...(data.v1 !== undefined ? { v1: data.v1.trim() } : {}),
          ...(data.v2 !== undefined ? { v2: data.v2.trim() } : {}),
          ...(data.v3 !== undefined ? { v3: data.v3.trim() } : {}),
          ...(data.v4 !== undefined ? { v4: data.v4.trim() } : {}),
          ...(data.v5 !== undefined ? { v5: data.v5.trim() } : {}),
          ...(data.hindiMeaning !== undefined ? { hindiMeaning: data.hindiMeaning.trim() } : {}),
          ...(data.hindiTransliteration !== undefined ? { hindiTransliteration: data.hindiTransliteration.trim() } : {}),
          ...(data.phoneticEnglish !== undefined ? { phoneticEnglish: data.phoneticEnglish.trim() } : {}),
          ...(data.explanation !== undefined ? { explanation: data.explanation.trim() } : {}),
          ...(data.examples !== undefined
            ? {
                examples: {
                  create: data.examples.map((ex, idx) => ({
                    sentence: ex.sentence.trim(),
                    tense: ex.tense.trim(),
                    formType: ex.formType.trim(),
                    highlightWord: ex.highlightWord.trim(),
                    orderIndex: ex.orderIndex ?? idx,
                  })),
                },
              }
            : {}),
          ...(data.usageRules !== undefined
            ? {
                usageRules: {
                  create: data.usageRules.map((rule, idx) => ({
                    form: rule.form.trim(),
                    name: rule.name.trim(),
                    usageContext: rule.usageContext.trim(),
                    highlighted: rule.highlighted ?? false,
                    orderIndex: rule.orderIndex ?? idx,
                  })),
                },
              }
            : {}),
        },
        include: {
          examples: { orderBy: { orderIndex: 'asc' } },
          usageRules: { orderBy: { orderIndex: 'asc' } },
        },
      });
    });
  }

  async delete(id: string): Promise<boolean> {
    const existing = await prisma.verb.findUnique({ where: { id } });
    if (!existing) return false;

    await prisma.verb.delete({ where: { id } });
    return true;
  }
}

export const verbRepository = new VerbRepository();
