require 'rails_helper'

describe MeasurementsController do
  describe '#chart_data' do
    let(:correct_location) { create(:location) }
    let!(:measurement_1) { create(:measurement, location: correct_location) }
    let!(:measurement_2) { create(:measurement, created_at: 4.days.ago) }
    let!(:measurement_3) { create(:measurement) }

    let(:call_request) { get :chart_data, params:
      {location_id: correct_location.id} }

    it 'renders JSON with proper measurements for correct location' do
      call_request
      expect(JSON.parse(response.body))
        .to eq([["pm_2_5_value",
                 measurement_1.pm_2_5_value,
                 measurement_1.created_at.strftime('%FT%T.%LZ')],
                ["pm_10_value",
                 measurement_1.pm_10_value,
                 measurement_1.created_at.strftime('%FT%T.%LZ')]])
    end
  end
  
  describe '#current' do
    let(:location) { create(:location, city: city, created_at: DateTime.new(2017, 2, 4, 1)) }
    let(:city) {create (:city) }
    let!(:measurement) { create(:measurement, location: location) }
    let!(:measurement_2) { create(:measurement, created_at: 4.days.ago) }

    let(:call_request) { get :current, params:
      {location_id: location.id} }

    it 'renders JSON with latest measurement for given location' do
      call_request
      expect(JSON.parse(response.body))
        .to eq({"pm_10_value"=> measurement.pm_10_value,
                "pm_2_5_value"=> measurement.pm_2_5_value,
                "date"=>"4-2-2017",
                "time"=>"1:00",
                "location_name"=>location.name,
                "city_name"=>city.name})
    end
  end
end
