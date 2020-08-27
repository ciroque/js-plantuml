/*
 *
 *   Copyright Steve Wagner, 2020.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *   AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *   IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *   ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 *   THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * /
 */

import path from 'path';

import DirectoryWalker from "../src/directorywalker";

test('walks the walk', async () => {
    const directory = './src';
    const entries = [];

    for await (const fullPath of DirectoryWalker().walk(directory)) {
        entries.push(fullPath);
    }

    expect(entries.length).toBeGreaterThan(0);
});

test('defaults to .js and .jsx files', async () => {
    const directory = './src';
    const extensions = ['.js', '.jsx'];
    const entries = [];
    for await (const fullPath of DirectoryWalker().walk(directory)) {
        entries.push(fullPath);
    }

    expect(entries.every(entry => extensions.includes(path.extname(entry)))).toBeTruthy();
});

test('allows file extensions to be provided', async () => {
    const directory = '.';
    const options = {extensions: ['.md']};
    const entries = [];
    for await (const fullPath of DirectoryWalker(options).walk(directory)) {
        entries.push(fullPath);
    }
    expect(entries.every(entry => options.extensions.includes(path.extname(entry)))).toBeTruthy();
});

test('accepts directory exclusion list', async () => {
    const directory = '.';
    const options = {excludePaths: ['node_modules']};
    const entries = [];
    for await (const fullPath of DirectoryWalker(options).walk(directory)) {
        entries.push(fullPath);
    }
    expect(entries.filter(entry => options.excludePaths.some(path => entry.includes(path))).length).toEqual(0);
});
