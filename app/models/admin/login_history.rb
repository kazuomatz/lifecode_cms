#  Admin::LoginHistory
#  Generated by LifeCodeCMS FormAttributes Generator

module Admin
  class LoginHistory < LoginHistory
    class << self
      def search(params)
        objects = self.all
        if params[:name].present?
          objects = objects.where('name like ?', "%#{params[:name]}%")
        end
        if params[:status].present? && params[:status].to_i != 99
          objects = objects.where(status: params[:status])
        end

        if params[:start_at].present?
          start_at = params[:start_at]
          if params[:start_at_time].present?
            start_at += ' ' + params[:start_at_time]
          end
          objects = objects.where('created_at >= ?', Time.zone.parse(start_at))
        end

        if params[:end_at].present?
          end_at = params[:end_at]
          if params[:end_at_time].present?
            end_at += ' ' + params[:end_at_time]
          end
          objects = objects.where('created_at <= ?', Time.zone.parse(end_at))
        end

        objects
      end
    end
  end
end