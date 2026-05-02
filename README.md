# Annotator QA External Demo

This is a separate customer-style repository used to prove Annotator QA can close a bug loop outside the Annotate monorepo.

The main branch intentionally keeps annual checkout broken:

- `POST /api/checkout/session` returns `500`.
- The UI shows `Stripe modal failed to open.`
- `pnpm test:e2e:broken` passes.

The fix branch changes the checkout session path to return `200` and render the Stripe checkout dialog. Annotator QA should verify the same generated regression as `still_failing` before the fix and `fixed` after the fix.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm type-check
pnpm build
pnpm test:e2e:broken
```

After the fix branch:

```bash
pnpm type-check
pnpm build
pnpm test:e2e:fixed
```

