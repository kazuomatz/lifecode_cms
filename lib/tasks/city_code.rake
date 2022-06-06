namespace :city_code do
	desc "2019年市区町村コード更新"
	task update_2019: :environment do
		Migration::City.update_2019
	end
end
