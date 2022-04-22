#  Admin::GroupsController
#  Generated by LifeCodeCMS Scaffold Generator
module Admin
  class GroupsController < Admin::BaseController
    layout 'application'
    before_action :authenticate_user!
    before_action :check_execute_permission
    before_action :permit_params, only: %i[create update]
    before_action :set_referer, only: [:edit, :new]
    before_action :set_default_params, only: [:edit, :new, :update, :destroy]

    def index
      if request.xhr?
        groups = Admin::Group.search(params).page(params[:page]).per(20)
        pagination = view_context.paginate(groups, remote: true, window: 1)
        content = render_to_string(partial: 'list.html', locals: {search_params: merge_search_params, groups: groups})
        render json: {pagination: pagination, content: content, page: params[:page] || 1, status: 'OK'}
      else
        render
      end
    end

    def new
      flash[:alert] = nil
      if request.xhr?
        render template: 'admin/groups/modal_form', locals: {group: @group}, layout: false
      else
        render
      end
    end

    def edit
      if request.xhr?
        render template: 'admin/groups/modal_form', locals: {group: @group}, layout: false
      else
        render
      end
    end

    def create
      @group = Admin::Group.new(@attr)
      @group.save!
      if request.xhr?
        render json: {status: 200}
      else
        redirect_to session[params[:controller]] && session[params[:controller]]['return_path'] || admin_groups_path
      end
    end

    def update
      begin
        params.keys.each do |key|
          if key.index('delete_') == 0
            if params[key] == 'true'
              item = key.gsub('delete_admin_', '').gsub('group_', '')
              @attr[item] = nil
            end
          end
        end

        if @group.update(@attr)
          if request.xhr?
            render json: {status: 200}
          else
            redirect_to session[params[:controller]] && session[params[:controller]]['return_path'] || admin_groups_path
          end
        else
          flash[:alert] = @group.errors.message
          render template: 'group/edit'
        end
      rescue StandardError => e
        rescue_500(e)
      end
    end

    def destroy
      @group.destroy
      render json: {status: 200}
    end

    private

    def permit_params
      @attr = params.require('admin_group').permit(
          :name, :description
      )
      Group.form_attributes.select { |column| column[:type] == :datetime || column[:type] == :timestamp }.each do |date_column|
        time = params['admin_group'][date_column[:name] + '_time'] || '00:00'
        @attr[date_column[:name]] = "#{@attr[date_column[:name]]} #{time}"
        @attr.delete(date_column[:name] + '_time')
      end
    end

    def set_default_params
      if params[:action] == 'new'
        @group = Admin::Group.new
      else
        @group = Admin::Group.where(id: params[:id]).first
        if @group.nil?
          rescue_404
          return
        end
      end
      @city_data = {}
      Admin::Group.prefecture_attributes.each do |column|
        if column[:city_column].present?
          if @group.new_record?
            @group[column[:name]] = column[:default_prefecture_code] || 1
            prefecture = Prefecture.where(code: @group[column[:name]]).first
            if column[:default_city_code].blank?
              city = City.where(prefecture_code: prefecture.code).first
            else
              city = City.where(code: column[:default_city_code]).first
            end
            @group[column[:city_column]] = city.code
            @group[column[:name].gsub('_code', '_name')] = prefecture.name
            @group[column[:city_column].gsub('_code', '_name')] = city.name
          end
          @city_data[column[:city_column]] = City.where(prefecture_code: @group[column[:name]]).map { |c| [c.name, c.code, {'data-name' => c.name}] }
        end
      end
    end
  end
end
