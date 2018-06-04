/* Created by mclyde on 12/29/2017 */
const assert = require('chai').assert;
const _ = require('lodash');
const DeepDiffMapper = require('../dist/deepDiffMapper').DeepDiffMapper;

describe('DeepDiffMapper', () => {

    it('DeepDiffMapper should exist', () => {
        assert.isOk(DeepDiffMapper);
    });

    it('Should find no changes', () => {
        const before = {
            foo: 'bar',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };
        const after = {
            foo: 'bar',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };

        const diff = DeepDiffMapper.Map(before, after);
        assert.equal(diff.__type__, DeepDiffMapper.VALUE_UNCHANGED);
    });



    it('Should find 1 simple change', () => {
        const before = {
            foo: 'bar',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };
        const after = {
            foo: 'baz',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };

        const diff = DeepDiffMapper.Map(before, after);
        assert.equal(diff.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.foo.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.foo.oldVal, 'bar');
        assert.equal(diff.foo.newVal, 'baz');

        assert.equal(diff.zip.__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat.__type__, DeepDiffMapper.VALUE_UNCHANGED);
    });

    it('Should find multiple changes', () => {
        const before = {
            foo: 'bar',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };
        const after = {
            foo: 'bar',
            zip: {
                zap: 1,
                zup: 2,
            },
            wat: [ 1, 2, 3, false, true],
        };

        const diff = DeepDiffMapper.Map(before, after);
        assert.equal(diff.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.foo.__type__, DeepDiffMapper.VALUE_UNCHANGED);

        assert.equal(diff.zip.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.zip.zap.__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.zip.zup.__type__, DeepDiffMapper.VALUE_CREATED);

        assert.equal(diff.wat.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.wat[0].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[1].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[2].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[3].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[4].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[5].__type__, DeepDiffMapper.VALUE_DELETED);
    });

    it('Should be able to convert change map to array', () => {
        const before = {
            foo: 'bar',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };
        const after = {
            foo: 'baz',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };

        const diff = DeepDiffMapper.Map(before, after);
        assert.equal(diff.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.foo.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.foo.oldVal, 'bar');
        assert.equal(diff.foo.newVal, 'baz');

        assert.equal(diff.zip.__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat.__type__, DeepDiffMapper.VALUE_UNCHANGED);

        const changes = DeepDiffMapper.ToArray(diff);
        assert.equal(changes.length, 1);
        assert.equal(changes[0].type, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(changes[0].path.length, 1);
        assert.equal(changes[0].path[0], 'foo');
        assert.equal(changes[0].oldVal, 'bar');
        assert.equal(changes[0].newVal, 'baz');
    });

    it('Should find multiple changes and convert to array', () => {
        const before = {
            foo: 'bar',
            zip: {
                zap: 1,
            },
            wat: [ 1, 2, 3, false, true, 'Sup?'],
        };
        const after = {
            foo: 'bar',
            zip: {
                zap: 1,
                zup: 2,
            },
            wat: [ 1, 2, 3, false, true],
        };

        const diff = DeepDiffMapper.Map(before, after);
        assert.equal(diff.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.foo.__type__, DeepDiffMapper.VALUE_UNCHANGED);

        assert.equal(diff.zip.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.zip.zap.__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.zip.zup.__type__, DeepDiffMapper.VALUE_CREATED);

        assert.equal(diff.wat.__type__, DeepDiffMapper.VALUE_UPDATED);
        assert.equal(diff.wat[0].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[1].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[2].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[3].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[4].__type__, DeepDiffMapper.VALUE_UNCHANGED);
        assert.equal(diff.wat[5].__type__, DeepDiffMapper.VALUE_DELETED);

        const changes = DeepDiffMapper.ToArray(diff);
        console.log(changes);
    });

});
