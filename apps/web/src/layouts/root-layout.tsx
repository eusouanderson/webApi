import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Scale, HeartPulse, Github } from 'lucide-react';
import { Container, Badge } from '../components/ui/index.js';

export const RootLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <Container size="lg" className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm">
              <Scale className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight">Cálculo de IMC</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 font-normal">
                Sistema Web Corporativo
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Badge variant="info" className="hidden sm:inline-flex">
              <HeartPulse className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              Atividade Acadêmica
            </Badge>

            <a
              href="https://github.com/eusouanderson/webApi"
              target="_blank"
              rel="noreferrer"
              aria-label="Repositório GitHub"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-8 sm:py-12">
        <Container size="lg">
          <Outlet />
        </Container>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <Container
          size="lg"
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p>
            Desenvolvido com{' '}
            <strong className="font-semibold text-slate-700">TypeScript, Hono, Zod e React</strong>.
          </p>
          <p className="text-slate-400">
            Arquitetura em Monorepo orientada a domínio &bull; Regra de cálculo 100% no backend.
          </p>
        </Container>
      </footer>
    </div>
  );
};
