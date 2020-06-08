class TopController < PublicController
  layout 'application_public'

  def index

    if current_user.present?
      @inquiry_num = 0
      redirect_to '/admin/top'
    end

  end
end
