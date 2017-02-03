#!/usr/bin/env ruby

require 'httparty'
require 'json'

schema = HTTParty.get "http://localhost:3001/graphql/schema"
path   = File.expand_path '../../data/schema.json', __FILE__

File.write path, JSON.pretty_generate(schema)
