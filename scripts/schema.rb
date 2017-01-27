#!/usr/bin/env ruby

require 'httparty'
require 'json'

schema = HTTParty.get "http://localhost:3001/graphql/schema"

File.write "/data/src/pi-base-frontend/data/schema.json", JSON.pretty_generate(schema)
