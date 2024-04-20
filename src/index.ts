import { ApiFilter, ApiParameters, ApiSort } from './api.interface'

export * from './api.interface'

export const apiParamsToString = (apiParameters: ApiParameters): string => {
  let parameters = ''
  if (!apiParameters) return parameters

  for (const [key, value] of Object.entries(apiParameters)) {
    const questionMarkOrAnd = parameters.includes('?') ? '&' : '?'

    if (value) {
      switch (key) {
        case 'sorts':
          parameters += paramSortToString(value, questionMarkOrAnd)
          break
        case 'filters':
          parameters += paramFilterToString(value, questionMarkOrAnd)
          break
        default:
          // Search or any other parameter
          if (Array.isArray(value) && value.length > 0) {
            parameters += `${questionMarkOrAnd}${key}=${value.join(',')}`
          } else {
            parameters += `${questionMarkOrAnd}${key}=${value}`
          }
      }
    }
  }

  return parameters
}

export const paramSortToString = (sorts: ApiSort[], questionMarkOrAnd: '?' | '&'): string => {
  let parameters = ''

  if (!sorts?.length || sorts?.length <= 0 || !sorts[0].parameter || !sorts[0].operator) return ''

  sorts.forEach((apiSort: ApiSort, index: number) => {
    if (apiSort.parameter && apiSort.operator) {
      if (index == 0) {
        parameters += `${questionMarkOrAnd}${'sort'}=`
      } else {
        parameters += ','
      }
      parameters += `${apiSort.parameter}.${apiSort.operator}`
    }
  })

  return parameters
}

export const paramFilterToString = (filters: ApiFilter[], questionMarkOrAnd: '?' | '&'): string => {
  let parameters = ''

  if (
    !filters?.length ||
    filters?.length <= 0 ||
    !filters[0] ||
    !filters[0]?.parameter ||
    !filters[0]?.value
  )
    return ''

  filters.forEach((apiFilter: ApiFilter, index: number) => {
    if (apiFilter.value || apiFilter.value === 'false') {
      if (index == 0) {
        parameters += `${questionMarkOrAnd}${apiFilter.parameter}=`
      } else {
        parameters += `&${apiFilter.parameter}=`
      }

      if (apiFilter.operator) {
        parameters += `${apiFilter.operator}:${apiFilter.value}`
      } else {
        parameters += `${apiFilter.value}`
      }
    }
  })

  return parameters
}
