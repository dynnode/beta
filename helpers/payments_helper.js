/**
 * Created by administrator on 6/13/16.
 */

/**
 * Created by rbmtv on 9/24/15.
 */

"use strict";

var stripe = require('stripe')(' your stripe API key ');

module.exports = {


    stripeCustomerApi: function (stripe_payload, callback) {


        //Get Customer
        //        var stripe_payload = {
        //            stripe_options: {
        //                get_customer: true,
        //                stripe_token: 'tok_189fBy2eZvKYlo2CVbITAsWL'
        //            },
        //            stripe_customer_information: {
        //                customer_stripe_id: ''
        //            }
        //        }

        //Create customer and transaction
        //        var stripe_payload = {
        //            stripe_options: {
        //                create_recurrent_charge: true,
        //                stripe_token: 'tok_189fBy2eZvKYlo2CVbITAsWL'
        //            },
        //            stripe_customer_information: {
        //                email: '',
        //                description: '',
        //                customer_information: '',
        //                plan: '',
        //                plan_description: '',
        //                coupon: '',
        //                account_balance: '',
        //                amount: 0,
        //                shipping: '',
        //                tax_percent: 0,
        //                trial_end: '',
        //                quantity: 0
        //            },
        //            stripe_charge_information: {
        //                receipt_email: '',
        //                amount: 0,
        //                currency: 'usd',
        //                invoice: '',
        //                order: '',
        //                plan: '',
        //                plan_description: '',
        //                amount_refunded: '',
        //                application_fee: '',
        //                created: ''
        //
        //            }
        //
        //        }

        //Update customer
        //        var stripe_payload = {
        //            stripe_options: {
        //                update_customer: true,
        //                stripe_token: 'tok_189fBy2eZvKYlo2CVbITAsWL'
        //            },
        //            stripe_customer_information: {
        //                customer_stripe_id: '',
        //                email: '',
        //                description: '',
        //                customer_information: '',
        //                plan: '',
        //                plan_description: '',
        //                coupon: '',
        //                account_balance: '',
        //                amount: 0,
        //                shipping: '',
        //                tax_percent: 0,
        //                trial_end: '',
        //                quantity: 0
        //            }
        //
        //        }

        ////Customer List
        //        var stripe_payload = {
        //            stripe_options: {
        //                get_customers_list: true,
        //                stripe_token: 'tok_189fBy2eZvKYlo2CVbITAsWL',
        //                customer_limit: 100
        //            }
        //        }

        if (stripe_payload.create_recurrent_charge) {

            stripe.customers.create(stripe_payload.stripe_customer_information).then(function (customer) {

                /**
                 *
                 * @type {internals.credentials.dh37fgj492je.id|*|Session.id|credentials.id|result.id|id}
                 */
                stripe_payload.stripe_charge_information.description = stripe_payload.stripe_charge_information.plan_description;
                stripe_payload.stripe_charge_information.metadata = { customer_information: stripe_payload.stripe_charge_information.customer_information };
                stripe_payload.stripe_charge_information.customer = customer.id;

                return stripe.charges.create(stripe_payload.stripe_charge_information);

            }).then(function (charge) {
                    callback(charge);
                }).catch(function (err) {
                    callback(err);
                });

        } else if (stripe_payload.get_customer) {
            if (stripe_payload.stripe_customer_information.customer_stripe_id) {
                callback({
                    statuserror: 400,
                    message: 'Please provide the stripe id of the customer'
                });
            } else {
                stripe.customers.retrieve(
                    stripe_payload.stripe_customer_information.customer_stripe_id,
                    function (err, customer) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(customer);
                        }
                    }
                );
            }
        } else if (stripe_payload.get_customers_list) {
            if (stripe_payload.stripe_options.customer_limit) {
                callback({
                    statuserror: 400,
                    message: 'Please provide the limit amount'
                });
            } else {
                stripe.customers.list(
                    { limit: stripe_payload.stripe_options.customer_limit },
                    function (err, customers) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(customers);
                        }
                    }
                );
            }
        } else if (stripe_payload.update_customer) {
            stripe.customers.update(stripe_payload.stripe_customer_information.customer_stripe_id, stripe_payload.stripe_customer_information, function (err, customer) {
                if (err) {
                    callback(err);
                } else {
                    callback(customer);
                }
            });

        } else {
            callback({
                statuserror: 400,
                message: 'Please provide the stripe_options'
            });
        }


    },
    stripeChargesApi: function (stripe_payload, callback) {

//        //Update customer
//        var stripe_payload = {
//            stripe_options: {
//                create_charge: true,
//                stripe_token: 'tok_189fBy2eZvKYlo2CVbITAsWL'
//            },
//            stripe_customer_information: {
//                customer_stripe_id: '',
//                description: 'Charge for test@example.com',
//                amount: '',
//                currency: 'usd',
//                receipt_email: '',
//                shipping: ''
//            }
//
//        }

//        var stripe_payload = {
//            stripe_options: {
//                retrieve_charge: true
//            },
//            stripe_charge_information: {
//                charge_stripe_id: ''
//            }
//
//        }

//        var stripe_payload = {
//            stripe_options: {
//                get_charges_list: true,
//                charges_limit: 100
//            }
//        }
        var stripe_payload = {
            stripe_options: {
                update_charge: true
            },
            stripe_charge_information: {
                charge_stripe_id: '',
                description: '',
                metadata: '',
                receipt_email: '',
                fraud_details: '',
                shipping: 0

            }
        }

        if (stripe_payload.create_charge) {

            stripe_payload.stripe_charge_information.source = stripe_payload.stripe_options.stripe_token;
            stripe.charges.create(stripe_payload.stripe_charge_information, function (err, charge) {
                if (err) {
                    callback(err);
                } else {
                    callback(charge);
                }
            });

        } else if (stripe_payload.get_charge) {
            if (stripe_payload.stripe_charge_information.customer_stripe_id) {
                callback({
                    statuserror: 400,
                    message: 'Please provide the stripe id of the customer'
                });
            } else {
                stripe.charges.retrieve(
                    stripe_payload.stripe_charge_information.charge_stripe_id,
                    function (err, charge) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(charge);
                        }
                    }
                );
            }
        } else if (stripe_payload.get_charges_list) {
            if (stripe_payload.stripe_options.charges_limit) {
                callback({
                    statuserror: 400,
                    message: 'Please provide the limit amount'
                });
            } else {
                stripe.charges.list(
                    { limit: stripe_payload.stripe_options.charges_limit },
                    function (err, customers) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(customers);
                        }
                    }
                );
            }
        } else if (stripe_payload.update_charge) {
            stripe.charges.update(stripe_payload.stripe_charge_information.customer_stripe_id, stripe_payload.stripe_charge_information, function (err, customer) {
                if (err) {
                    callback(err);
                } else {
                    callback(customer);
                }
            });

        } else {
            callback({
                statuserror: 400,
                message: 'Please provide the stripe_options'
            });
        }

    }

}