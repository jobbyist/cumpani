import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { UserPlus, BadgeCheck, CreditCard, MessageCircle } from 'lucide-react';

const steps = [
  { icon: UserPlus, title: 'Create your account', text: 'Sign up with your email and date of birth. Cumpani is for adults aged 21 and over.' },
  { icon: BadgeCheck, title: 'Get verified', text: 'Confirm your email and complete identity and age verification. Companions are verified before their profile is visible.' },
  { icon: CreditCard, title: 'Activate membership', text: 'Membership is R99 per month through PayPal. Top up credits when you want to unlock extra features.' },
  { icon: MessageCircle, title: 'Connect', text: 'Browse verified profiles across South Africa, message members and companions, and join the community feed.' },
];

const HowItWorks = () => (
  <PageShell>
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-3">How Cumpani works</h1>
      <p className="text-lg text-muted-foreground mb-10">
        A safe, private and verified way to meet new people across South Africa.
      </p>
      <ol className="grid gap-6 sm:grid-cols-2 mb-10">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold">{i + 1}. {title}</h2>
            </div>
            <p className="text-muted-foreground">{text}</p>
          </li>
        ))}
      </ol>

      <section className="mb-10 space-y-3">
        <h2 className="text-2xl font-semibold">What credits are for</h2>
        <p className="text-muted-foreground">
          Credits unlock platform features such as messaging and exclusive content. Companions earn a share of
          credits spent on their content and messages. Credits never pay for, and must never be offered in
          exchange for, sexual services.
        </p>
      </section>

      <Disclaimer className="mb-10" />

      <div className="flex flex-wrap gap-3">
        <Button asChild><Link to="/signup">Create an account</Link></Button>
        <Button asChild variant="outline"><Link to="/membership">See membership</Link></Button>
      </div>
    </div>
  </PageShell>
);

export default HowItWorks;
