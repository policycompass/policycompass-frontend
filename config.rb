#config.rb
css_dir = "app/css"
sass_dir = "app/sass"
# extensions_dir  = "sass-extensions"
images_dir = "app/img"
javascripts_dir = "app/js"
sourcemap = (environment == :production) ? false : true
output_style = (environment == :production) ? :compressed : :expanded # :expanded, :nested, :compact, :compressed
