class AddLocations < ActiveRecord::Migration[5.0]
  def change
    create_table :locations do |t|
      t.float :longitude
      t.float :latitude
      t.integer :city_id
      t.string :name
      t.timestamps
    end
  end
end
