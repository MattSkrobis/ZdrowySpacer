class AddPm10ValueToMeasurements < ActiveRecord::Migration[5.0]
  def up
    add_column :measurements, :pm_10_value, :float
    rename_column :measurements, :value, :pm_2_5_value
  end

  def down
    remove_column :measurements, :pm_10_value
    rename_column :measurements, :pm_2_5_value, :value
  end
end
