const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const CryptoJS = require("crypto-js");
const config = require('../../config/config');
const Imap = require('imap');
const sgMail = require('@sendgrid/mail');


generateRandomString10 = () => {
    return Math.random(999).toString(33).substr(10, 20);
}

module.exports.SALT_ROUNDS = 10;

module.exports.imapAuthenticate = async (username, password) => {
    let imap = new Imap({
        user: username,
        password: password,
        host: config.imap.host,
        port: config.imap.port,
        tls: false,
        authTimeout: 30000
    });

    return new Promise((resolve, reject) => {
        imap.once("ready", () => {
            imap.end();
            resolve(true);
        });

        imap.once("error", error => {
            // console.error(error);
            reject(error);
        });

        imap.connect();
    });
};

module.exports.generateRandomString = (length) => {
    randomString = crypto.randomBytes(length).toString('hex');
    return randomString.substr(0, length);
}

const getMailVerificationHtml = (link) => {

    let html = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" type="text/css">
                <title>Pragyan'21</title>
            </head>
            </head>
            <body style="background-color: #e9ecef; font-family: Montserrat !important;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" valign="top" style="padding: 36px 24px;">
                                <a href="https://pragyan.com/">
                                    <img src="https://pragyan.com/assets/logo/pragyan-logo.png" style="height:100px;width:75px">
                                </a>
                                </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                    </tr>
                    <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; border-top: 3px solid #d4dadf;">
                                <h1 style="margin: 0; font-size: 25px; font-weight: 600; letter-spacing: -1px; line-height: 48px;">Hey
                                    <span> there! </span></h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                    </tr>
                    <tr>
                    <td align="center" bgcolor="#e9ecef">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="left" bgcolor="#ffffff" style="padding: 24px;  font-size: 16px; line-height: 24px;">
                                <p style="margin: 0;">
                                    Thank you for registering for Crosswordyan - Pragyan 2021! Please use the following link to activate your account and get started.
                                </p>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" bgcolor="#ffffff">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                            <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                                    <a href=${link} target="_blank" style="display: inline-block; padding: 16px 36px;  font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                                        Verify
                                                    </a>
                                                </td>
                                            </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="left" bgcolor="#fc7303">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td bgcolor="#fc7303" style="padding: 0px;" align="center">
                                            <table border="0" cellpadding="0" cellspacing="5" style="margin-top: 20px; margin-bottom: 15px;">
                                            <tr style="border-bottom: 15px">
                                                <td align="center">
                                                    <a href="https://www.facebook.com/pragyan/">
                                                        <img src="https://pragyan.com/assets/media/facebook-logo-black.png" style="height:30px;width:30px">
                                                    </a>
                                                </td>
                                                <td align="center">
                                                    <a href="https://www.instagram.com/pragyan/">
                                                        <img src="https://pragyan.com/assets/media/instagram-logo-black.png" style="height:30px;width:30px">
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr class="spacer"></tr>
                                            <tr class="spacer"></tr>
                                            <tr>
                                                <td align="center" colspan=2 style="font-size: 13px; color: rgba(18,18,18,0.8); font-weight: 500"> &copy; Pragyan 2021 </td>
                                            </tr>
                                            <tr>
                                                <td align="center" colspan=2 style="font-size: 13px; color: rgba(18,18,18,0.8); font-weight: 500">All rights reserved</td>
                                            </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                    </tr>
                    <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                            <tr>
                                <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px;  font-size: 14px; line-height: 20px; color: #666;">
                                <p style="margin: 0;">You received this email because we received a request for registration with your email account. If you didn't register you can safely delete this email.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                    </tr>
                </table>
            </body>
        </html>
        `

    return html;
}

module.exports.sendMail = async(email, verificationCode) => {
    let html = getMailVerificationHtml(
        `${config.baseUrl}user/verify?email=${email}&code=${verificationCode}`
        )
    sgMail.setApiKey(config.sendgrid.apiKey);
    const data = {
        from: config.sendgrid.FromAddress,
        to: email,
        subject: 'Verify your email : Crosswordyan-21 - Pragyan 2021',
        html: html
    }
    return new Promise((resolve, reject) => {
        sgMail.send(data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log("mail sent!");
                resolve();
            }
        });
    })

}

module.exports.sendMailForNewPassword = (email,uniq_id) => {
    sgMail.setApiKey(config.sendgrid.apiKey);
    const data = {
        from: config.sendgrid.FromAddress,
        to: email,
        subject: 'Password Reset',
        html: `You have requested to change your password,click the link ${config.baseUrl+'user/resetpassword/'+uniq_id} to reset your password !`
    }
    return new Promise((resolve, reject) => {
        sgMail.send(data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })

}

module.exports.encryptString = async (string, password) => {
    let encryptedString = CryptoJS.AES.encrypt(string, password).toString();
    return encryptedString;
}

module.exports.decryptString = async (string, password) => {
    let decryptedString = CryptoJS.AES.decrypt(encryptedString, password);
    decryptedString = decryptedString.toString(CryptoJS.enc.Utf8);
    return decryptedString;
}

module.exports.CustomError = class CustomError extends Error {
    constructor(...params) {
        super(...params);
    }
}
