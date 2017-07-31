var express = require('express');
var app = express(); //init Express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Request = require('./app/models/Request');
mongoose.connect('mongodb://toutouastro:toutouastro@ds032887.mlab.com:32887/pokemap');

//init bodyParser to extract properties from POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
//init Express Router
var router = express.Router();
//default/test route
router.get('/toutou', function(req, res) {
  res.json({ message: 'App is running!' });
});

router.route('/requests')

  .get(function(req, res) {
    console.log (req.query.dest_id);
    Request.find({"dest": req.query.dest_id}, function(err, contact) {
      if (err)
        res.send(err);

      console.log (contact);
      res.json(contact);
    });

  })
  // update contact: PUT http://localhost:8080/api/contacts/{id}
  .post(function(req, res) {
        var request = new Request ({"src" :req.body.src, "dest":req.body.dest});
        console.log ({"src" :req.body.src, "dest":req.body.dest});
        request.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Request created!' });
      });

  });

//associate router to url path
app.use('/', router);
//start the Express server
app.listen(port);
console.log('Listening on port ' + port);