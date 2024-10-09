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
  view = {
    count: 10,
    types: getTypes()
  }
  response.render('/filter', view)
})

router.post('/filter', function(request, response) {
  view = {
    count: 10,
    firstName: body.firstName,
    types: getTypes(body.types),
    status: body.status
  }
  response.render('/filter', view)
})

const types = ['Blue', 'Yellow', 'Red']
const getTypes = (results=[]) => {
  let items = []
  types.forEach((item, index) => {
    const checked= results.includes(item)
    items.push({
      value: item,
      text: item,
      checked: checked
    })
  })
  return items
}
  // Add your routes here