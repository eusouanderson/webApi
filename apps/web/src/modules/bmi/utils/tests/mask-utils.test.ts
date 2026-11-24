import { describe, it, expect } from 'vitest';
import { maskWeight, maskHeight, unmaskNumber } from '../mask-utils.js';

describe('mask-utils — Máscaras de entrada numérica', () => {
  describe('maskWeight', () => {
    it('deve retornar string vazia para entrada vazia', () => {
      expect(maskWeight('')).toBe('');
    });

    it('deve formatar inteiros de até 3 dígitos', () => {
      expect(maskWeight('8')).toBe('8');
      expect(maskWeight('80')).toBe('80');
      expect(maskWeight('120')).toBe('120');
      expect(maskWeight('1234')).toBe('123'); // limita em 3 dígitos
    });

    it('deve aceitar vírgula e limitar decimais em 2 dígitos', () => {
      expect(maskWeight('80,')).toBe('80,');
      expect(maskWeight('80,5')).toBe('80,5');
      expect(maskWeight('80,55')).toBe('80,55');
      expect(maskWeight('80,555')).toBe('80,55'); // descarta além de 2 decimais
    });

    it('deve converter ponto para vírgula automaticamente', () => {
      expect(maskWeight('75.')).toBe('75,');
      expect(maskWeight('75.5')).toBe('75,5');
      expect(maskWeight('100.25')).toBe('100,25');
    });

    it('deve ignorar caracteres não numéricos', () => {
      expect(maskWeight('abc80,5kg')).toBe('80,5');
    });
  });

  describe('maskHeight', () => {
    it('deve retornar string vazia para entrada vazia', () => {
      expect(maskHeight('')).toBe('');
    });

    it('deve formatar dígito único', () => {
      expect(maskHeight('1')).toBe('1');
      expect(maskHeight('1,')).toBe('1,');
      expect(maskHeight('1.')).toBe('1,');
    });

    it('deve formatar 2 dígitos com vírgula', () => {
      expect(maskHeight('17')).toBe('1,7');
      expect(maskHeight('1,7')).toBe('1,7');
      expect(maskHeight('1.7')).toBe('1,7');
    });

    it('deve formatar 3 dígitos como X,XX (ex: 175 -> 1,75)', () => {
      expect(maskHeight('175')).toBe('1,75');
      expect(maskHeight('1,75')).toBe('1,75');
      expect(maskHeight('1.75')).toBe('1,75');
      expect(maskHeight('200')).toBe('2,00');
      expect(maskHeight('085')).toBe('0,85');
    });

    it('deve ignorar caracteres não numéricos', () => {
      expect(maskHeight('1.75m')).toBe('1,75');
      expect(maskHeight('alt: 180')).toBe('1,80');
    });
  });

  describe('unmaskNumber', () => {
    it('deve converter valores mascarados para número float de ponto flutuante', () => {
      expect(unmaskNumber('80')).toBe(80);
      expect(unmaskNumber('80,5')).toBe(80.5);
      expect(unmaskNumber('1,75')).toBe(1.75);
      expect(unmaskNumber(1.75)).toBe(1.75);
    });

    it('deve retornar undefined para valores vazios ou inválidos', () => {
      expect(unmaskNumber('')).toBeUndefined();
      expect(unmaskNumber(null)).toBeUndefined();
      expect(unmaskNumber(undefined)).toBeUndefined();
      expect(unmaskNumber('abc')).toBeUndefined();
    });
  });
});
