/*
 *    JBoss, Home of Professional Open Source
 *    Copyright 2015, Red Hat, Inc., and individual contributors
 *    by the @authors tag. See the copyright.txt in the distribution for a
 *    full listing of individual contributors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *    http://www.apache.org/licenses/LICENSE-2.0
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

var gulp = require('gulp');
var browserSync = require('browser-sync');

var paths = {
    js: './app/**/*.js',
    css: './app/**/*.css',
    html: './app/**/*.html'
};

gulp.task('default', ['browser-sync'], function () {

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch([paths.js, paths.css, paths.html], browserSync.reload);
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "./",
            index: "app/index.html"
        },
        injectChanges: true,
        open: false
    });
});
