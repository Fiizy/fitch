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

function formatObject(o: object | object[], replacer: (s: string) => string): any {
  if (isArray(o)) {
    return o.map((i) => {
      return formatObject(i, replacer)
    })
  } else if (isObject(o)) {
    const n: JsonObject = {}
    const obj: JsonObject = o

    Object.keys(obj).forEach((k: string) => {
      if (isObject(obj[k])) {
        n[replacer(k)] = formatObject(obj[k], replacer)
      } else {
        n[replacer(k)] = obj[k]
      }
    })

    return n
  }
}

function transformToSnake(request: JsonObject): JsonObject {
  if (request.body) {
    request.body = formatObject(request.body, (s) => {
      return toSnake(s)
    })
  }

  return request
}

function transformToCamel<T>(response: HttpResponse<T>) {
  if (response.parsedBody) {
    response.parsedBody = formatObject(response.parsedBody as JsonObject, (s) => {
      return toCamel(s)
    })
  }

  return response
}

export { transformToCamel, transformToSnake }
