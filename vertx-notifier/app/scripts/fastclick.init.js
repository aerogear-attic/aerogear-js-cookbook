/*global define */
define(['jquery', 'fastclick'], function ($, FastClick) {
    'use strict';

    $(function() {
        FastClick.attach(document.body);
    });
});
