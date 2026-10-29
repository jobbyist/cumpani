import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Shield, Lock, BadgeCheck } from 'lucide-react';

const values = [
  { icon: BadgeCheck, title: 'Verified', text: 'Every companion completes identity and age verification before appearing on the platform.' },
  { icon: Shield, title: 'Safety first', text: 'Reporting tools, moderation and clear community rules, with abuse and trafficking reported to the authorities.' },
  { icon: Lock, title: 'Private by design', text: 'We handle your information in line with POPIA and never sell it.' },
];

const About = () => (
  <PageShell>
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-bold mb-3">About Cumpani</h1>
        <p className="text-lg text-muted-foreground">
          Cumpani is a members-only social and dating platform for verified adults (21+) across South Africa.
          Members and companions connect through profiles, private messaging, a community feed and exclusive content.
        </p>
      </header>

      <section className="grid gap-6 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-border bg-card p-6">
            <Icon className="h-6 w-6 text-primary mb-3" aria-hidden="true" />
            <h2 className="font-semibold mb-1">{title}</h2>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">What we are not</h2>
        <p className="text-muted-foreground">
          Cumpani is not an escort agency or sex-work service. We do not arrange or take payment for sexual
          services, and we prohibit anyone from soliciting or offering them. The platform includes adult content,
          which is restricted to verified members aged 21 and over.
        </p>
      </section>

      <Disclaimer />
    </div>
  </PageShell>
);

export default About;
