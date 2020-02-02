class CreateInquiries < ActiveRecord::Migration[6.0]
  def change
    create_table :inquiries do |t|
      t.string :inquiry_type, comment: '問い合わせ区分'
      t.string :name, comment: '問い合わせ者氏名'
      t.string :name_kana, comment: '問い合わせ者氏名カナ'
      t.string :email, comment: '問い合わせ者メール'
      t.string :tel, comment: '問い合わせ者電話番号'
      t.string :company_name, comment: '会社名'
      t.string :company_section, comment: '部署名'
      t.string :company_post, comment: '肩書き'
      t.string :zip_code
      t.string :prefecture_code
      t.string :prefecture_name
      t.string :city_code
      t.string :city_name
      t.string :address_1
      t.string :address_2
      t.text :content, comment: '問い合わせ内容'
      t.boolean :is_supported, default: false, comment: '対応済み'
      t.datetime :supported_at, comment: '対応完了日'
      t.string :supporter_name, comment: '対応者氏名'
      t.text :support_note, comment: '対応内容備考'
      t.timestamps
    end
  end
end
