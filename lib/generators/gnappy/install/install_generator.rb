require 'rails'

module Gnappy
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("../templates", __FILE__)

      desc "Create package.json and gulpfile.js for gnappy projects"

      def create_gulp_and_assets_file
        template 'gulpfile.js', 'gulpfile.js'
        template 'package.json', 'package.json'
      end


      def inject_tag_helpers
        insert_into_file 'app/controllers/application_controller.rb',
                         after: "class ApplicationController < ActionController::Base\n" do
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
          out << "\n"
          out << "#  ignore gnappy stuff"
          out << "\n"
          out << "/node_modules"
          out << "\n"
          out << "/vendor/assets/components"
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
