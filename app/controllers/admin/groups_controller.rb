module Admin
  class GroupsController < Admin::BaseController

    def index

      if request.xhr?
        groups = Admin::Group.search(params).order('id').page(params[:page]).per(20)
        pagination = view_context.paginate(groups, remote: true, window: 1)
        content = render_to_string(partial: 'list.html', locals: { groups: groups })
        render json: { pagination: pagination, content: content, page: params[:page] || 1, status: 'OK' }
      else
        render
      end
    end

    def new
      @group = Admin::Group.new

    end

    def edit
      @group = Admin::Group.find params[:id]

    end

    def create

    end

    def update

    end

    def destroy

    end



  end

end
