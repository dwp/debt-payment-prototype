//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

const benefitTypeIdOptions = ['TCOP', 'UCOP', 'UCNCA', 'UCBA']

// Logging session data
// This code shows in the terminal what session data has been saved.
router.use((req, res, next) => {
    const log = {
      method: req.method,
      url: req.originalUrl,
      data: req.session.data
    }
    console.log(JSON.stringify(log, null, 2))

  next()
})

// This code shows in the terminal what page you are on and what the previous page was.
router.use('/', (req, res, next) => {
    res.locals.currentURL = req.originalUrl; //current screen
    res.locals.prevURL = req.get('Referrer'); // previous screen

  console.log('folder : ' + res.locals.folder + ', subfolder : ' + res.locals.subfolder  );

    next();
  });

// Routing for the example journey.
router.post('/country-answer', function(request, response) {

  var country = request.session.data['country']
  if (country == "England"){
      response.redirect("example/complete")
  } else {
      response.redirect("example/ineligible")
  }
})






router.get('/filter', function(request, response) {
  const customers = request.session.data['customers']
  // const url = buildUrlWithQueries('/filter', request.query)


  // Given URL with a query string
  // // const url = new URL('/filter?name=John&age=30&colour=Red,Black,Yellow&city=NewYork');
  // const url = new URLSearchParams('name=John&age=30&colour=Red,Black,Yellow&city=NewYork');
  // // Remove the key-value pair (e.g., 'age')
  // url.delete('age');
  // // url.delete('Yellow');
  // // Get the updated URL as a string
  // const updatedUrl = url.toString();
  // console.log(updatedUrl);
  // // Output: "https://example.com/?name=John&city=NewYork"

  const query = request.query
  const filteredCustomers = filterCustomer(query, customers)
  const firstNameFilter = query.firstName !== undefined ? getSingleFilterItem(request.url, '/filter?','firstName', query.firstName): []
  const surnameFilter= query.surname !== undefined ? getSingleFilterItem(request.url, '/filter?','surname', query.surname): []
  const postcodeFilter= query.postcode !== undefined ? getSingleFilterItem(request.url, '/filter?','postcode', query.postcode): []
  const benefitTypeIdFilterItems = query.benefitTypeId !== undefined? getManyFilterItems(query.benefitTypeId.split(',')) : getManyFilterItems([])
  const view = {
    count: filteredCustomers.length,
    results: transform(filteredCustomers),
    firstName: query.firstName,
    firstNameFilter,
    surname: query.surname,
    surnameFilter,
    postcode: query.postcode,
    postcodeFilter,
    benefitTypeId: query.benefitTypeId !== undefined ? getBenefitTypeIds(query.benefitTypeId.split(',')) : getBenefitTypeIds([]),
    selectedFilters: buildSelectedFilters({
      firstNameFilter,
      surnameFilter,
      postcodeFilter,
      benefitTypeIdFilterItems
    })
  }
  response.render('/filter', view)
})

const filterCustomer = (query, customers) => {
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
  if (query.benefitTypeId) {
    filteredCustomers = filteredCustomers.filter(customer => customer.benefitTypeId.includes(query.benefitTypeId))
  }
  return filteredCustomers
}

router.post('/filter', function(request, response) {
  const body = request.body
  response.redirect(buildUrlWithQueries('/filter', body))
})
const buildUrlWithQueries = (path, body) => {
  const firstName = body.firstName !== '' ? 'firstName=' + body.firstName + '&' : ''
  const surname = body.surname !== '' ? 'surname=' + body.surname + '&' : ''
  const postcode = body.postcode !== '' ? 'postcode=' + body.postcode + '&' : ''
  const normaliseBenefitTypeId = normaliseCheckBoxes(body.benefitTypeId)
  const benefitTypeId= normaliseBenefitTypeId !== '' ? 'benefitTypeId=' + normaliseBenefitTypeId + '&' : ''
  return (path + '?' + firstName + surname + postcode + benefitTypeId).replace(/&([^&]*)$/, '$1')
}
const normaliseCheckBoxes = (types) => {
  if (!Array.isArray(types)) {
    return ''
  }
  return types.filter(type => type !== '_unchecked').join(',')
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
const isSelectedFilter = (filter) => {
  return filter.firstNameFilter.length ||
      filter.surnameFilter.length ||
      filter.postcodeFilter.length ||
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
const getManyFilterItems = (types=[]) => {
  let items=[]
  types.forEach(type => {
    items.push({
      // TODO - this needs fixing
      href: '/path/to/remove/this',
      text: type
    })
  })
  return items
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
const transform = (customers) => {
  let results = []
  customers.forEach(customer => {
    results.push({
      name: customer.firstName + ' ' + customer.surname,
      niNumber: customer.niNumber,
      postcode:customer.postcode,
      benefitTypeId:customer.benefitTypeId,
      indNumber:customer.indNumber,
      indDebtBalance:customer.indDebtBalance
    })
  })
  return results
}
  // Add your routes here