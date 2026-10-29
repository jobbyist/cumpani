import { Link, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import PageShell from '@/components/PageShell';
import Disclaimer from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFxRate } from '@/hooks/useFxRate';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const PRICE_ZAR = 99;
const perks = [
  'Browse verified companion profiles across South Africa',
  'Join the community feed',
  'Message members and companions (credits unlock messaging)',
  'Access exclusive content with credits',
  'Cancel any time',
];

const Membership = () => {
  const { isAuthenticated, isSubscribed, isVerified, user, refresh } = useAuth();
  const { data: fx } = useFxRate();
  const { toast } = useToast();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const planId = import.meta.env.VITE_PAYPAL_PLAN_ID;
  const usdApprox = fx ? (PRICE_ZAR / fx.zarPerUsd).toFixed(2) : null;

  return (
    <PageShell narrow>
      <div className="text-center mb-8 space-y-3">
        <h1 className="text-4xl font-bold">Cumpani membership</h1>
        <p className="text-lg text-muted-foreground">Full access to the platform for one simple monthly price.</p>
      </div>

      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl">R{PRICE_ZAR}<span className="text-lg font-normal text-muted-foreground"> / month</span></CardTitle>
          <CardDescription>
            Billed monthly through PayPal in US dollars at the live exchange rate
            {usdApprox && <> (currently about US${usdApprox})</>}. Renews automatically until you cancel.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-2">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />{p}
              </li>
            ))}
          </ul>

          {isSubscribed ? (
            <p className="text-center font-medium text-primary">Your membership is active.</p>
          ) : !isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Button asChild size="lg"><Link to="/signup">Sign up to subscribe</Link></Button>
              <Button asChild variant="outline"><Link to="/login">I already have an account</Link></Button>
            </div>
          ) : !isVerified ? (
            <Button size="lg" className="w-full" onClick={() => navigate('/verify')}>Complete verification to subscribe</Button>
          ) : !clientId || !planId ? (
            <p className="text-center text-sm text-muted-foreground">Payments are not configured yet.</p>
          ) : (
            <PayPalScriptProvider options={{ clientId, vault: true, intent: 'subscription' }}>
              <PayPalButtons
                style={{ layout: 'vertical', label: 'subscribe' }}
                createSubscription={(_d, actions) =>
                  actions.subscription.create({ plan_id: planId, custom_id: user?.id })}
                onApprove={async (data) => {
                  const { error } = await supabase.functions.invoke('paypal-activate-subscription', {
                    body: { subscriptionId: data.subscriptionID },
                  });
                  if (error) {
                    toast({ title: 'Could not activate', description: 'Payment received but activation failed. Contact support.', variant: 'destructive' });
                    return;
                  }
                  await refresh();
                  toast({ title: 'Welcome to Cumpani', description: 'Your membership is active.' });
                  navigate('/companions');
                }}
                onError={() => toast({ title: 'Payment error', description: 'PayPal could not complete the payment.', variant: 'destructive' })}
              />
            </PayPalScriptProvider>
          )}
          <p className="text-xs text-muted-foreground text-center">
            By subscribing you accept the <Link to="/terms" className="underline">Terms</Link> and{' '}
            <Link to="/refunds" className="underline">Refunds &amp; Cancellations</Link> policy.
          </p>
        </CardContent>
      </Card>
      <Disclaimer />
    </PageShell>
  );
};

export default Membership;
