module Admin
  class Inquiry < Inquiry
    class << self
      def search(params = {})
        objects = self.all
        if params[:site_id].present?
          objects = objects.where(site_id: params[:site_id])
        end
        objects
      end
    end
  end
end