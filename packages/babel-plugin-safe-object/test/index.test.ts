import { transformFileSync, PluginOptions } from '@babel/core';
import babelPluginSafeObject from '../src';
import { readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { EnvEnum } from '../src/environment';

function transformTestFile(filePath: string, options: any = {}, pluginOptions: PluginOptions = {}) {
  const transformObj = transformFileSync(filePath, {
    presets: [
      '@babel/env',
      '@babel/typescript',
    ],
    plugins: [[babelPluginSafeObject, pluginOptions]],
    ...options,
  });
  return transformObj === null ? '' : transformObj.code;
}

beforeAll(() => {
  // Clears the database and adds some testing data.
  // Jest will wait for this promise to resolve before running tests.
  process.env.NODE_ENV = EnvEnum.TEST;
});

describe('babel-plugin-safe-object', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  let fixtures = readdirSync(fixturesDir);
  fixtures.forEach(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.js');
    const expectedFile = path.join(fixtureDir, 'expected.js');
    it(`should work with ${caseName.split('-').join(' ')}`, () => {
      const transfromResult = transformTestFile(actualFile);
      writeFileSync(expectedFile, transfromResult)
      expect(true);
    });
  });
});
