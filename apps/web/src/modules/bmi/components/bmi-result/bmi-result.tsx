import React from 'react';
import { Activity, Check, Info } from 'lucide-react';
import { Card, Badge } from '../../../../components/ui/index.js';
import {
  formatBmiValue,
  formatWeight,
  formatHeight,
  getClassificationConfig,
} from '../../utils/format-bmi.js';
import type { BmiResultProps } from './bmi-result.types.js';

export const BmiResult: React.FC<BmiResultProps> = ({ result }) => {
  const config = getClassificationConfig(result.classification);

  const referenceRanges = [
    { label: 'Magreza', range: 'Menor que 18,5', key: 'Magreza' },
    { label: 'Normal', range: 'De 18,5 até 24,9', key: 'Normal' },
    { label: 'Sobrepeso', range: 'Acima de 24,9 até 30,0', key: 'Sobrepeso' },
    { label: 'Obesidade', range: 'Acima de 30,0', key: 'Obesidade' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Card Principal de Destaque */}
      <Card
        className={`border-2 ${config.borderColorClass} ${config.bgColorClass} overflow-hidden`}
        data-testid="bmi-result-card"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resultado Oficial retornado pela API
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                {formatBmiValue(result.bmi)}
              </span>
              <div className="space-y-1">
                <Badge variant={config.badgeVariant} className="text-sm px-3 py-1">
                  {config.label}
                </Badge>
                <p className="text-xs text-slate-500">kg/m²</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg border border-slate-200/80 text-xs text-slate-600">
            <Activity className="w-4 h-4 text-sky-600" aria-hidden="true" />
            <span>Classificação validada no backend</span>
          </div>
        </div>

        {/* Resumo dos parâmetros enviados */}
        <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-2">
          <div className="p-3 bg-white/70 rounded-lg border border-slate-200/60">
            <span className="text-xs text-slate-500 block">Peso informado</span>
            <span className="text-base font-semibold text-slate-800">
              {formatWeight(result.weight)}
            </span>
          </div>

          <div className="p-3 bg-white/70 rounded-lg border border-slate-200/60">
            <span className="text-xs text-slate-500 block">Altura informada</span>
            <span className="text-base font-semibold text-slate-800">
              {formatHeight(result.height)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" aria-hidden="true" />
          <span>{config.description}</span>
        </p>
      </Card>

      {/* Tabela de Referência das Categorias */}
      <Card className="p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Tabela Oficial de Referência do IMC
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-semibold">
                <th className="py-2 px-3">Classificação</th>
                <th className="py-2 px-3">Faixa Numérica</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referenceRanges.map((row) => {
                const isCurrent = result.classification === row.key;
                return (
                  <tr
                    key={row.key}
                    className={`transition-colors ${
                      isCurrent ? 'bg-sky-50/80 font-semibold text-sky-900' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-2.5 px-3">{row.label}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.range}</td>
                    <td className="py-2.5 px-3 text-right">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-sky-700 font-medium text-xs">
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          Sua faixa
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
