class AddMeasurements < ActiveRecord::Migration[5.0]
  def change
    create_table :measurements do |t|
      t.float :pm_2_5_value
      t.float :pm_10_value
      t.integer :location_id
      t.timestamps
    end
  end
end
