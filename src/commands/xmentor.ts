import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'xmentor',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, system } = toolbox

    const exerciseUUID = parameters.string
    const pathToExercise = await system.run(`exercism download --uuid=${exerciseUUID}`)
    // const installText = await system.run(`cd ${pathToExercise} && npm i`)
    // const testResults = await system.run(`cd ${pathToExercise} && npm t`)


    // print.info(installText)
  }
}
