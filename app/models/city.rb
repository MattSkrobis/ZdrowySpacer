class City < ApplicationRecord
  has_many :locations
  validates :name, uniqueness: true
end
