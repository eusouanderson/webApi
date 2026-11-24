import { describe, it, expect } from 'vitest';
import { createApp } from '../../../app.js';
import type { CalculateBmiSuccessResponse, ApiErrorResponse } from '@repo/contracts';

describe('BmiRoutes — Integration Tests (HTTP)', () => {
  const app = createApp();

  describe('POST /api/v1/bmi — Cenários de Sucesso', () => {
    it('deve retornar status 200 e resultado correto para entrada válida', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 80, height: 1.75 }),
      });

      expect(response.status).toBe(200);

      const json = (await response.json()) as CalculateBmiSuccessResponse;
      expect(json.success).toBe(true);
      expect(json.data).toEqual({
        weight: 80,
        height: 1.75,
        bmi: 26.12,
        classification: 'Sobrepeso',
      });
    });

    it('deve calcular corretamente para indivíduo com classificação Normal', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 68, height: 1.75 }),
      });

      expect(response.status).toBe(200);
      const json = (await response.json()) as CalculateBmiSuccessResponse;
      expect(json.success).toBe(true);
      expect(json.data.classification).toBe('Normal');
      expect(json.data.bmi).toBe(22.2);
    });

    it('deve calcular corretamente para indivíduo com classificação Magreza', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 45, height: 1.7 }),
      });

      expect(response.status).toBe(200);
      const json = (await response.json()) as CalculateBmiSuccessResponse;
      expect(json.success).toBe(true);
      expect(json.data.classification).toBe('Magreza');
    });

    it('deve calcular corretamente para indivíduo com classificação Obesidade', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 110, height: 1.75 }),
      });

      expect(response.status).toBe(200);
      const json = (await response.json()) as CalculateBmiSuccessResponse;
      expect(json.success).toBe(true);
      expect(json.data.classification).toBe('Obesidade');
      expect(json.data.bmi).toBe(35.92);
    });
  });

  describe('POST /api/v1/bmi — Validação e Erros de Entrada (400 Bad Request)', () => {
    it('deve rejeitar quando o peso está ausente', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ height: 1.75 }),
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
      expect(json.error.details.some((d) => d.field === 'weight')).toBe(true);
    });

    it('deve rejeitar quando a altura está ausente', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 80 }),
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
      expect(json.error.details.some((d) => d.field === 'height')).toBe(true);
    });

    it('deve rejeitar peso zero', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 0, height: 1.75 }),
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.details[0]?.message).toBe('O peso deve ser maior que zero.');
    });

    it('deve rejeitar peso negativo', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: -80, height: 1.75 }),
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('deve rejeitar altura zero', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 80, height: 0 }),
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.details[0]?.message).toBe('A altura deve ser maior que zero.');
    });

    it('deve rejeitar altura negativa', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: 80, height: -1.75 }),
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
    });

    it('deve rejeitar tipos inválidos (strings numéricas)', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: '80', height: '1.75' }),
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('deve rejeitar corpo JSON malformado', async () => {
      const response = await app.request('/api/v1/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{ weight: 80, ', // JSON inválido
      });

      expect(response.status).toBe(400);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('BAD_REQUEST');
    });
  });

  describe('Tratamento Centralizado e Endpoints Utilitários', () => {
    it('deve responder 404 padronizado para rota inexistente', async () => {
      const response = await app.request('/api/v1/nao-existe', {
        method: 'GET',
      });

      expect(response.status).toBe(404);
      const json = (await response.json()) as ApiErrorResponse;
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('NOT_FOUND');
    });

    it('deve responder 200 OK no endpoint /health', async () => {
      const response = await app.request('/health', { method: 'GET' });
      expect(response.status).toBe(200);

      const json = (await response.json()) as { status: string; service?: string };
      expect(json.status).toBe('ok');
      expect(json.service).toBe('bmi-api');
    });

    it('deve responder 200 OK no endpoint /api/v1/health', async () => {
      const response = await app.request('/api/v1/health', { method: 'GET' });
      expect(response.status).toBe(200);

      const json = (await response.json()) as { status: string };
      expect(json.status).toBe('ok');
    });
  });
});
