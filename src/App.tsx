import { useState } from 'react';

declare global {
  interface Window {
    Annotate?: {
      init: (options: Record<string, unknown>) => void;
      identify?: (user: Record<string, unknown>) => void;
    };
  }
}

window.Annotate?.init({
  projectKey: import.meta.env.VITE_ANNOTATE_PROJECT_KEY ?? 'external_demo_project_key',
  appVersion: import.meta.env.VITE_APP_VERSION ?? 'external-demo-1.0.0',
  buildSha: import.meta.env.VITE_GIT_SHA ?? 'external-demo-local',
  featureFlags: {
    checkoutV2: true,
    annualBilling: true,
  },
});

window.Annotate?.identify?.({
  id: 'external-buyer-42',
  role: 'buyer',
  plan: 'growth',
});

export function App() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setCheckoutUrl(null);
    const response = await fetch('/api/checkout/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ billing }),
    });

    if (!response.ok) {
      setError('Stripe modal failed to open.');
      return;
    }

    const session = await response.json() as { checkout_url?: string };
    setCheckoutUrl(session.checkout_url ?? '/checkout');
  }

  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">External customer demo</p>
        <h1>Checkout Plans</h1>
        <p className="copy">Select annual billing and continue to checkout.</p>

        <div className="controls" aria-label="Billing controls">
          <button
            data-billing="monthly"
            type="button"
            className={billing === 'monthly' ? 'selected' : ''}
            onClick={() => setBilling('monthly')}
          >
            Monthly billing
          </button>
          <button
            data-billing="annual"
            type="button"
            className={billing === 'annual' ? 'selected' : ''}
            onClick={() => setBilling('annual')}
          >
            Annual billing
          </button>
        </div>

        <button data-plan="annual" type="button" className="primary" onClick={() => { void startCheckout(); }}>
          Continue with annual
        </button>

        {error && <p role="alert" className="error">{error}</p>}
        {checkoutUrl && (
          <section role="dialog" aria-label="Stripe checkout" className="checkout">
            <p>Stripe checkout ready.</p>
            <a href={checkoutUrl}>Open secure checkout</a>
          </section>
        )}
      </section>
    </main>
  );
}

