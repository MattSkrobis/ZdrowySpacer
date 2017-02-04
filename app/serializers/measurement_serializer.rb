class MeasurementSerializer < ActiveModel::Serializer
  attributes :pm_10_value, :pm_2_5_value, :created_at, :location_name, :city_name

  def created_at
    Time.new(object.created_at.year,
            object.created_at.month,
            object.created_at.day,
            object.created_at.hour)
  end

  def location_name
    object&.location&.name
  end

  def city_name
    object&.location&.city&.name
  end
end
