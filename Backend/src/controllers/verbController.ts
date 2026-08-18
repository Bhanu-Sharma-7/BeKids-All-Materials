import { Request, Response, NextFunction } from 'express';
import { verbService } from '../services/verbService';

export class VerbController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const verbs = await verbService.getAllVerbs(search);
      res.status(200).json({
        success: true,
        count: verbs.length,
        data: verbs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const verb = await verbService.getVerbById(id);
      res.status(200).json({
        success: true,
        data: verb,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const verbController = new VerbController();
