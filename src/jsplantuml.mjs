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
import fs from 'fs';
import path from 'path';

import DirectoryWalker from "./directorywalker.mjs";
import Parser from "./parser.mjs";
import Generator from "./generator.mjs";

const JsPlantUml = () => {
    return {
        generate: async (opts) => {
            const options = Object.assign({ directory: './src', parser: { jsx: true } }, opts);
            let plantUmls = [];
            const errors = [];

            for await (const fullPath of DirectoryWalker().walk(options.directory)) {
                const filename = path.basename(fullPath);
                try {
                    const source = await fs.promises.readFile(fullPath, 'utf8');
                    const parsed = await Parser(filename, options.parser).parse(source);
                    const plantUml = await Generator().generate(parsed);
                    if(plantUml) {
                        plantUmls = plantUmls.concat(plantUml);
                    }
                } catch(err) {
                    errors.push(`${filename}: ${err}`);
                }
            }

            return new Promise(r => r({plantUml: plantUmls, errors: errors}));
        }
    };
};

export default JsPlantUml;
