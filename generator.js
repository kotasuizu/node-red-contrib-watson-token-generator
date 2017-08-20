/**
 * Copyright (c) 2017 Kota Suizu
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 **/

module.exports = function(RED) {
  "use strict";
  var WatsonAuth = require('watson-developer-cloud/authorization/v1');


  // WatsonTokenGenerator NodeIO処理
  function WatsonTokenGenerator(n) {
    RED.nodes.createNode(this, n);

    this.service = n.service;

    var credentials = this.credentials;
    if ((credentials) && (credentials.hasOwnProperty("username"))) {
        this.username = credentials.username;
    }
    if ((credentials) && (credentials.hasOwnProperty("password"))) {
        this.password = credentials.password;
    }

    var node = this;
    this.on('input', function(msg) {
      new WatsonAuth({
        username: node.username,
        password: node.password,
        url: node.service
      }).getToken((err, token) => {
        if (err) {
          node.error('Error retrieving token: ' + err.message);
        } else {
          // note: tokens are percent-encoded already and must not be double-encoded
          msg.payload = token;
          node.send(msg);
          node.log(RED._('Succeeded to generate token.'));
        }
      });
    });
  }
  RED.nodes.registerType("Watson-Token-Generator", WatsonTokenGenerator, {
    credentials: {
      username: {
        type: "text"
      },
      password: {
        type: "password"
      }
    }
  });

}
