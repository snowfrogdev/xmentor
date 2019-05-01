import { GluegunToolbox } from 'gluegun'

export default {
  name: 'xmentor',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, system, prompt, filesystem } = toolbox

    const exerciseUUID = parameters.string

    const spinner = print.spin({ text: 'Downloading student solution.', spinner: 'dots' })

    try {
      const pathToExercise = (await system.run(`exercism download --uuid=${exerciseUUID}`)).trim()
      spinner.succeed()

      spinner.start('Installing dependencies.')
      const installText = await system.run(`npm i`, { cwd: pathToExercise })
      spinner.succeed(installText)

      spinner.start('Unskipping all tests')
      const testFile = await filesystem.readAsync(`${pathToExercise}/leap.test.ts`)
      const unskippedTests = unskipTests(unskipDescribes(testFile))
      const testCount = countTests(unskippedTests)

      await filesystem.writeAsync(`${pathToExercise}/leap.test.ts`, unskippedTests)
      spinner.succeed(`Found ${testCount} tests`)

      spinner.start('Running tests.')
      await system.run(`npx tsc --noEmit -p . && npx jest --i --no-cache`, { cwd: pathToExercise })
      spinner.succeed('All tests pass')

      const shouldWeDelete = await prompt.confirm('Do you want to delete the student exercise project?')

      if (shouldWeDelete) {
        spinner.start('Deleting student project')
        await filesystem.removeAsync(pathToExercise)
        spinner.succeed()
        print.success('All done.')
      } else {
        print.success('All done. Student project is located at \n' + pathToExercise)
      }
    } catch (e) {
      spinner.fail(e.message)
    }
  }
}

export function unskipDescribes(testFileContent: string): string {
  return testFileContent.replace(/describe\.only|fdescribe|describe\.skip|xdescribe/g, 'describe')
}

export function unskipTests(testFileContent: string): string {
  return testFileContent.replace(/test\.only|it\.only|ftest|fit|test\.skip|it\.skip|xtest|xit/g, 'test')
}

export function countTests(testFileContent: string): number {
  return (testFileContent.match(/^test|^it| test| it/gm) || []).length
}