class CreateGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :groups do |t|
      t.string :name, comment: 'name'
      t.string :description, comment: 'description'
      t.timestamp :deleted_at
      t.timestamps
    end
  end
end
