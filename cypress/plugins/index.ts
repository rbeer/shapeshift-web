/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { spawnSync } = require('child_process');
const { resolve } = require('path')

const findBrave = async () => {
  const versionScript = resolve(process.cwd(), 'cypress/scripts/brave-version.sh')
  const versionProc = await spawnSync(versionScript)
  if (versionProc.status !== 0) {
    throw new ReferenceError('Brave not found')
  } else {
    return versionProc.stdout.toString().split('\n')
  }
}

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = async (on: any, config: any) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const browsers = [...config.browsers]

  try {
    const [path, version] = await findBrave()
    const majorVersion = parseInt(version.split('.'))

    browsers.push({
      name: 'brave',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Brave',
      version,
      path,
      majorVersion
    })
  } catch (err) {}

  return {
    browsers
  }
}
