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

const DirectoryWalker = (opts) => {
    const options = Object.assign({ extensions: ['.js', '.jsx'], excludePaths: ['node_modules'] }, opts);
    const isAcceptedFileType = (entry) => entry.isFile() && options.extensions.includes(path.extname(entry.name).toLowerCase());
    const isAcceptedDirectory = (entry) => entry.isDirectory() && !options.excludePaths.includes(entry.name);
    const walker = async function* (directory) {
        for await (const entry of await fs.promises.opendir(directory)) {
            const fullPath = path.join(directory, entry.name);
            if (isAcceptedDirectory(entry)) yield* walker(fullPath);
            else if (isAcceptedFileType(entry)) yield path.resolve(fullPath);
        }
    };

    return {
        walk: walker
    };
};

export default DirectoryWalker;
