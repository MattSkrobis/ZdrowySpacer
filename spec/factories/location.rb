FactoryGirl.define do
  factory :location do
    sequence(:longitude) { rand(180000).to_f/1000 }
    sequence(:latitude) { rand(180000).to_f/1000 }
    sequence(:name) { |n| "location_#{n}" }
    association(:city)
  end
end
