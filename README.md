# Tic Tac Toe

React + TypeScript + Vite. Play two-player or against an unbeatable minimax computer.

## Develop

Requires Node 20 (`nvm use`).

```sh
npm ci
npm run dev           # http://localhost:5173
npm test              # vitest
npm run lint          # eslint
npm run format        # prettier
npm run typecheck
npm run build         # outputs dist/
```

## Deploy to AWS

Static site: private S3 bucket -> CloudFront (Origin Access Control, HTTPS, SPA fallback).
Infrastructure is one CloudFormation template, `infra/site.yaml`; deploys run from GitHub Actions
using OIDC (no long-lived AWS keys).

### One-time setup

1. Make sure the GitHub OIDC provider exists in your AWS account
   (`token.actions.githubusercontent.com`), then create the stack:

   ```sh
   aws cloudformation deploy \
     --stack-name tic-tac-toe \
     --template-file infra/site.yaml \
     --capabilities CAPABILITY_NAMED_IAM \
     --parameter-overrides \
         GitHubRepo=<owner>/<repo> \
         GitHubOidcProviderArn=arn:aws:iam::<account-id>:oidc-provider/token.actions.githubusercontent.com
   aws cloudformation describe-stacks --stack-name tic-tac-toe --query 'Stacks[0].Outputs'
   ```

2. In the GitHub repo, add these **Actions variables** from the stack outputs:
   `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `SITE_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.

3. Push to `main`. `ci.yml` verifies every PR; `deploy.yml` builds, syncs to S3 and
   invalidates CloudFront on `main`. The site URL is the `SiteUrl` stack output.

### Custom domain (optional)

Add an ACM certificate (in `us-east-1`) and `Aliases` + `ViewerCertificate` to the distribution,
then point a Route 53 alias record at it.
