class ChangePmFloatsToInts < ActiveRecord::Migration[5.0]
  class AddPm10ValueToMeasurements < ActiveRecord::Migration[5.0]
    def change
      change_column :measurements, :pm_10_value, :integer
      change_column :measurements, :pm_2_5_value, :integer
    end
  end
end
