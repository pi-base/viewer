[![build-test](https://github.com/pi-base/viewer/workflows/build-test/badge.svg)](https://github.com/pi-base/viewer/actions?query=branch%3Amaster)
[![Netlify Status](https://api.netlify.com/api/v1/badges/5ab6c28f-813b-4322-9f52-92306d4c2284/deploy-status)](https://app.netlify.com/sites/upbeat-agnesi-0591dd/deploys)

# π-Base

The development instance of the π-Base is available at [topology-development.pi-base.org](https://topology-development.pi-base.org).

## Architecture

The site is powered by a few different projects, all under  [github.com/pi-base](https://github.com/pi-base).

* [core](https://github.com/pi-base/core) - typescript package containing the shared data model (spaces, properties, formulae, &c.). Available on [NPM](https://www.npmjs.com/package/@pi-base/core).
* [compile](https://github.com/pi-base/compile) - typescript package using `@pi-base/core` to compile a repository of markdown files into a JSON bundle for the viewer to view. Used in a Github action in the `data` repo. Also available on [NPM](https://www.npmjs.com/package/@pi-base/compile).
* [data](https://github.com/pi-base/data) - repo containing all actual mathematical content. Once a PR here has been approved and merged, it triggers a compiler run, which pushes the compiled bundle to S3 for the public viewer to fetch.
* [viewer](https://github.com/pi-base/viewer) - this package. Fetches and presents the compiled bundle.

## Development

Clone the repo and run

```bash
$ yarn install
$ yarn start
```

The developer panel (at `/dev`) has some utilities that may be helpful for controlling where the data bundle is fetched from, or for interacting with the stored data. By default, the current production data bundle will be used. You may also want to clone the [data](https://github.com/pi-base/data) repo and run a compiler locally to view edits as you make them; see the [compiler's README](https://github.com/pi-base/compile) for more details.

## Deployment

Deployment is automatic on a successful push to `master`. See `.github/actions` and `package.json` for details.
