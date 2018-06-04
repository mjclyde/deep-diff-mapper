import * as _ from 'lodash';

export class DeepDiffMapper {

    public static VALUE_CREATED = 'created';
    public static VALUE_UPDATED = 'updated';
    public static VALUE_DELETED = 'deleted';
    public static VALUE_UNCHANGED = 'unchanged';

    public static Map(obj1, obj2) {
        if (DeepDiffMapper.IsFunction(obj1) || DeepDiffMapper.IsFunction(obj2)) {
            throw new Error('Invalid argument. Function given, object expected.');
        }
        if (DeepDiffMapper.IsValue(obj1) || DeepDiffMapper.IsValue(obj2)) {
            return {
                __type__: DeepDiffMapper.CompareValues(obj1, obj2),
                oldVal: obj1,
                newVal: obj2,
            };
        }

        const diff: any = {};
        for (const key in obj1) {
            if (DeepDiffMapper.IsFunction(obj1[key])) {
                continue;
            }

            let value2;
            if ('undefined' !== typeof(obj2[key])) {
                value2 = obj2[key];
            }

            diff[key] = DeepDiffMapper.Map(obj1[key], value2);
        }
        for (const key in obj2) {
            if (DeepDiffMapper.IsFunction(obj2[key]) || ('undefined' !== typeof(diff[key]))) {
                continue;
            }

            diff[key] = DeepDiffMapper.Map(undefined, obj2[key]);
        }

        let unchanged = true;
        for (const key in diff) {
            if (diff[key].__type__ !== DeepDiffMapper.VALUE_UNCHANGED) {
                unchanged = false;
                break;
            }
        }
        if (unchanged) {
            diff.__type__ = DeepDiffMapper.VALUE_UNCHANGED;
        } else {
            diff.__type__ = DeepDiffMapper.VALUE_UPDATED;
        }

        return diff;
    }

    public static ToArray(diff: any, keys: string[] = []) {
        let changes: any = [];
        _.forEach(diff, (val, key) => {
            if (val && val.__type__ && val.__type__ !== DeepDiffMapper.VALUE_UNCHANGED) {
                const path = _.concat(keys, [key]);
                changes.push({
                    type: val.__type__,
                    path,
                    oldVal: val.oldVal,
                    newVal: val.newVal,
                    changes: DeepDiffMapper.ToArray(val, path),
                });
            }
        });
        return changes;
    }


    private static CompareValues(value1, value2) {
        if (value1 === value2) {
            return DeepDiffMapper.VALUE_UNCHANGED;
        }
        if (DeepDiffMapper.IsDate(value1) && DeepDiffMapper.IsDate(value2) && value1.getTime() === value2.getTime()) {
            return DeepDiffMapper.VALUE_UNCHANGED;
        }
        if ('undefined' === typeof(value1)) {
            return DeepDiffMapper.VALUE_CREATED;
        }
        if ('undefined' === typeof(value2)) {
            return DeepDiffMapper.VALUE_DELETED;
        }

        return DeepDiffMapper.VALUE_UPDATED;
    }

    private static IsFunction(obj) {
        return {}.toString.apply(obj) === '[object Function]';
    }

    private static IsArray(obj) {
        return {}.toString.apply(obj) === '[object Array]';
    }

    private static IsDate(obj) {
        return {}.toString.apply(obj) === '[object Date]';
    }

    private static IsObject(obj) {
        return {}.toString.apply(obj) === '[object Object]';
    }

    private static IsValue(obj) {
        return !DeepDiffMapper.IsObject(obj) && !DeepDiffMapper.IsArray(obj);
    }

}
