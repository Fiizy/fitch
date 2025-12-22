import { HttpResponse, JsonObject } from '../fitch'

const isObject = (value: unknown): value is object => typeof value === 'object' && value !== null

const isArray = (value: unknown): value is any[] => value instanceof Array

function toCamel(value: string): string {
  return value.replace(/([-_][a-z])/gi, (newValue: string) => {
    return newValue
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  })
}

function toSnake(value: string): string {
  return value.replace(/[A-Z]/g, (newValue: string) => {
    return `_${newValue.toLowerCase().replace(/^_/, '')}`
  })
}

function arrayContainsOnlyStringsOrNumbers(array: []): boolean {
  return array.every((i) => typeof i === 'string' || typeof i === 'number')
}

function formatObject(o: object | object[], path: string, replacer: (s: string) => string, filter?: (k: string, p: string) => boolean): any {
  if (isArray(o) && !arrayContainsOnlyStringsOrNumbers(o as [])) {
    return o.map((i, idx) => {
      return formatObject(i, path.concat(`[${idx}]`), replacer, filter)
    })
  } else if (isObject(o)) {
    const n: JsonObject = {}
    const obj: JsonObject = o

    Object.keys(obj).forEach((k: string) => {
      if (!filter || !filter(k, path.concat(`.${k}`))) {
        if (isObject(obj[k])) {
          n[replacer(k)] = formatObject(obj[k], path.concat(`.${k}`), replacer, filter)
        } else {
          n[replacer(k)] = obj[k]
        }
      } else {
        n[k] = obj[k]
      }
    })

    return n
  }
}

function transformToSnake(request: JsonObject, filter?: (k: string, p: string) => boolean): JsonObject {
  if (request.body) {
    request.body = formatObject(
      request.body,
      'body',
      (s) => {
        return toSnake(s)
      },
      filter
    )
  }

  return request
}

function transformToCamel<T>(response: HttpResponse<T>, filter?: (k: string, p: string) => boolean): HttpResponse<T> {
  if (response.parsedBody) {
    response.parsedBody = formatObject(
      response.parsedBody as JsonObject,
      'body',
      (s) => {
        return toCamel(s)
      },
      filter
    )
  }

  return response
}

export { transformToCamel, transformToSnake }
