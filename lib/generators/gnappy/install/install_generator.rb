require 'rails'

module Gnappy
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("../templates", __FILE__)

      desc "Create assets json and gulpfile"

      def create_gulp_and_assets_file
        template 'assets.json', 'assets.json'
        template 'gulpfile.js', 'gulpfile.js'
        template 'package.json', 'package.json'
      end

      def inject_static_server_port
        insert_into_file 'config/application.rb',
                         after: "class Application < Rails::Application\n" do
          out = ''
          out << '    # static server port number used by gnappy'
          out << "\n"
          out << '    # if you change this also change the port in the gulpfile'
          out << "\n"
          out << '    config.static_server_port = 5001'
          out << "\n"
          out << "\n"
        end
      end

      def inject_tag_helpers
        insert_into_file 'app/controllers/application_controller.rb',
                         before: 'end' do
          out = ''
          out << '  # tag helpers for gnappy'
          out << "\n"
          out << '  helper Gnappy::TagHelpers'
          out << "\n"
          out << "\n"
        end
      end

      def inject_git_ignore
        append_to_file ".gitignore" do
          out = ""
          out << "#  ignore gnappy stuff"
          out << "\n"
          out << "/node_modules"
          out << "\n"
          out << "/bower_components"
          out << "\n"
          out << "/public/assets/build"
          out << "\n"
          out << "rev-manifest.json"
          out << "\n"
          out << "\n"
        end
      end

    end
  end
end
