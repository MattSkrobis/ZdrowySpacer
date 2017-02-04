FactoryGirl.define do
  factory :city do
    sequence(:name) { |n| "city_#{n}" }
  end
end
