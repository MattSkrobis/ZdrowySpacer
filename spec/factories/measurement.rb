FactoryGirl.define do
  factory :measurement do
    sequence(:pm_10_value) { |n| rand(100).to_f }
    sequence(:pm_2_5_value) { |n| rand(100).to_f }
    association(:location)
  end
end
