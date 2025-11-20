//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const filterService = require('./services/filterService')

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

// TODO - To update this function when a new field has been added
router.get('/filter', function(request, response) {
  const customers = request.session.data['customers']

  const query = request.query
  const filteredCustomers = filterService.filterCustomers(query, customers)
  const benefitTypeIds =  query.benefitTypeId !== undefined ? filterService.getBenefitTypeIds(query.benefitTypeId.split(',')) : filterService.getBenefitTypeIds([])
  const firstNameFilter = query.firstName !== undefined ? filterService.getSingleFilterItem(request.url, '/filter?','firstName', query.firstName): []
  const surnameFilter= query.surname !== undefined ? filterService.getSingleFilterItem(request.url, '/filter?','surname', query.surname): []
  const postcodeFilter= query.postcode !== undefined ? filterService.getSingleFilterItem(request.url, '/filter?','postcode', query.postcode): []
  const niNumberFilter= query.niNumber !== undefined ? filterService.getSingleFilterItem(request.url, '/filter?','niNumber', query.niNumber): []
  const employerFilter= query.employer !== undefined ? filterService.getSingleFilterItem(request.url, '/filter?','employer', query.employer): []
  const staffNumberFilter= query.staffNumber !== undefined ? filterService.getSingleFilterItem(request.url, '/filter?','staffNumber', query.staffNumber): []
  const balanceFilter= query.balance !== undefined ? filterService.getSingleFilterItem(request.url, '/filter?','balance', query.balance): []
  const benefitTypeIdFilterItems = query.benefitTypeId !== undefined? filterService.getManyFilterItems(request.url, '/filter?','benefitTypeId', query.benefitTypeId.split(',')) : []
  const view = {
    count: filteredCustomers.length,
    results: filteredCustomers,
    firstName: query.firstName,
    surname: query.surname,
    postcode: query.postcode,
    niNumber: query.niNumber,
    employer: query.employer,
    staffNumber: query.staffNumber,
    balance: query.balance,
    benefitTypeIds,
    selectedFilters: filterService.buildSelectedFilters({
      firstNameFilter,
      surnameFilter,
      postcodeFilter,
      niNumberFilter,
      employerFilter,
      staffNumberFilter,
      balanceFilter,
      benefitTypeIdFilterItems
    })
  }
  response.render('/filter', view)
})

router.post('/filter', function(request, response) {
  const body = request.body
  // response.redirect(filterService.buildUrlWithQueries('/filter', body))
})

// Add your routes here