require 'csv'
require 'nkf'

u = User.create(name:'システム管理者',email:'admin@lifecode.jp',password:'l1f3c0d3',role:1)
u.confirmed_at = DateTime.now
u.save

# 都道府県マスター作成・市区町村マスター更新
CSV.open(File.join(Rails.root, 'data', 'city.csv'), headers: :first_row).each do |row|
  city = City.where(code: row[0]).first
  if city.blank?
    attr = {
        prefecture_id: 0,
        prefecture_code: row[0].slice(0, 2),
        kana: row[3],
        hiragana: row[4],
        code: row[0],
        name: row[2],
        #geom: Point.from_x_y(row[6], row[5])
    }
    City.create!(attr)
  end
end

CSV.open(File.join(Rails.root, 'data', 'prefecture.csv'), headers: :first_row).each do |row|
  prefecture = Prefecture.where(code: row[0]).first
  if prefecture.blank?
    attr = {
        code: row[0],
        name: row[1],
        #geom: Point.from_x_y(row[3], row[2])
    }
    prefecture = Prefecture.create!(attr)
    City.where(prefecture_code: prefecture.code).update_all(prefecture_id: prefecture.id)
  end
end
