#!/usr/bin/env ruby
require 'httparty'
require 'json'
require 'pry'

data = HTTParty.get 'http://localhost:3001/traits',
                    query: { spaces: 10, properties: 10 }

path = File.expand_path '../../fixtures/traits.json', __FILE__
puts "Writing to '#{path}'"
File.write path, JSON.pretty_generate(data)
