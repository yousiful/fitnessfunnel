import { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Sky } from '../components/Sky';
import { startSignIn, verifyCode } from '../lib/api';

export function SignIn({ onSignedIn }: { onSignedIn: (token: string) => void }) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');
  const codeRef = useRef<HTMLInputElement>(null);

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setBusy(true); setError('');
    try {
      const res = await startSignIn(email);
      setDevCode(res.devCode || '');
      setStep('code');
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (err) {
      setError((err as Error).message);
    } finally { setBusy(false); }
  };

  const verify = async (value: string) => {
    setBusy(true); setError('');
    try {
      const res = await verifyCode(email, value);
      onSignedIn(res.token);
    } catch (err) {
      setError((err as Error).message);
      setCode('');
    } finally { setBusy(false); }
  };

  return (
    <main className="min-h-full flex flex-col">
      <Sky progress={step === 'email' ? 0.18 : 0.42} height="44vh">
        <div className="h-full flex flex-col justify-start px-6 pt-[max(28px,env(safe-area-inset-top))] max-w-xl mx-auto w-full">
          <p className="font-semibold tracking-wide" style={{ color: 'var(--muted)' }}>The Internet Health Club</p>
        </div>
      </Sky>

      <section className="flex-1 px-6 pt-8 pb-10 max-w-xl mx-auto w-full">
        {step === 'email' ? (
          <form onSubmit={send} className="rise-in">
            <h1 className="display text-[40px] leading-[1.02] font-extrabold">Your plan, your progress, every morning.</h1>
            <p className="mt-3 text-[18px]" style={{ color: 'var(--muted)' }}>
              Sign in with the email you use with the club. We'll send you a 6-digit code.
            </p>
            <label htmlFor="email" className="block mt-8 mb-2 font-semibold">Email</label>
            <input
              id="email" className="field" type="email" inputMode="email" autoComplete="email" required
              placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p role="alert" className="mt-3 font-semibold" style={{ color: '#FF9C86' }}>{error}</p>}
            <button className="btn btn-sun w-full mt-6" disabled={busy || !email}>{busy ? 'Sending...' : 'Send my code'}</button>
          </form>
        ) : (
          <div className="rise-in">
            <button type="button" onClick={() => { setStep('email'); setError(''); setCode(''); }} className="flex items-center gap-2 font-semibold mb-5" style={{ color: 'var(--muted)' }}>
              <ArrowLeft className="w-5 h-5" aria-hidden="true" /> Use a different email
            </button>
            <h1 className="display text-[36px] leading-[1.05] font-extrabold">Check your email</h1>
            <p className="mt-3 text-[18px]" style={{ color: 'var(--muted)' }}>We sent a code to <span className="font-semibold" style={{ color: 'var(--cream)' }}>{email}</span>.</p>
            {devCode && <p className="mt-2 chip">Test mode code: {devCode}</p>}
            <label htmlFor="code" className="block mt-8 mb-2 font-semibold">6-digit code</label>
            <input
              id="code" ref={codeRef} className="field num text-center text-[30px] tracking-[0.4em]" inputMode="numeric" autoComplete="one-time-code"
              maxLength={6} value={code} disabled={busy}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(v);
                if (v.length === 6) verify(v);
              }}
            />
            {error && <p role="alert" className="mt-3 font-semibold" style={{ color: '#FF9C86' }}>{error}</p>}
            <button type="button" className="btn btn-ghost w-full mt-6" onClick={() => send()} disabled={busy}>Send a new code</button>
          </div>
        )}
      </section>
    </main>
  );
}
