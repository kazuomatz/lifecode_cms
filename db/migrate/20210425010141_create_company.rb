class CreateCompany < ActiveRecord::Migration[6.1]
  def change
    create_table :companies do |t|
      t.string :name, comment: '会社名'
      t.string :kana, comment: '会社名カナ'
      t.text :description, comment: '会社概要'
      t.string :zip_code, comment: '郵便番号'
      t.string :prefecture_code, comment: '都道府県'
      t.string :prefecture_name, comment: '都道府県名'
      t.string :city_code, comment: '市区町村'
      t.string :city_name, comment: '市区町村名'
      t.string :address1, comment: '町名番地'
      t.string :address2, comment: '建物など'
      t.string :email, comment: 'メールアドレス'
      t.string :url, comment: 'サイトURL'
      t.string :president_name, comment: '代表者氏名'
      t.datetime :establishment_at, comment: '設立年月日'
      t.integer :capital, comment: '資本金'
      t.timestamps
    end
  end
end
