/**
 * Utilitários de máscara e formatação para entradas numéricas (Peso e Altura).
 * Adota convenções brasileiras (vírgula como separador decimal) e inputMode="decimal".
 */

/**
 * Aplica máscara de peso corporal (kg).
 * Aceita até 3 dígitos inteiros e até 2 casas decimais separadas por vírgula.
 * Exemplos de entrada -> saída:
 * - "80" -> "80"
 * - "80." ou "80," -> "80,"
 * - "80.5" -> "80,5"
 * - "120,45" -> "120,45"
 * - "abc80.5" -> "80,5"
 */
export function maskWeight(raw: string): string {
  if (!raw) return '';

  // Substitui ponto por vírgula
  let cleaned = raw.replace(/\./g, ',');

  // Remove caracteres que não sejam dígitos ou vírgula
  cleaned = cleaned.replace(/[^\d,]/g, '');

  // Permite apenas uma vírgula
  const parts = cleaned.split(',');
  const integerPart = parts[0]?.slice(0, 3) ?? '';

  if (parts.length === 1) {
    return integerPart;
  }

  // Se houver vírgula, limita decimais em 2 dígitos
  const decimalPart = parts.slice(1).join('').slice(0, 2);
  return `${integerPart},${decimalPart}`;
}

/**
 * Aplica máscara de altura (metros).
 * Aceita formato X,XX (ex: 1,75 m).
 * Permite digitação contínua (ex: "175" vira "1,75") ou com vírgula/ponto ("1,75" / "1.75").
 * Exemplos:
 * - "1" -> "1"
 * - "1," ou "1." -> "1,"
 * - "17" -> "1,7"
 * - "175" -> "1,75"
 * - "205" -> "2,05"
 * - "085" -> "0,85"
 */
export function maskHeight(raw: string): string {
  if (!raw) return '';

  // Se o usuário digitou vírgula ou ponto explicitamente
  const hasSeparator = raw.includes(',') || raw.includes('.');
  const digitsOnly = raw.replace(/\D/g, '').slice(0, 3);

  if (!digitsOnly) return '';

  // Se tem apenas 1 dígito
  if (digitsOnly.length === 1) {
    return hasSeparator ? `${digitsOnly},` : digitsOnly;
  }

  // Se tem 2 dígitos
  if (digitsOnly.length === 2) {
    return `${digitsOnly[0]},${digitsOnly[1]}`;
  }

  // Se tem 3 dígitos (ex: "175" -> "1,75")
  return `${digitsOnly[0]},${digitsOnly.slice(1, 3)}`;
}

/**
 * Converte a string com máscara (ex: "80,5" ou "1,75") em number para envio à API.
 * Retorna undefined se for string vazia ou inválida.
 */
export function unmaskNumber(masked: string | number | undefined | null): number | undefined {
  if (typeof masked === 'number') {
    return isNaN(masked) ? undefined : masked;
  }

  if (!masked || typeof masked !== 'string') {
    return undefined;
  }

  const normalized = masked.trim().replace(',', '.');
  if (normalized === '') return undefined;

  const parsed = parseFloat(normalized);
  if (isNaN(parsed) || !isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}
