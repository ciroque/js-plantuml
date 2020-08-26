import Parser from '../src/parser';

test('parses module Javascript to intermediate format', () => {
    const options = {sourceType: 'module'};
    const filename = 'sample.js';
    const js = `
        import x from './x';
        import { a, b, c } from './y';
        import z from './z';
        
        const id = (d) => d;
        
        export default id; 
    `;
    const expected = {
        filename: filename,
        imports: ['x', 'y', 'z'],
        exports: ['id']
    };

    const mapper = Parser(filename, options);
    const actual = mapper.parse(js);

    expect(actual).toStrictEqual(expected);
});

test('parses jsx to intermediate format', () => {
    const options = {sourceType: 'module', jsx: true};
    const filename = 'sample.jsx';
    const jsx = `
        import React from 'react';
        
        class App extends React.Component {
           render() {
              return (
                 <div>
                    Hello World!!!
                 </div>
              );
           }
        }
        export default App;
    `;

    const expected = {
        filename: filename,
        imports: ['react'],
        exports: ['App']
    }

    expect(Parser(filename, options).parse(jsx)).toStrictEqual(expected);
});
