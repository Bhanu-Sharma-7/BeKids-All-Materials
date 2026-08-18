import { verbRepository, VerbWithRelations, CreateVerbInput, UpdateVerbInput } from '../repositories/verbRepository';
import { AppError } from '../middleware/errorHandler';

export interface ImportResult {
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

export class AdminVerbService {
  async getAllVerbs(search?: string): Promise<VerbWithRelations[]> {
    return verbRepository.findAll(search);
  }

  async getVerbById(id: string): Promise<VerbWithRelations> {
    const verb = await verbRepository.findById(id);
    if (!verb) {
      throw new AppError(404, `Verb '${id}' not found`);
    }
    return verb;
  }

  async createVerb(data: CreateVerbInput): Promise<VerbWithRelations> {
    const slugId =
      data.id?.trim().toLowerCase() ||
      data.verb
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');

    const existing = await verbRepository.findById(slugId);
    if (existing) {
      throw new AppError(409, `Verb '${data.verb}' (ID: ${slugId}) already exists`);
    }

    return verbRepository.create({
      ...data,
      id: slugId,
    });
  }

  async updateVerb(id: string, data: UpdateVerbInput): Promise<VerbWithRelations> {
    const existing = await verbRepository.findById(id);
    if (!existing) {
      throw new AppError(404, `Verb '${id}' not found`);
    }

    return verbRepository.update(id, data);
  }

  async deleteVerb(id: string): Promise<void> {
    const success = await verbRepository.delete(id);
    if (!success) {
      throw new AppError(404, `Verb '${id}' not found`);
    }
  }

  async importVerbs(verbsList: any[]): Promise<ImportResult> {
    const result: ImportResult = {
      total: verbsList.length,
      created: 0,
      skipped: 0,
      rejected: 0,
      details: [],
    };

    for (const item of verbsList) {
      const verbName = item.verb || item.id || 'Unknown';

      // Validation
      if (!item.verb || !item.v1 || !item.v2 || !item.v3 || !item.v4 || !item.v5) {
        result.rejected++;
        result.details.push({
          verb: verbName,
          status: 'REJECTED',
          reason: 'Missing mandatory verb conjugations (verb, v1, v2, v3, v4, v5 required)',
        });
        continue;
      }

      if (!item.hindiMeaning || !item.hindiTransliteration) {
        result.rejected++;
        result.details.push({
          verb: verbName,
          status: 'REJECTED',
          reason: 'Hindi meaning and transliteration are required',
        });
        continue;
      }

      const slugId =
        item.id?.toString().trim().toLowerCase() ||
        item.verb
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-');

      // Check duplicate
      const existing = await verbRepository.findById(slugId);
      if (existing) {
        result.skipped++;
        result.details.push({
          verb: item.verb,
          status: 'SKIPPED',
          reason: `Verb with ID '${slugId}' already exists in database`,
        });
        continue;
      }

      try {
        await verbRepository.create({
          id: slugId,
          verb: item.verb.toString().trim(),
          category: item.category || 'Regular',
          v1: item.v1.toString().trim(),
          v2: item.v2.toString().trim(),
          v3: item.v3.toString().trim(),
          v4: item.v4.toString().trim(),
          v5: item.v5.toString().trim(),
          hindiMeaning: item.hindiMeaning.toString().trim(),
          hindiTransliteration: item.hindiTransliteration.toString().trim(),
          phoneticEnglish: (item.phoneticEnglish || `/${item.v1}/`).toString().trim(),
          explanation: (item.explanation || `To perform the action of ${item.verb}.`).toString().trim(),
          examples: Array.isArray(item.examples)
            ? item.examples.map((ex: any, idx: number) => ({
                sentence: ex.sentence || '',
                tense: ex.tense || 'Example',
                formType: ex.formType || 'V1',
                highlightWord: ex.highlightWord || item.verb,
                orderIndex: ex.orderIndex ?? idx,
              }))
            : [],
          usageRules: Array.isArray(item.usageRules)
            ? item.usageRules.map((rule: any, idx: number) => ({
                form: rule.form || item.v1,
                name: rule.name || 'Usage',
                usageContext: rule.usageContext || 'General context',
                highlighted: Boolean(rule.highlighted),
                orderIndex: rule.orderIndex ?? idx,
              }))
            : [],
        });

        result.created++;
        result.details.push({
          verb: item.verb,
          status: 'CREATED',
        });
      } catch (err: any) {
        result.rejected++;
        result.details.push({
          verb: item.verb,
          status: 'REJECTED',
          reason: err.message || 'Database insert failed',
        });
      }
    }

    return result;
  }
}

export const adminVerbService = new AdminVerbService();
