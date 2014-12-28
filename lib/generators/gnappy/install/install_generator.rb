require 'rails'

module Gnappy
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path("../templates", __FILE__)

      desc 'Create package.json and gulpfile.js and other neccessary files for gnappy projects'

      def create_gulp_and_assets_file
        template 'vendor.js', 'app/assets/javascripts/vendor.js'
        template 'vendor.css', 'app/assets/stylesheets/vendor.css'
        template 'gulpfile.js', 'gulpfile.js'
        template 'package.json', 'package.json'
        template '.bowerrc', '.bowerrc'
        run 'npm install'
        run 'bower init'
      end

      def add_vendor_files_to_pipeline
        application 'config.assets.precompile += %w( vendor.js vendor.css)'
      end

      def add_bower_path_to_pipeline
        application "config.assets.paths << Rails.root.join('vendor', 'assets', 'components')"
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
          out << "# ignore gnappy stuff"
          out << "\n"
          out << "/node_modules"
          out << "\n"
          out << "/vendor/assets/components"
          out << "\n"
          out << "/public/assets/build"
          out << "\n"
          out << "/public/assets/*.js"
          out << "\n"
          out << "/public/assets/*.css"
          out << "\n"
          out << "/public/assets/*.json"
          out << "\n"
          out << "\n"
        end
      end
    end
  end
end
