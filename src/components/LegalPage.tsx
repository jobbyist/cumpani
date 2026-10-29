import { ReactNode } from 'react';
import PageShell from '@/components/PageShell';
import { AlertTriangle } from 'lucide-react';

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  updated: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

/** Shared layout for legal documents. All content is a DRAFT until reviewed by a South African attorney. */
const LegalPage = ({ title, updated, intro, sections }: LegalPageProps) => (
  <PageShell narrow>
    <h1 className="text-4xl font-bold mb-2">{title}</h1>
    <p className="text-sm text-muted-foreground mb-6">Last updated: {updated}</p>
    <div className="mb-8 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
      <p>
        <strong>Draft pending legal review.</strong> This document has not yet been reviewed by a South African
        attorney and may change before launch.
      </p>
    </div>
    {intro && <div className="prose dark:prose-invert max-w-none mb-8">{intro}</div>}
    <div className="prose dark:prose-invert max-w-none space-y-8">
      {sections.map((s, i) => (
        <section key={s.heading}>
          <h2>{i + 1}. {s.heading}</h2>
          {s.body}
        </section>
      ))}
    </div>
  </PageShell>
);

export default LegalPage;
