require 'csv'
require 'nkf'

module Migration
  class City < ApplicationRecord
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

      def update_2019
        p '平成28年10月10日 宮城県黒川郡富谷町　=>  宮城県富谷市'

        city = City.where(code: 44237).first
        if city.present?
          city.name = '富谷市'
          city.code = 042161
          city.kana = 'トミヤシ'
          city.hiragana = 'とみやし'
          city.save
        end

        p '平成30年10月1日 福岡県筑紫郡那珂川町 => 福岡県那珂川市'
        city = City.where(code: 403059).first
        if city.present?
          city.code = 402311
          city.name = '那珂川市'
          city.kana = 'ナカガワシ'
          city.hiragana = 'なかがわし'
          city.save
        end

        p '令和元年5月1日 兵庫県篠山市　=> 兵庫県丹波篠山市'
        city = City.where(code: 282219).first
        if city.present?
          # コード変更なし
          city.name = '丹波篠山市'
          city.kana = 'タンバササヤマシ'
          city.hiragana = 'たんばささやまし'
          city.save
        end
      end
    end
  end
end