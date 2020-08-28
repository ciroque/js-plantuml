/*
  Copyright Steve Wagner, 2020.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import esprima from 'esprima';

const Parser = (filename, opts) => {
    const options = Object.assign(
        { sourceType: 'module' },
        opts
    )
    const doParse = (source) => {
        const formatModuleName = (filename) => filename.split('.').reverse().pop();
        const extractImportDeclarations = (ast) => ast.body.filter(token => token.type === 'ImportDeclaration');
        const extractExportDeclarations = (ast) => ast.body.filter(token => token.type === 'ExportDefaultDeclaration' || token === 'ExportDeclaration');

        const mapImports = (importDeclarations) => importDeclarations.map(importDeclaration => importDeclaration.source.value);
        const mapExports = (exportDeclarations) => exportDeclarations.map(exportDeclaration => exportDeclaration.declaration.name);

        const normalizeImports = (importDeclarations) => importDeclarations.map(importDeclaration => importDeclaration.split('/').pop());

        let ast = {};
        try {
            ast = esprima.parse(source, options);
        } catch(ex) {
            throw ex;
        }

        const imports = normalizeImports(mapImports(extractImportDeclarations(ast)));
        const exports = mapExports(extractExportDeclarations(ast));

        return {
            filename: filename,
            name: formatModuleName(filename),
            imports: imports,
            exports: exports
        };
    }
    return {
        parse: async (source) => {
            return new Promise((resolve, reject) => {
                try {
                    resolve(doParse(source));
                } catch(ex) {
                    reject(ex);
                }
            });
        }
    };
};

export default Parser;
