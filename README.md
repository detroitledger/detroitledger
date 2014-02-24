To run:

`python -m SimpleHTTPServer`

=======
## Dev notes

`bundle install` to get dependencies.

To watch the SASS, run `sass --watch sass/styles.scss:newcss/styles.css`

Before committing, run `compass compile -e production --force` so our production css looks decent and isn't changed for no reason every build :)

Zepto built with `MODULES='zepto event ie fx fx_methods' npm run-script dist`

