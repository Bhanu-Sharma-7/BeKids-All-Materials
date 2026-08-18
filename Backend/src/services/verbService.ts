import { verbRepository, VerbWithRelations } from '../repositories/verbRepository';
import { VerbDto } from '../types';

export class VerbService {
  private mapToDto(verb: VerbWithRelations): VerbDto {
    return {
      id: verb.id,
      verb: verb.verb,
      category: verb.category,
      v1: verb.v1,
      v2: verb.v2,
      v3: verb.v3,
      v4: verb.v4,
      v5: verb.v5,
      hindiMeaning: verb.hindiMeaning,
      hindiTransliteration: verb.hindiTransliteration,
      phoneticEnglish: verb.phoneticEnglish,
      explanation: verb.explanation,
      examples: verb.examples?.map((ex) => ({
        id: ex.id,
        sentence: ex.sentence,
        tense: ex.tense,
        formType: ex.formType,
        highlightWord: ex.highlightWord,
        orderIndex: ex.orderIndex,
      })) || [],
      usageRules: verb.usageRules?.map((ur) => ({
        id: ur.id,
        form: ur.form,
        name: ur.name,
        usageContext: ur.usageContext,
        highlighted: ur.highlighted,
        orderIndex: ur.orderIndex,
      })) || [],
    };
  }

  async getAllVerbs(search?: string): Promise<VerbDto[]> {
    const verbs = await verbRepository.findAll(search);
    return verbs.map((v) => this.mapToDto(v));
  }

  async getVerbById(id: string): Promise<VerbDto> {
    const verb = await verbRepository.findById(id.toLowerCase());
    if (!verb) {
      const error = new Error(`Verb '${id}' not found`);
      (error as any).statusCode = 404;
      throw error;
    }
    return this.mapToDto(verb);
  }
}

export const verbService = new VerbService();
