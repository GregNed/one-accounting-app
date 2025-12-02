# GitHub Actions CI/CD Setup

This workflow builds the Vue.js application and deploys it to S3.

## Prerequisites

1. **AWS IAM Role with OIDC Provider**
   - Create an OIDC identity provider in AWS IAM for GitHub
   - Create an IAM role that trusts the GitHub OIDC provider
   - The role should have permissions to:
     - `s3:PutObject`
     - `s3:GetObject`
     - `s3:DeleteObject`
     - `s3:ListBucket`
     - (Optional) `cloudfront:CreateInvalidation` if using CloudFront

2. **GitHub Variables**
   Configure the following variables in your GitHub repository settings (Settings → Secrets and variables → Actions → Variables):
   - `AWS_ROLE_ARN`: The ARN of the IAM role (e.g., `arn:aws:iam::123456789012:role/github-actions-role`)
   - `AWS_REGION`: AWS region (defaults to `us-east-1` if not set)
   - `CLOUDFRONT_DISTRIBUTION_ID`: (Optional) CloudFront distribution ID for cache invalidation

## IAM Role Trust Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/one_app:*"
        }
      }
    }
  ]
}
```

## IAM Role Permissions Policy Example

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::one-app",
        "arn:aws:s3:::one-app/*"
      ]
    }
  ]
}
```

## Workflow Triggers

- **Push to main branch**: Automatically builds and deploys
- **Manual trigger**: Use "Run workflow" button in GitHub Actions tab

## Build Process

1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies (`npm ci`)
4. Builds the project (`npm run build`)
5. Configures AWS credentials using OIDC
6. Syncs built files to S3 bucket `one-app`
7. (Optional) Invalidates CloudFront cache if distribution ID is configured

