class Measurement < ApplicationRecord
  include ActiveModel::Serialization

  belongs_to :location
end
