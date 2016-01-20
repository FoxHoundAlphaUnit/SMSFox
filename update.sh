echo -n 'Compiling SASS files... '
sass css/app.sass > css/app.css
echo 'Done'

echo 'Minifying files... '
minify css/app.css
minify css/libs/materialize.css
minify js/app.js
echo 'Done minifying'