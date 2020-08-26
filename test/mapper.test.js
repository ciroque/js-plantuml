import Mapper from '../src/mapper';

test('map', () => {
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

    const mapper = Mapper(filename, options);
    const actual = mapper.map(js);

    expect(actual).toStrictEqual(expected);
});