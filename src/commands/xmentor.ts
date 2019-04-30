import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'xmentor',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, system, prompt, filesystem } = toolbox

    const exerciseUUID = parameters.string

    const spinner = print.spin({ text: 'Downloading student solution.', spinner: 'dots' })
    const pathToExercise = (await system.run(`exercism download --uuid=${exerciseUUID}`)).trim()
    spinner.succeed()
    
    spinner.start('Installing dependencies.')
    const installText = await system.run(`npm i`, { cwd: pathToExercise })
    spinner.succeed(installText)

    // TODO: Find test file, remove all possible skipped and only tests and describes.
    
    spinner.start('Running tests.')
    try {
      await system.run(`npx tsc --noEmit -p . && npx jest --i --no-cache`, { cwd: pathToExercise })
      spinner.succeed('All tests pass')
    } catch (e) {
      spinner.fail(e.message)
    }
    
    const shouldWeDelete = await prompt.confirm('Do you want to delete the student exercise project?')

    if (shouldWeDelete) {
      spinner.start('Deleting student project')
      await filesystem.removeAsync(pathToExercise)
      spinner.succeed()
      print.success('All done.')
    } else {
      print.success('All done. Student project is located at \n' + pathToExercise)
    }

    
    
  }
}
