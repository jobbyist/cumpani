import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import PageShell from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useFxRate } from '@/hooks/useFxRate';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const PRESETS = [50, 100, 250, 500];

const Wallet = () => {
  const { user, walletBalance, refresh } = useAuth();
  const { data: fx } = useFxRate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [zar, setZar] = useState(100);
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const { data: txs } = useQuery({
    queryKey: ['wallet-tx', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from('wallet_transactions')
        .select('id, type, credits, reason, zar_cents, created_at')
        .order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });

  const usd = fx ? (zar / fx.zarPerUsd).toFixed(2) : null;

  return (
    <PageShell narrow>
      <h1 className="text-3xl font-bold mb-6">Wallet</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardDescription>Credit balance</CardDescription>
          <CardTitle className="text-4xl">{walletBalance.toLocaleString()} credits</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          1 credit = R1. Credits unlock messaging and exclusive content. They are not money and cannot be used to pay for sexual services.
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Top up</CardTitle>
          <CardDescription>
            Pay in US dollars through PayPal at today's rate{fx && <> (US$1 = R{fx.zarPerUsd.toFixed(2)})</>}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <Button key={p} type="button" variant={zar === p ? 'default' : 'outline'} onClick={() => setZar(p)}>R{p}</Button>
            ))}
          </div>
          <p className="text-sm">
            R{zar} ≈ <strong>{usd ? `US$${usd}` : '...'}</strong>. You receive {zar} credits.
          </p>
          {!clientId ? (
            <p className="text-sm text-muted-foreground">Payments are not configured yet.</p>
          ) : (
            <PayPalScriptProvider options={{ clientId, currency: 'USD', intent: 'capture' }}>
              <PayPalButtons
                key={zar}
                style={{ layout: 'vertical' }}
                forceReRender={[zar]}
                createOrder={async () => {
                  const { data, error } = await supabase.functions.invoke('paypal-create-order', { body: { zar } });
                  if (error || !data?.id) throw new Error('Could not start payment');
                  return data.id as string;
                }}
                onApprove={async (data) => {
                  const { error } = await supabase.functions.invoke('paypal-capture-order', { body: { orderId: data.orderID } });
                  if (error) {
                    toast({ title: 'Top-up failed', description: 'If you were charged, contact support with your PayPal receipt.', variant: 'destructive' });
                    return;
                  }
                  await refresh();
                  qc.invalidateQueries({ queryKey: ['wallet-tx'] });
                  toast({ title: 'Credits added', description: `${zar} credits were added to your wallet.` });
                }}
                onError={() => toast({ title: 'Payment error', description: 'PayPal could not complete the payment.', variant: 'destructive' })}
              />
            </PayPalScriptProvider>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>History</CardTitle></CardHeader>
        <CardContent>
          {!txs?.length ? (
            <p className="text-sm text-muted-foreground">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {txs.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {t.reason ?? t.type}
                    <span className="block text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</span>
                  </span>
                  <span className={t.type === 'spend' ? 'text-destructive' : 'text-emerald-600'}>
                    {t.type === 'spend' ? '-' : '+'}{t.credits}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default Wallet;
