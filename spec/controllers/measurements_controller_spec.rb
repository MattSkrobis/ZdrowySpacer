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
        .to eq([[measurement_1.pm_2_5_value,
                 measurement_1.created_at.strftime('%FT%T.%LZ')]])
    end
  end
end
