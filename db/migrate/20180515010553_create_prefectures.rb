class CreatePrefectures < ActiveRecord::Migration[6.0]
  def change
    create_table :prefectures do |t|
      t.integer :code, null: false, comment: '都道府県コード'
      t.string :name, null: false, comment: '都道府県名'
      t.timestamps
    end

    add_index :prefectures, :code, unique: true
  end
end
