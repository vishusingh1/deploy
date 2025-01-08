// finds if there are any differences in the two objects
export function findDifferences(obj1: any, obj2: any): any {
    const changes: any = {};
  
    function compare(obj1: any, obj2: any, parentKey = ''): void {
      const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);
  
      keys.forEach((key) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        const value1 = obj1?.[key];
        const value2 = obj2?.[key];
  
        if (Array.isArray(value1) && Array.isArray(value2)) {
          if (value1.length !== value2.length || !deepEqualArrays(value1, value2)) {
            changes[fullKey] = { oldValue: value1, newValue: value2 };
          }
        } else if (typeof value1 === 'object' && typeof value2 === 'object' && value1 !== null && value2 !== null) {
          compare(value1, value2, fullKey);
        } else if (value1 !== value2) {
          changes[fullKey] = { oldValue: value1, newValue: value2 };
        }
      });
    }
  
    function deepEqual(a: any, b: any): boolean {
      if (a === b) return true;
      if (typeof a !== typeof b) return false;
  
      if (typeof a === 'object' && a !== null && b !== null) {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
  
        if (keysA.length !== keysB.length) return false;
  
        return keysA.every((key) => deepEqual(a[key], b[key]));
      }
  
      return false;
    }
  
    function deepEqualArrays(arr1: any[], arr2: any[]): boolean {
      if (arr1.length !== arr2.length) return false;
  
      return arr1.every((item, index) => deepEqual(item, arr2[index]));
    }
  
    compare(obj1, obj2);
  
    return changes;
}