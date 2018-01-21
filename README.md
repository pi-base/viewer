# pi-Base Viewer

[![CircleCI](https://circleci.com/gh/pi-base/viewer.svg?style=svg)](https://circleci.com/gh/pi-base/viewer)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Please see that documentation for more information on common project tasks.


# Setting up the server

Developing the viewer requires a copy of the
[pi-base server](https://github.com/pi-base/server) running locally.
The easiest way to set this up is using Docker:

## Initial setup

* Install [docker](https://docs.docker.com/engine/installation/) and
  [docker-compose](https://docs.docker.com/compose/install/)
* Copy/rename `.env.server.example` to `.env.server` and change the values
  as needed
* Run `docker-compose up server`
  (or possibly `sudo docker-compose up server`) to start the server

Once everything has finished building (which may take a while on first load),
visiting <http://localhost:3141> should respond with
`{"version":"VERSION_HASH"}`.

## Running the server

`docker-compose up server` or `sudo docker-compose up server`
should be sufficient to run the server subsequently. If the server's
Docker image has been updated, `docker-compose pull` or
`sudo docker-compose pull` will update your local image.

## Configuring the server

See the `docker-compose.yml` file for the specifics of what is running and options for configuring. Of particular note:

* You can control the server log settings by adjusting the various `LOG_` variables.
* Suggested directory structure is

```
    pi-base
    ├── data
    ├── server # if desired
    └── viewer
```

* By default, we mount the `../data` directory inside the server container and store the data repository there. You can adjust where that data is located by mounting a different directory in the container at `/data` (or remove the mount).


# Setting up the viewer

You can run the viewer using docker as well (`docker-compose up`) but the
development experience is better if you run it locally:

## Installing node

We recommend installing `nvm` to manage `node` versions. We are currently developing against `lts/carbon`, and intend to track the most recent lts.

* Install NVM using the script provided at https://github.com/creationix/nvm#installation
* Run `nvm install lts/carbon` to install
* Run `nvm use lts/carbon` to set the default version of node

## Installing yarn

We use `yarn` as a package manager to ensure consistent builds. You can install
yarn by following the directions at https://yarnpkg.com/lang/en/docs/install/

## Running the viewer

The first time you start the viewer (and any time your packages are updated),
you should run `yarn install` and `yarn run schema`.

Once all packages are installed, run `yarn run start` to start the server.
After a short build process, your browser should open a copy of the viewer
at <http://localhost:3000>.
