<!--
  <<< Author notes: Step 5 >>>
  Start this step by acknowledging the previous step.
  Define terms and link to docs.github.com.
-->

## Step 5: Deploy to a production environment based on labels

_Deployed! :ship:_

### Nicely done

As we've done before, create a new branch called `production-deployment-workflow` from `main`. In the `.github/workflows` directory, add a new file titled `deploy-prod.yml`. This new workflow deals specifically with commits to `main` and handles deployments to `prod`.

**Continuous delivery** (CD) is a concept that contains many behaviors and other, more specific concepts. One of those concepts is **test in production**. That can mean different things to different projects and different companies, and isn't a strict rule that says you are or aren't "doing CD".

In our case, we can match our production environment to be exactly like our staging environment. This minimizes opportunities for surprises once we deploy to production.

### :keyboard: Activity 1: Add triggers to production deployment workflow

Copy and paste the following to your file, and replace any `<username>` placeholders with your GitHub username. Note that not much has changed from our staging workflow, except for our trigger, and that we won't be filtering by labels.

```yaml
name: Deploy to production

on:
  push:
    branches:
      - main

env:
  IMAGE_REGISTRY_URL: ghcr.io
  ###############################################
  ### Replace <username> with GitHub username ###
  ###############################################
  DOCKER_IMAGE_NAME: <username>-azure-ttt
  AZURE_WEBAPP_NAME: <username>-ttt-app
  ###############################################

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - name: npm install and build webpack
        run: |
          npm install
          npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: webpack artifacts
          path: public/

  Build-Docker-Image:
    runs-on: ubuntu-latest
    needs: build
    name: Build image and store in GitHub Container Registry
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Download built artifact
        uses: actions/download-artifact@v3
        with:
          name: webpack artifacts
          path: public

      - name: Log in to GHCR
        uses: docker/login-action@v2
        with:
          registry: ${{ env.IMAGE_REGISTRY_URL }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{env.IMAGE_REGISTRY_URL}}/${{ github.repository }}/${{env.DOCKER_IMAGE_NAME}}
          tags: |
            type=sha,format=long,prefix=

      - name: Build and push Docker image
        uses: docker/build-push-action@v3
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

  Deploy-to-Azure:
    runs-on: ubuntu-latest
    needs: Build-Docker-Image
    name: Deploy app container to Azure
    steps:
      - name: "Login via Azure CLI"
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - uses: azure/docker-login@v1
        with:
          login-server: ${{env.IMAGE_REGISTRY_URL}}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Deploy web app container
        uses: azure/webapps-deploy@v2
        with:
          app-name: ${{env.AZURE_WEBAPP_NAME}}
          images: ${{env.IMAGE_REGISTRY_URL}}/${{ github.repository }}/${{env.DOCKER_IMAGE_NAME}}:${{github.sha}}

      - name: Azure logout via Azure CLI
        uses: azure/CLI@v1
        with:
          inlineScript: |
            az logout
            az cache purge
            az account clear
```

1. Update every `<username>` to your GitHub username.
1. Commit your changes to the `production-deployment-workflow` branch.
1. Go to the Pull requests tab and click **Compare & pull request** for the `production-deployment-workflow` branch and create a Pull request.

Great! The syntax you used tells GitHub Actions to only run that workflow when a commit is made to the main branch. Now we can put this workflow into action to deploy to production!

### :keyboard: Activity 2: Merge your pull request

1. You can now [merge](https://docs.github.com/en/get-started/quickstart/github-glossary#merge) your pull request!
1. Click **Merge pull request** and leave this tab open as we will be applying a label to the closed pull request in the next step.
1. Now we just have to wait for the package to be published to GitHub Container Registry and the deployment to occur.
1. Wait about 20 seconds then refresh this page (the one you're following instructions from). [GitHub Actions](https://docs.github.com/en/actions) will automatically update to the next step.
