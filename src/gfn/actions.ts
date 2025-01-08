export const increment = function (INFO) {
    const set_M = INFO.set_M;
    set_M((m) => {
        // @ts-ignore
        if (Object.hasOwn(m, 'count')) m.count += 1;
        else {
            for (let [k, v] of Object.entries(m)) {
                if (typeof v === 'number') {
                    m[k] += 1;
                    break;
                }
            }
        }
        return { ...m };
    });
}
export const decrement = function (INFO) {
    alert("@todo: decrement");
}