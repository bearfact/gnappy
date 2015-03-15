# Gnappy

Gnappy is a rails asset pipeline replacement.  It uses gulp to minify and concat css and js files.  

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
 2. A gulpfile with a compile command.
 3. Some gitignore entries.
 4. a vendor javascript and css file.



## Contributing

1. Fork it ( https://github.com/[my-github-username]/gnappy/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
