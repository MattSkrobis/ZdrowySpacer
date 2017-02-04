class LocationsController < ApplicationController
  def index
    @location = City.find_by(name: 'Pszczyna').locations.first
  end
end
