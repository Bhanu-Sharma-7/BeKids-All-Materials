import { apiRequest } from './apiClient';
import { Verb, CreateVerbPayload, ImportSummary } from '../types/verb';

export const adminVerbApi = {
  async getAll(search?: string): Promise<{ success: boolean; count: number; data: Verb[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest<{ success: boolean; count: number; data: Verb[] }>(`/admin/verbs${query}`);
  },

  async getById(id: string): Promise<{ success: boolean; data: Verb }> {
    return apiRequest<{ success: boolean; data: Verb }>(`/admin/verbs/${encodeURIComponent(id)}`);
  },

  async create(payload: CreateVerbPayload): Promise<{ success: boolean; message: string; data: Verb }> {
    return apiRequest<{ success: boolean; message: string; data: Verb }>('/admin/verbs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(
    id: string,
    payload: Partial<CreateVerbPayload>
  ): Promise<{ success: boolean; message: string; data: Verb }> {
    return apiRequest<{ success: boolean; message: string; data: Verb }>(
      `/admin/verbs/${encodeURIComponent(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return apiRequest<{ success: boolean; message: string }>(`/admin/verbs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async importJson(verbs: any[]): Promise<{ success: boolean; message: string; summary: ImportSummary }> {
    return apiRequest<{ success: boolean; message: string; summary: ImportSummary }>('/admin/verbs/import', {
      method: 'POST',
      body: JSON.stringify(verbs),
    });
  },
};
