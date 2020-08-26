import { parse } from 'esprima';

const Mapper = (filename, options) => {
    return {
        map: (js) => {
            const extractImportDeclarations = (ast) => ast.body.filter(token => token.type === 'ImportDeclaration');
            const extractExportDeclarations = (ast) => ast.body.filter(token => token.type === 'ExportDefaultDeclaration' || token === 'ExportDeclaration');

            const mapImports = (importDeclarations) => importDeclarations.map(importDeclaration => importDeclaration.source.value);
            const mapExports = (exportDeclarations) => exportDeclarations.map(exportDeclaration => exportDeclaration.declaration.name);

            const normalizeImports = (importDeclarations) => importDeclarations.map(importDeclaration => importDeclaration.split('/').pop());

            const ast = parse(js, options);

            return {
                filename: filename,
                imports: normalizeImports(mapImports(extractImportDeclarations(ast))),
                exports: mapExports(extractExportDeclarations(ast))
            }
        }
    }
};

export default Mapper;
