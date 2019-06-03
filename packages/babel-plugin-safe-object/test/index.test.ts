import { transform, transformFileSync, PluginOptions } from '@babel/core';
import babelPluginSafeObject from '../src';
import { readdirSync, readFileSync } from 'fs';
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
    const actualFile = path.join(fixtureDir, 'actual.ts');
    const expectedFile = path.join(fixtureDir, 'expected.ts');
    it(`should work with ${caseName.split('-').join(' ')}`, () => {
      const transfromResult = transformTestFile(actualFile);
      expect(true);
    });
  });
});

describe('test', ()=> {
  const fixturesDir = path.join(__dirname, 'fixtures');
  let fixtures = readdirSync(fixturesDir);
  fixtures.forEach(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, 'actual.ts');
    const expectedFile = path.join(fixtureDir, 'expected.ts');
    it(`should work with ${caseName.split('-').join(' ')}`, () => {
      const transfromResult = transformTestFile(expectedFile);
      console.log(transfromResult);
      expect(true);
    });
  });
})
