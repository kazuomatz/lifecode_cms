require 'csv'
require 'nkf'

module Migration
  class Prefecture
    class << self
      def load_data
        CSV.open(File.join(Rails.root, 'data', 'prefecture.csv'), headers: :first_row).each do |row|
          prefecture = Master::Prefecture.where(code: row[0]).first
          if prefecture.blank?
            attr = {
                code: row[0],
                name: row[1],
            }
            prefecture = Master::Prefecture.create!(attr)
            Master::City.where(prefecture_code: prefecture.code).update_all(prefecture_id: prefecture.id)
          end
        end
      end
    end
  end
end
