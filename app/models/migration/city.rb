require 'csv'
require 'nkf'

module Migration
  class City
    class << self
      def load_data
        # 都道府県マスター作成・市区町村マスター更新
        CSV.open(File.join(Rails.root, 'data', 'city.csv'), headers: :first_row).each do |row|
          city = Master::City.where(code: row[0]).first
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
            Master::City.create!(attr)
          end
        end
      end
    end
  end
end
