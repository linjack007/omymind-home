# Omymind Website

Omymind's bilingual product website, with sections for Focus, Meditation, Sleep, Sounds, plus privacy and terms pages. App Store and Android download buttons remain placeholders until store links are available.

## Requirements

- Node.js `>=22.13.0`
- npm

## Local development

```sh
npm ci
npm run dev
```

Useful checks:

```sh
npm run typecheck
npm run lint
NEXT_PUBLIC_SITE_URL=https://omymind-test.notepidia.com npm run build
```

The static website output is written to `dist/client/`.

## Tencent Cloud test deployment

Build the site first, then run the deployment script with an SSH private-key path:

```sh
DEPLOY_KEY=/path/to/ssh-key bash scripts/deploy-test.sh
```

`DEPLOY_HOST` defaults to `omymind-test.notepidia.com`; `DEPLOY_USER` defaults to `ubuntu`. The script backs up the current static directory and Caddy configuration before switching the test site.
