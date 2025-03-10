const benefitTypeIdOptions = ['[Benefit type]', '[Benefit type]']
// TODO - To update this function when a new field has been added
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
  if (query.employer) {
    filteredCustomers = filteredCustomers.filter(customer => customer.employer.includes(query.employer))
  }
  if (query.staffNumber) {
    filteredCustomers = filteredCustomers.filter(customer => customer.staffNumber.includes(query.staffNumber))
  }
  if (query.balance) {
    filteredCustomers = filteredCustomers.filter(customer => customer.vraBalance === parseFloat(query.balance))
  }
  if (query.benefitTypeId) {
    filteredCustomers = filteredCustomers.filter(customer => customer.benefitTypeId.includes(query.benefitTypeId))
  }
  return filteredCustomers
}

// TODO - To update this function when a new field has been added
const buildUrlWithQueries = (path, body) => {
  const firstName = body.firstName !== '' ? 'firstName=' + body.firstName + '&' : ''
  const surname = body.surname !== '' ? 'surname=' + body.surname + '&' : ''
  const postcode = body.postcode !== '' ? 'postcode=' + body.postcode + '&' : ''
  const niNumber = body.niNumber !== '' ? 'niNumber=' + body.niNumber + '&' : ''
  const employer = body.employer !== '' ? 'employer=' + body.employer + '&' : ''
  const staffNumber = body.staffNumber !== '' ? 'staffNumber=' + body.staffNumber + '&' : ''
  const balance = body.balance !== '' ? 'balance=' + body.balance + '&' : ''
  const normaliseBenefitTypeId = normaliseCheckBoxes(body.benefitTypeId)
  const benefitTypeId= normaliseBenefitTypeId !== '' ? 'benefitTypeId=' + normaliseBenefitTypeId + '&' : ''
  return (path + '?' + firstName + surname + postcode + niNumber + benefitTypeId + balance + staffNumber + employer).replace(/&([^&]*)$/, '$1')
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
  if (filter.employerFilter.length) {
    categories.push(buildCategory('Employer', filter.employerFilter))
  }
  if (filter.staffNumberFilter.length) {
    categories.push(buildCategory('Employee staff reference', filter.staffNumberFilter))
  }
  if (filter.balanceFilter.length) {
    categories.push(buildCategory('Amount outstanding', filter.balanceFilter))
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
      filter.employerFilter.length ||
      filter.staffNumberFilter.length ||
      filter.balanceFilter.length ||
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
