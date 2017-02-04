class MeasurementSerializer < ActiveModel::Serializer
  attributes :pm_10_value, :pm_2_5_value, :date, :time, :location_name, :city_name

  def date
    "#{object.created_at.day}-#{object.created_at.month}-#{object.created_at.year}"
  end

  def time
   "#{object.created_at.hour}:00"
  end

  def location_name
    object&.location&.name
  end

  def city_name
    object&.location&.city&.name
  end
end
