import { Request, Response } from 'express';
import { adminVerbService } from '../services/adminVerbService';

export class AdminVerbController {
  async getAll(req: Request, res: Response): Promise<void> {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const verbs = await adminVerbService.getAllVerbs(search);

    res.status(200).json({
      success: true,
      count: verbs.length,
      data: verbs,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const verb = await adminVerbService.getVerbById(id);

    res.status(200).json({
      success: true,
      data: verb,
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    const created = await adminVerbService.createVerb(req.body);

    res.status(201).json({
      success: true,
      message: `Verb '${created.verb}' created successfully`,
      data: created,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const updated = await adminVerbService.updateVerb(id, req.body);

    res.status(200).json({
      success: true,
      message: `Verb '${updated.verb}' updated successfully`,
      data: updated,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    await adminVerbService.deleteVerb(id);

    res.status(200).json({
      success: true,
      message: `Verb '${id}' deleted successfully`,
    });
  }

  async importJson(req: Request, res: Response): Promise<void> {
    const verbs = Array.isArray(req.body) ? req.body : req.body.verbs;

    if (!Array.isArray(verbs) || verbs.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Request body must be an array of verbs or an object with a verbs array',
      });
      return;
    }

    const summary = await adminVerbService.importVerbs(verbs);

    res.status(200).json({
      success: true,
      message: `Import complete: ${summary.created} created, ${summary.skipped} skipped, ${summary.rejected} rejected`,
      summary,
    });
  }
}

export const adminVerbController = new AdminVerbController();
