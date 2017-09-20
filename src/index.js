'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//Define the prompts
var afterMessage = "... <p>Do you want to hear another saying? ... Say 'random' or say 'stop' to end our session.</p>"

var languageStrings = {
    "en": {
        "translation": {
            "SKILL_NAME": "Wise Old Sayings from Antiquity",
            "WELCOME_MESSAGE": "<p>Hello and welcome to %s.</p> <p>Say 'Give me a saying' for a randomly picked old saying.</p>",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say Help Me.",
            "DISPLAY_CARD_TITLE": "Your Wise Old Saying for Today",
            "HELP_MESSAGE": "Say 'Give me a saying' and I will pick a saying for you.",
            "HELP_REPROMPT": "Say 'Give me a saying' and I will pick a saying for you.",
            "STOP_MESSAGE": "Have a good day. Bye now!",
            "SAYING_REPEAT_MESSAGE": "Say Repeat to repeat the last saying or message.",
		}
	}
};

var handlers = {
	//When the app first launches
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
	
	//When the user triggers the random response
	'RandomIntent': function () {
		var randomSaying = require('./random');
		var pickSaying = randomSaying[Math.floor(Math.random() * randomSaying.length)];

		this.attributes['speechOutput'] = pickSaying + "..." + "<audio src='https://s3.amazonaws.com/alexasoundscarnival/alert_chime_bell_light.mp3'/>" + afterMessage;
		this.attributes['repromptSpeech'] = this.t("SAYING_REPEAT_MESSAGE");
		this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
	
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
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
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
	
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
	
};