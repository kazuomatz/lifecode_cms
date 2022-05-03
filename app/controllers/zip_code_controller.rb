class ZipCodeController < ApplicationController
  def search
    base_url = "https://zipcloud.ibsnet.co.jp/api/search"
    zip_code = params[:zipcode]
    url = "#{base_url}?zipcode=#{zip_code}"
    data = Faraday.get(url)
    if data
      begin
        data = JSON.parse(data.body)
        if data['status'] == 200 && data['results'][0].present?
          render json:  {
              code: 200,
              data: {
                  pref: data['results'][0]['address1'],
                  city: data['results'][0]['address2'],
                  town: data['results'][0]['address3'],
                  address: "#{data['results'][0]['address2']}#{data['results'][0]['address3']}",
                  fullAddress: "#{data['results'][0]['address1']}#{data['results'][0]['address2']}#{data['results'][0]['address3']}"
              }
          }
        else
          render json: {
              code: 404,
              message:  "Address not found."
          }
        end
      rescue
        render json:  {
            code: 500,
            message:  "Internal Server Error."
        }
      end
    else
      render json:  {
          code: 500,
          message:  "Internal Server Error."
      }
    end
  end
end
