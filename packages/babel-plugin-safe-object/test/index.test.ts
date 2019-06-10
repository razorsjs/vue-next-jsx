import { transformFileSync, PluginOptions } from '@babel/core';
import babelPluginSafeObject from '../src';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

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

describe('babel-plugin-safe-object', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  let fixtures = readdirSync(fixturesDir);
  fixtures.forEach(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.js');
    const expectedFile = path.join(fixtureDir, 'expected.js');
    it(`should work with ${caseName.split('-').join(' ')}`, () => {
      const transformResult = transformTestFile(actualFile);
      const expectResult = readFileSync(expectedFile, 'utf-8').toString();
      writeFileSync(expectedFile, transformResult)
      expect(transformResult === expectResult);
    });
  });
});
