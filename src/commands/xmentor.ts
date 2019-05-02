import { GluegunToolbox } from 'gluegun';

const LANGUAGE_TEST_FILE_MAPPER: { [k: string]: string } = {
  'typescript': 'test.ts',
  'javascript': 'spec.js',
};

const LANGUAGE_RUN_COMMAND_MAPPER: { [k: string]: string } = {
  'typescript': `npx tsc --noEmit -p . && npx jest --i --no-cache`,
  'javascript': 'jest --no-cache ./*',
};

export default {
  name: 'xmentor',
  run: async (toolbox: GluegunToolbox) => {
    const { print, parameters, system, prompt, filesystem } = toolbox;
    const exerciseUUID = parameters.string;
    const spinner = print.spin({ text: 'Downloading student solution.', spinner: 'dots' });

    try {
      const pathToExercise = (await system.run(`exercism download --uuid=${exerciseUUID}`)).trim();
      if (!pathToExercise) throw new Error('Path to exercise missing');

      const testName = getTestName(pathToExercise);
      if (!testName) throw new Error('Test name not found');
      const solutionLanguage = getLanguage(pathToExercise);
      if (!solutionLanguage) throw new Error('Language not supported');
      spinner.succeed();

      spinner.start('Installing dependencies.');
      const installText = await system.run(`npm i`, { cwd: pathToExercise });
      spinner.succeed(installText);

      spinner.start('Unskipping all tests');
      const fileEnding = LANGUAGE_TEST_FILE_MAPPER[solutionLanguage];
      const testFile = await filesystem.readAsync(`${pathToExercise}/${testName}.${fileEnding}`);

      if (!testFile) throw new Error('Test file not found.');
      const testCount = countTests(testFile);
      const unskippedTests = unskipTests(unskipDescribes(testFile));

      await filesystem.writeAsync(`${pathToExercise}//${testName}.test.ts`, unskippedTests);
      spinner.succeed(`Found ${testCount} tests`);

      spinner.start('Running tests.');
      await system.run(LANGUAGE_RUN_COMMAND_MAPPER[solutionLanguage], { cwd: pathToExercise });
      spinner.succeed('All tests pass');

      const shouldWeDelete = await prompt.confirm('Do you want to delete the student exercise project?');

      if (shouldWeDelete) {
        spinner.start('Deleting student project');
        await filesystem.removeAsync(pathToExercise);
        spinner.succeed();
        print.success('All done.');
      } else {
        print.success('All done. Student project is located at \n' + pathToExercise);
      }
    } catch (e) {
      spinner.fail(e.message);
    }
  },
};

export function getTestName(exercisePath: string): string | undefined {
  const splitPath = exercisePath.split('/');
  return splitPath[splitPath.length - 1];
}

export function getLanguage(exercisePath: string): string | undefined {
  const splitPath = exercisePath.split('/');
  return splitPath[splitPath.length - 2];
}

export function unskipDescribes(testFileContent: string): string {
  return testFileContent.replace(/describe\.only|fdescribe|describe\.skip|xdescribe/g, 'describe');
}

export function unskipTests(testFileContent: string): string {
  return testFileContent.replace(/test\.only|it\.only|ftest|fit|test\.skip|it\.skip|xtest|xit/g, 'test');
}

export function countTests(testFileContent: string): number {
  const TEST_NOT_SKIPPED = 1;
  return (testFileContent.match(/test\.only|it\.only|ftest|fit|test\.skip|it\.skip|xtest|xit/g) || []).length + TEST_NOT_SKIPPED;
}
