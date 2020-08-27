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
import Parser from '../src/parser';

test('parses module Javascript to intermediate format', async () => {
    const options = {sourceType: 'module'};
    const filename = 'sample.js';
    const js = `
        /* 
            This is a multiline comment
         */
        import x from './x';
        import { a, b, c } from './y';
        import z from './z';
        
        const id = (d) => d;
        
        export default id; 
    `;
    const expected = {
        filename: filename,
        name: 'sample',
        imports: ['x', 'y', 'z'],
        exports: ['id']
    };

    const actual = await Parser(filename, options).parse(js);

    expect(actual).toStrictEqual(expected);
});

test('parses jsx to intermediate format', async () => {
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
        name: 'sample',
        imports: ['react'],
        exports: ['App']
    }

    expect(await Parser(filename, options).parse(jsx)).toStrictEqual(expected);
});
