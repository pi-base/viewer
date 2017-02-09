#!/usr/bin/env ruby
require 'httparty'
require 'json'
require 'pry'

data = HTTParty.get 'http://localhost:3001/graphql/schema'

path = File.expand_path '../../config/schema.json', __FILE__
puts "Writing to '#{path}'"
File.write path, JSON.pretty_generate(data)
