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
  const query = request.query
  const filteredCustomers = filterCustomer(query, customers)
  const view = {
    count: filteredCustomers.length,
    results: transform(filteredCustomers),
    firstName: query.firstName,
    firstNameFilter: query.firstName !== undefined ? getSingleFilterItem(query.firstName): [],
    surname: query.surname,
    surnameFilter: query.surname !== undefined ? getSingleFilterItem(query.surname): [],
    postcode: query.postcode,
    postcodeFilter: query.postcode !== undefined ? getSingleFilterItem(query.postcode): [],
    benefitTypeId: query.benefitTypeId !== undefined ? getBenefitTypeIds(query.benefitTypeId.split(',')) : getBenefitTypeIds([]),
    benefitTypeIdFilterItems: query.benefitTypeId !== undefined? getManyFilterItems(query.benefitTypeId.split(',')) : getManyFilterItems([]),
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
const getSingleFilterItem = (text) => {
  return [{
      // TODO - this needs fixing
      href: '/path/to/remove/this',
      text: text
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