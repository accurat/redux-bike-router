export function log(...args) { console.log(...args, this); return this }

export function toArray(obj = this) {
  return Object.keys(obj).map(k => [k, obj[k]])
}

export function toObject(arr = this) {
  return arr.reduce((acc, [k, v]) => { acc[k] = v; return acc }, {})
}

export function mapToObject(mapFn) {
  const obj = this
  const mapped = Object.keys(obj).reduce((acc, key) => {
    acc[key] = mapFn(obj[key], key)
    return acc
  }, {})
  return mapped
}

export function mapToArray(mapFn) {
  const obj = this
  const mapped = Object.keys(obj).reduce((acc, key) => {
    acc.push(mapFn(obj[key], key))
    return acc
  }, [])
  return mapped
}

export function flattened() {
  // FIXME: TO BE TESTED
  const arr = this
  const arrFlattened = arr.reduce((acc, el) => {
    if (Array.isArray(el)) {
      acc.push(...el)
    } else {
      acc.push(el)
    }
    return acc
  }, [])
  return arrFlattened
}

export function trimLeftRight(char) {
  const str = this
  const n = str.length - 1
  const sliceFrom = str[0] === char ? 1 : 0
  const sliceTo = str[n] === char ? -1 : undefined
  return str.slice(sliceFrom, sliceTo)
}

export function nullOr(changeFn) {
  const value = this
  if (value === null) return null
  if (value === undefined) throw new Error('nullOr: Undefined value, should be null')
  const changedValue = changeFn(value)
  if (changedValue === undefined) throw new Error('nullOr: Undefined changedValue, should be null')
  return changedValue
}
