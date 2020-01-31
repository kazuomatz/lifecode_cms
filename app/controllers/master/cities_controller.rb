module Master
  class CitiesController < ApplicationController

    # 市町村データ取得
    def show
      cities = Master::City.where(prefecture_code: params[:id])
      if params[:target].present?
        codes = Object.const_get(params[:target]).all.pluck(:city_code).uniq
        cities = cities.where(code: codes)
      end

      cities = cities.order('id').map { |c|
        {name: c.name, id: c.code.to_s, prefecture_id: c.prefecture_id}
      }
      render json: cities
    end

    def index
      cities = Master::City.where(prefecture_code: 22).order('id').map { |c|
        {name: c.name, id: c.code, prefecture_id: c.prefecture_id}
      }
      render json: cities
    end
  end
end
