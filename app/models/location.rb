class Location < ApplicationRecord
  has_many :measurements
  belongs_to :city
end
