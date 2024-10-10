//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()


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
  const query = request.query
  const url = buildUrlWithQueries('/filter', request.query)
  const view = {
    count: customers.length,
    results: transform(customers),
    firstName: query.firstName,
    types: query.types !== undefined ? getTypes(query.types.split(',')) : getTypes([]),
    typeFilterItems: query.types !== undefined? getTypeFilterItems(query.types.split(',')) : getTypeFilterItems([]),
  }
  response.render('/filter', view)
})

router.post('/filter', function(request, response) {
  const body = request.body
  response.redirect(buildUrlWithQueries('/filter', body))
})
const buildUrlWithQueries = (path, body) => {
  const firstName = body.firstName !== '' ? 'firstName=' + body.firstName + '&' : ''
  const normaliseTypes = normaliseCheckBoxes(body.types)
  const types= normaliseTypes !== '' ? 'types=' + normaliseTypes + '&' : ''
  return (path + '?' + firstName + types).replace(/&([^&]*)$/, '$1')
}
const normaliseCheckBoxes = (types) => {
  if (!Array.isArray(types)) {
    return ''
  }
  return types.filter(type => type !== '_unchecked').join(',')
}

const getTypeFilterItems = (types=[]) => {
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

const options = ['Blue', 'Yellow', 'Red']
const getTypes = (types=[]) => {
  let items = []
  options.forEach(item => {
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