import { expect } from '@jest/globals'
import { transformToCamel } from '../src/helpers/transformers'

describe('transformToCamel', () => {

  it('it should work without filter', () => {
    const request = {
      parsedBody: {
        smth: 'SMTH',
        some_other: 'value',
        some_object: {
          some_key: 'value'
        },
        some_array: [
          {
            key: 'value',
            other_key: 'value'
          }
        ]
      }
    }

    const result = transformToCamel(request)

    expect(result).toEqual({
      parsedBody: {
        smth: 'SMTH',
        someOther: 'value',
        someObject: {
          someKey: 'value'
        },
        someArray: [
          {
            key: 'value',
            otherKey: 'value'
          }
        ]
      }
    })
  })

  it('it should keep keys and objects as is', () => {
    const request = {
      parsedBody: {
        smth: 'SMTH',
        some_other: 'value',
        some_object: {
          some_key: 'value',
          keep_sub_object: {
            should_not_change: 'this'
          }
        },
        some_array: [
          {
            key: 'value',
            other_key: 'value'
          }
        ],
        keep_as_is: {
          should_not_change: 'this'
        }
      }
    }

    const result = transformToCamel(request, (s, k) => {
      return s === 'keep_as_is' || k === 'body.some_object.keep_sub_object'
    })

    expect(result).toEqual({
      parsedBody: {
        smth: 'SMTH',
        someOther: 'value',
        someObject: {
          someKey: 'value',
          keep_sub_object: {
            should_not_change: 'this'
          }
        },
        someArray: [
          {
            key: 'value',
            otherKey: 'value'
          }
        ],
        keep_as_is: {
          should_not_change: 'this'
        }
      }
    })
  })
})
