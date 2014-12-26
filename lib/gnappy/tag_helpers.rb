require 'json'

module Gnappy
  module TagHelpers
    def gnappy_javascript_include_tag(file_name)
      output = ""
      if Rails.env.development? || Rails.env.test?
        gulp_assets["#{file_name}.js"].each do |path|
          if path.include? "*"
            Dir.glob(path).each do|f|
              output = output + "<script type='text/javascript' src='http://localhost:#{Rails.application.config.static_server_port}/#{f}'></script>"
            end
          else
            output = output + "<script type='text/javascript' src='http://localhost:#{Rails.application.config.static_server_port}/#{path}'></script>"
          end
        end
      else
        path = '/assets/build/' + gulp_manifest["#{file_name}.js"]
        output = "<script type='text/javascript' src='#{path}'></script>"
      end
      output.html_safe
    end

    def gnappy_stylesheet_include_tag(file_name)
      output = ""
      if Rails.env.development? || Rails.env.test?
        gulp_assets["#{file_name}.css"].each do |path|
          if path.include? "*"
            Dir.glob(path).each do|f|
              output = output + "<link href='http://localhost:#{Rails.application.config.static_server_port}/#{f}' media='screen' rel='stylesheet'>"
            end
          else
            output = output + "<link href='http://localhost:#{Rails.application.config.static_server_port}/#{path}' media='screen' rel='stylesheet'>"
          end
        end
      else
        path = '/assets/build/' + gulp_manifest["#{file_name}.js"]
        output = "<link href='#{path}' media='screen' rel='stylesheet'>"
      end
      output.html_safe
    end

    private

    def gulp_assets
      @assets ||= if File.exist?(Rails.root.join('assets.json'))
                    file = File.read(Rails.root.join('assets.json'))
                    @assets = JSON.parse(file)
                  else
                    {}
                  end
    end

    def gulp_manifest
      @manifest ||= if File.exist?(Rails.root.join('asset_manifest.json'))
                      file = File.read(Rails.root.join('asset_manifest.json'))
                      @manifest = JSON.parse(file)
                    else
                      {}
                    end
    end
  end
end
