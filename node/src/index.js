'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined;
var SKILL_NAME = 'data guru';
var categories = require('./categories');
var $ = require('./jquery-2.2.4.min.js');
var endJson, speechOutput, repromptSpeech;

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can request a dataset by saying something like, give me a dataset on' +
            ' education in toronto ... Now, what can I help you with.';
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'DatasetIntent': function () {
      var category = this.event.request.intent.slots.category;
      var place = this.event.request.intent.slots.place;
      var categoryName, placeName;
      var randomVal = Math.floor(Math.random() * Object.keys(categories).length);
      var cat = categories[Object.keys(categories)[randomVal]];
      var isLast = false;

      if (category && category.value) {
        categoryName = category.value.toLowerCase();
      } else {
        speechOutput = 'Please tell me a category, such as' + cat;
        repromptSpeech = 'Please say a category';
        this.emit(':ask', speechOutput, repromptSpeech);
      }

      if (place && place.value) {
        placeName = place.value.toLowerCase();
      } else {
        speechOutput = 'Please tell me a place, such as seattle';
        repromptSpeech = 'Please say a place';
        this.emit(':ask', speechOutput, repromptSpeech);
      }

      if (placeName && categoryName) {
        var reqData = {
          place: placeName,
          category: categoryName
        }

        var jsonBody = {
          return_list: isLast,
          requestData: reqData
        };

        $.ajax({
          url: 'https://2mui4yrf7i.execute-api.us-east-1.amazonaws.com/prod/mytestresource',
          data: jsonBody,
          success: nextStep,
          dataType: 'json'
        });
      }

      function nextStep (data) {
        endJson = data;
        speechOutput = 'I have recieved information. Do you want me to send it to your email? Or refine the results?';
        repromptSpeech = 'Do you want to keep refining?';
        this.emit(':ask', speechOutput, repromptSpeech);
      }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask for datasets such as, education, government, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, toronto, seattle, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Email sent!');
    }
};


// send a set of keywords to search api

//domain category
//things to return from domain cat

// alexa get request
// tell guru to give me a dataset on _______ domain
// responds with list of subcategories
// user says category
// new request is what the user says
// repeat * infinity

// where are you looking for inormation from?
//
