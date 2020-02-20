module Admin
  class UsersController < Admin::BaseController
    layout 'application'

    before_action  :authenticate_user!, except: [:confirm_user]
    before_action  :check_execute_permission, except: [:confirm_user]
    before_action  :permit_params, only: %i[create update]
    before_action  :permit_confirm_params, only: :confirm_user
    def index
      if request.xhr?
        users = Admin::User.search(params).order('name_kana').page(params[:page]).per(20)
        # users = users.landing_page(params[:landing_page] || 1).per(20)
        pagination = view_context.paginate(users, remote: true, window: 1)
        content = render_to_string(partial: 'list.html', locals: { users: users })
        render json: { pagination: pagination, content: content, page: params[:page] || 1, status: 'OK' }
      else
        render
      end
    end

    def new
      flash[:alert] = nil
      @user = Admin::User.new
      @user.groups_users.build
      @group_ids = []
    end

    def edit
      @user = Admin::User.where(id: params[:id]).first
      @user.groups_users.build
      @group_ids = @user.groups.pluck(:id)
      rescue_404 if @user.blank?
      rescue_403 if current_user.normal_role? && @user.id != current_user.id
    end

    def create
      if User.where(email: @attr[:email]).first
        @user = Admin::User.new(@attr)
        flash[:alert] = 'このメールアドレスは登録済みです。'
        render template: 'admin/users/new'
        return
      end

      @user = Admin::User.new(@attr)
      @user.confirmation_token = SecureRandom.hex(10)
      @user.password = SecureRandom.hex(10)
      @user.save!
      set_groups
      redirect_to admin_users_path
    end

    def update
      @user = Admin::User.where(id: params[:id]).first
      if @user.present?
        if @attr[:password] != @attr[:password_confirmation]
          flash[:alert] = '入力されたパスワードが一致しません'
          render template: 'users/edit'
        else
          begin
            if @user.update(@attr)
              set_groups
              redirect_to admin_users_path
            else
              flash[:alert] = user.errors.message
              render template: 'users/edit'
            end
          rescue StandardError => e
            rescue_500(e)
          end
        end
      else
        rescue_404
      end
    end

    def confirm_user
      @user = Admin::User.where(id: params[:id]).first
      if @user.update_attributes(@attr)
        @user.confirm
        sign_in(@user)
        redirect_to admin_rallies_path
      else
        @user.errors
      end
    end

    def lock
      user = Admin::User.find params[:id]
      if request.put?
        user.lock_access!
      elsif request.delete?
        user.unlock_access!
      end
      content = render_to_string(partial: 'lock', locals: { user: user })
      render json: { content: content, status: 'OK' }
    end

    private

    def set_groups
      groups_users = params[:groups_users]
      group_ids = []
      groups_users.keys.each do |key|
        group_ids << groups_users[key][:group_id]
      end
      @user.groups = Group.where(id: group_ids)
    end

    def permit_params
      @attr = params.require('admin_user').permit(:name, :name_kana, :email, :password, :password_confirmation, :role )
      @attr[:email] = @attr[:email].downcase if @attr[:email].present?
      if @attr[:password].blank? || params[:edit_password].nil?
        @attr.delete(:password)
        @attr.delete(:password_confirmation)
      end
    end

    def permit_confirm_params
      @attr = params.require('user').permit( :password, :password_confirmation )
    end

  end
end