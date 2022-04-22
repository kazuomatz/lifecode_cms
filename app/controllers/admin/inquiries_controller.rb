module Admin

  class InquiriesController < BaseController

    def index
      if request.xhr?
        objects = Admin::Inquiry.search()
        objects = objects.includes(:site).order('created_at desc')
        objects = objects.page(params[:page] || 1).per(20)
        pagination = view_context.paginate(objects, remote: true, window: 1)
        content = render_to_string(partial: 'list.html', locals: {objects: objects})
        render json: {pagination: pagination, content: content, page: params[:page] || 1, status: 'OK'}
      end
    end

    def edit
      @inquiry = Admin::Inquiry.find(params[:id])
      if !shop_permitted? @inquiry.site
        raise Forbidden
        return
      end
    end

    def update
      attr = params.require(:admin_inquiry).permit(:is_supported, :supporter_name, :support_note)
      attr[:supported_at] = Time.zone.now
      @inquiry = Admin::Inquiry.find params[:id]
      @inquiry.update attr
      redirect_to admin_inquiries_path
    end

  end

end
