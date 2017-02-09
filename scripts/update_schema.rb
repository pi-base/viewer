#!/usr/bin/env ruby
require 'httparty'
require 'json'
require 'fileutils'
require 'pry'

data = HTTParty.get 'http://localhost:3001/graphql/schema'
unless data.code == 200
  warn "Error: #{data.lines.first(20).join}"
  exit 1
end

path = File.expand_path '../../node_modules/.cache', __FILE__
warn "Removing: '#{path}'"
FileUtils.rm_rf path

path = File.expand_path '../../config/schema.json', __FILE__
warn "Writing to '#{path}'"
File.write path, JSON.pretty_generate(data)
