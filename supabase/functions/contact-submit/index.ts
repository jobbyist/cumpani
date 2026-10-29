import { corsHeaders, json } from '../_shared/paypal.ts';

// Sends contact-form messages to support via Resend.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const { name, email, subject, message } = await req.json();
  if (![name, email, subject, message].every((v) => typeof v === 'string' && v.length > 0 && v.length < 5000)
      || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Invalid submission' }, 400);
  }
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Cumpani Contact <no-reply@cumpani.fun>',
      to: [Deno.env.get('SUPPORT_EMAIL') ?? 'help@cumpani.fun'],
      reply_to: email,
      subject: `[Contact] ${subject.slice(0, 120)}`,
      html: `<p><b>${esc(name)}</b> &lt;${esc(email)}&gt;</p><p>${esc(message).replace(/\n/g, '<br>')}</p>`,
    }),
  });
  return res.ok ? json({ ok: true }) : json({ error: 'Could not send message' }, 502);
});
