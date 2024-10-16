const benefitTypeIdOptions = ['TCOP', 'UCOP', 'UCNCA', 'UCBA']
const filterCustomers = (query, customers) => {
  let filteredCustomers= customers
  if (query.firstName) {
    filteredCustomers = filteredCustomers.filter(customer => customer.firstName.includes(query.firstName))
  }
  if (query.surname) {
    filteredCustomers = filteredCustomers.filter(customer => customer.surname.includes(query.surname))
  }
  if (query.postcode) {
    filteredCustomers = filteredCustomers.filter(customer => customer.postcode.includes(query.postcode))
  }
  if (query.niNumber) {
    filteredCustomers = filteredCustomers.filter(customer => customer.niNumber.includes(query.niNumber))
  }
  if (query.benefitTypeId) {
    filteredCustomers = filteredCustomers.filter(customer => customer.benefitTypeId.includes(query.benefitTypeId))
  }
  return filteredCustomers
}

const buildUrlWithQueries = (path, body) => {
  const firstName = body.firstName !== '' ? 'firstName=' + body.firstName + '&' : ''
  const surname = body.surname !== '' ? 'surname=' + body.surname + '&' : ''
  const postcode = body.postcode !== '' ? 'postcode=' + body.postcode + '&' : ''
  const niNumber = body.niNumber !== '' ? 'niNumber=' + body.niNumber + '&' : ''
  const normaliseBenefitTypeId = normaliseCheckBoxes(body.benefitTypeId)
  const benefitTypeId= normaliseBenefitTypeId !== '' ? 'benefitTypeId=' + normaliseBenefitTypeId + '&' : ''
  return (path + '?' + firstName + surname + postcode + niNumber + benefitTypeId).replace(/&([^&]*)$/, '$1')
}
const buildSelectedFilters = (filter) => {
  if (!isSelectedFilter(filter)) {
    return ''
  }
  let categories = []
  if (filter.firstNameFilter.length) {
    categories.push(buildCategory('First name', filter.firstNameFilter))
  }
  if (filter.surnameFilter.length) {
    categories.push(buildCategory('Last name', filter.surnameFilter))
  }
  if (filter.postcodeFilter.length) {
    categories.push(buildCategory('Postcode', filter.postcodeFilter))
  }
  if (filter.niNumberFilter.length) {
    categories.push(buildCategory('National Insurance number', filter.niNumberFilter))
  }
  if (filter.benefitTypeIdFilterItems.length) {
    categories.push(buildCategory('Benefit type ID', filter.benefitTypeIdFilterItems))
  }

  return {
    heading: {
      text: 'Selected filters'
    },
    clearLink: {
      text: 'Clear filters',
      href: '/filter'
    },
    categories: categories
  }
}
const getSingleFilterItem = (url, path , key, value) => {
  const searchParams = url.split('?')[1] || ''
  const urlSearchParams = new URLSearchParams(searchParams)
  urlSearchParams.delete(key)
  return [{
    href: path + urlSearchParams.toString(),
    text: value
  }]
}
const getManyFilterItems = (url, path , key, values) => {
  const searchParams = url.split('?')[1] || ''
  let items=[]
  values.forEach(value => {
    const urlSearchParams = new URLSearchParams(searchParams)
    urlSearchParams.set(
        key,
        urlSearchParams
        .get(key)
        ?.split(',')
        .filter(colour => colour !== value)
        .join(',')
    )

    // Remove if no other option
    if (urlSearchParams.get(key) === '') {
      urlSearchParams.delete(key)
    }

    items.push({
      href: path + urlSearchParams.toString(),
      text: value
    })
  })
  return items
}
const getBenefitTypeIds = (types=[]) => {
  let items = []
  benefitTypeIdOptions.forEach(item => {
    const checked= types.includes(item)
    items.push({
      value: item,
      text: item,
      checked: checked
    })
  })
  return items
}
const normaliseCheckBoxes = (types) => {
  if (!Array.isArray(types)) {
    return ''
  }
  return types.filter(type => type !== '_unchecked').join(',')
}
const isSelectedFilter = (filter) => {
  return filter.firstNameFilter.length ||
      filter.surnameFilter.length ||
      filter.postcodeFilter.length ||
      filter.niNumberFilter.length ||
      filter.benefitTypeIdFilterItems.length
}
const buildCategory = (text, filter) => {
  return {
    heading: {
      text: text
    },
    items: filter
  }
}

module.exports = {
  filterCustomers,
  buildUrlWithQueries,
  buildSelectedFilters,
  getSingleFilterItem,
  getManyFilterItems,
  getBenefitTypeIds
}
