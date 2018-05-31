# DeepDiffMapper

```sh
   $ npm install deep-diff-mapper
```

## Usage

No Change
```javascript
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
```


Detecting Multiple Changes
```javascript
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
```