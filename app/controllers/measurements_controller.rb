class MeasurementsController < ApplicationController
  def chart_data
    render json: measurements.to_json
  end

  def current
    puts measurement
    render json: ::MeasurementSerializer.new(measurement).to_json
  end

  private

  def measurements
    data = Measurement.where('created_at >= ? AND location_id = ?',
                                       3.days.ago, params[:location_id])
    data.pluck(:pm_2_5_value, :created_at)
        .map {|measurement| measurement.unshift('pm_2_5_value')} +
    data.pluck(:pm_10_value, :created_at)
        .map {|measurement| measurement.unshift('pm_10_value')}
  end

  def measurement
    Measurement.where(location_id: params[:location_id]).order(:created_at).last
  end
end
