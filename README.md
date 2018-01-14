# π-Base Viewer

[![CircleCI](https://circleci.com/gh/pi-base/viewer.svg?style=svg)](https://circleci.com/gh/pi-base/viewer)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Please see that documentation for more information on common project tasks.

# Running Locally

Running locally requires a copy of the [pi-base server](https://github.com/pi-base/server). The easiest way to set this up is using the provided `docker-compose.yml` file:


## Running the server

* Install [docker](https://docs.docker.com/engine/installation/) and [docker-compose](https://docs.docker.com/compose/install/)
* Copy/rename `example.env.server` to `.env.server` and change the values as needed
* Run `docker-compose up server` (may require `sudo`) to start the server

Once everything has finished building (which may take a while on first load), you should be able to access the viewer at `localhost:3141`.

### Configuring the server

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


## Running the frontend

You can run the frontend development server using docker as well (`docker-compose up`) but the development experience is better if you run it locally:

### Installing node

We recommend installing `nvm` to manage `node` versions. We are currently developing against `lts/carbon`, and intend to track the most recent lts.

* Install NVM using the script provided at https://github.com/creationix/nvm#installation
* Run `nvm install lts/carbon` to install
* Run `nvm use lts/carbon` to set the default version of node

### Installing yarn

We use yarn as a package manager to ensure consistent build. You can install yarn by following the directions at https://yarnpkg.com/lang/en/docs/install/

### Running the server

The first time you start the server (and any time your packages are updated), you should run `yarn install`

Once all packages are installed, run `yarn run start` to start the server. After a short build process, your browser should open a copy of the viewer.
