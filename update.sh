echo -n 'Compiling SASS files... '
sass css/app.sass > app.css
echo 'Done'

echo -n 'Minifying files... '
minify css/app.css css/libs/materialize.css > log.minify.css
minify js/app.js js/server.js > log.minify.js
echo 'Done'