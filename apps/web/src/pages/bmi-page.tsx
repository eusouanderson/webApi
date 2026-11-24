import React from 'react';
import { PageHeader, Card, ErrorMessage } from '../components/ui/index.js';
import { BmiForm } from '../modules/bmi/components/bmi-form/bmi-form.js';
import { BmiResult } from '../modules/bmi/components/bmi-result/bmi-result.js';
import { useBmiCalculator } from '../modules/bmi/hooks/use-bmi-calculator.js';

export const BmiPage: React.FC = () => {
  const { data, isLoading, error, calculate, reset } = useBmiCalculator();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Calculadora de Índice de Massa Corporal"
        subtitle="Informe seu peso e altura para obter o diagnóstico e a classificação médica calculados de forma segura pelo backend."
      />

      {/* Card do Formulário */}
      <Card className="shadow-sm border-slate-200">
        <h2 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Dados do Paciente / Usuário
        </h2>

        <BmiForm
          onSubmit={async (input) => {
            await calculate(input);
          }}
          onReset={reset}
          isLoading={isLoading}
        />
      </Card>

      {/* Mensagem de Erro da API ou Conexão */}
      {error && (
        <ErrorMessage
          title="Não foi possível calcular o IMC"
          message={error.message}
          details={error.details}
        />
      )}

      {/* Card de Apresentação de Resultados */}
      {data && <BmiResult result={data} />}
    </div>
  );
};
