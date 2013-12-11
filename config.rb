saved = environment
if (environment.nil?)
  environment = :development
else
  environment = saved
end

css_dir = "newcss"
sass_dir = "sass"
images_dir = "newimg"
generated_images_dir = images_dir + "/generated"

require 'compass-normalize'
require 'rgbapng'
require 'toolkit'
require 'sass-globbing'

output_style = (environment == :production) ? :expanded : :nested

relative_assets = true

line_comments = (environment == :production) ? false : true

sass_options = (environment == :production) ? {} : {:debug_info => true}
