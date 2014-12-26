# Gnappy

Gnappy is a rails asset pipeline replacement.  It uses gulp and express.  It provides a static server for serving assets in development and a comilation/minification tool for prepare your assets for production.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'gnappy'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install gnappy

## Usage

### Preparing your application

Run the initializer to add the gnappy files to your application:

```ruby
rails g gnappy:install
```
This will add:
 1. A package.json for node modules.
 2. A gulpfile for starting your static server and compiling assets.
 3. A line to your application.rb for the static server port
 4. Some gitignore entries
 5. A scaffold assets.json file (this replaces your sprocket manifest files)



## Contributing

1. Fork it ( https://github.com/[my-github-username]/gnappy/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
