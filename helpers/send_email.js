/**
 * Created by William Diaz on 9/24/15.
 */

"use strict";

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'user@gmail.com',
        pass: 'password'
    }
});

module.exports = {

    /**
     * Email sender
     * @param sender_email
     * @param receiver_email
     * @param subject
     * @param htmlbody
     */
    sendEmail: function (sender_email, receiver_email, subject, htmlbody, callback) {


        // setup e-mail data with unicode symbols
        var data = {
            from: sender_email, // sender address
            to: receiver_email, // list of receivers
            subject: subject, // Subject line
            html: htmlbody // html body
        };

        transporter.sendMail(data, callback)
    }

}

