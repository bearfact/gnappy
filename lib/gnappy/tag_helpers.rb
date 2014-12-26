require 'json'

module Gnappy
  module TagHelpers
    def gnappy_javascript_include_tag(sources)
      Rails.logger.info "***************************"
      Rails.logger.info ENV['GNAPPY_ASSETS_ENV']
      if Rails.env.development? || Rails.env.test?
        javascript_include_tag sources
      else
        output = ''
        sources = *sources
        sources.each do |file_name|
          path = '/assets/build/' + gulp_manifest["#{file_name}.js"]
          output = output + "<script type='text/javascript' src='#{path}'></script>"
        end
        output.html_safe
      end
    end

    def gnappy_stylesheet_link_tag(sources)
      if Rails.env.development? || Rails.env.test?
        stylesheet_link_tag sources
      else
        output = ''
        sources = *sources
        sources.each do |file_name|
          path = '/assets/build/' + gulp_manifest["#{file_name}.css"]
          output = output + "<link href='#{path}' media='screen' rel='stylesheet'>"
        end
        output.html_safe
      end
    end



    private

    def gulp_manifest
      @manifest ||= if File.exist?(Rails.root.join('rev-manifest.json'))
                      file = File.read(Rails.root.join('rev-manifest.json'))
                      @manifest = JSON.parse(file)
                    else
                      {}
                    end
      Rails.logger.info @manifest
      @manifest
    end
  end
end
