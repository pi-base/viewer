'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
});

// Ensure environment variables are read.
require('../config/env')

const watch = require('watch')
const { exec } = require('child_process')

const serverG = '../server/graph'
const viewerG = 'src/graph'

const transform = path => {
  // Be _sure_ we're always starting in the graph folder
  // as these paths are likely to get clobbered
  return viewerG + path.replace(serverG, '')
}

const run = cmd => {
  console.log('Running', cmd)
  exec(cmd, (error, stdout, stderr) => {
    console.log(stdout)
    if (error) {
      console.error('Error', error)
      console.error(stderr)
    }
  })
}

const rebuild = f => {
  run('yarn run schema')
}

watch.createMonitor(serverG, (monitor) => {
  monitor.on('created', (f) => {
    run(`cp ${f} ${transform(f)}`)
    rebuild()
  })

  monitor.on('changed', (f) => {
    run(`cp ${f} ${transform(f)}`)
    rebuild()
  })

  monitor.on('removed', (f) => {
    run(`rm -f ${transform(f)}`)
    rebuild()
  })

  console.info('Listening for changes to', serverG)
})