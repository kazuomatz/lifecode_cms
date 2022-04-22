class CreateCities < ActiveRecord::Migration[6.0]
  def change
    create_table :cities do |t|
      t.references :prefecture, null: false
      t.integer :prefecture_code, null: false, comment: '都道府県コード'
      t.integer :code, null: false, comment: '市区町村コード'
      t.string :name, null: false, comment: '市区町村名'
      t.string :kana, comment: '市区町村名カナ'
      t.string :hiragana, comment: '市区町村名ひらがな'
      t.timestamps
    end
    add_index :cities, :code, unique: true
    add_index :cities, :name
    add_index :cities, %i[name prefecture_code], unique: true
  end
end
