# fitch - wrapper for fetch

[![NPM version](https://img.shields.io/npm/v/@fiizy/fitch.svg)](https://www.npmjs.com/package/@fiizy/fitch)
[![GitHub](https://img.shields.io/github/license/fiizy/fitch)](https://github.com/fiizy/fitch/blob/master/LICENSE)
![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/fiizy/fitch)
[![Minzipped size](https://img.shields.io/bundlephobia/minzip/@fiizy/fitch.svg)](https://www.npmjs.com/package/@fiizy/fitch)
[![Downloads](https://img.shields.io/npm/dm/@fiizy/fitch)](https://www.npmjs.com/package/@fiizy/fitch)
[![Types](https://img.shields.io/npm/types/@fiizy/fitch)](https://www.npmjs.com/package/@fiizy/fitch)

# Usage
## NPM
```sh
npm i @fiizy/fitch
```

## Import
```javascript
import { Fitch } from '@fiizy/fitch'
```

```javascript
const apiService = new Fitch({
  baseURL: 'https://example.com'
})
```

```javascript
apiService.get('/test-path')
apiService.delete('/test-path')
apiService.post('/test-path', payload)
apiService.put('/test-path', payload)
```

# Examples
Different transformers can be used before fetch is done.

```javascript
const apiService = new Fitch({
  baseURL: 'https://example.com',
  transformRequest: [transformToSnake, authHeader],
  transformResponse: [transformToCamel],
  headers: { 'accept-encoding': 'gzip' }
})
```


## Auth header transformer example
```javascript
function authHeader(request: JsonObject): any {  
  request.headers = { ...request.headers, Authorization: `Bearer ${accessToken}` }
  return request
}
```

