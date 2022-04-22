# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  layout 'application_sign_in'
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    super
  end

  # POST /resource/sign_in
  def create
    @user = User.where(email: params[:user][:email]).first
    if @user.present?
      if @user.valid_password?(params[:user][:password])

        if @user.lock_expired?
          @user.unlock_access
        end

        if @user.access_locked?
          LoginHistory.create ({
              account: params[:user][:email],
              user_type: 0,
              user_id: @user.id,
              status: -1,
              name: @user.name,
              ip_address: request.remote_ip
          })

          flash[:alert] = t('devise.failure.locked')
          @user = User.new
          @user.email = params[:user][:email]
          set_cache_headers
          render template: 'users/sessions/new'
          return
        end

        bypass_sign_in @user
        LoginHistory.create ({
            account: params[:user][:email],
            user_type: 0,
            user_id: @user.id,
            status: 1,
            name: @user.name,
            ip_address: request.remote_ip
        })

        @user.last_sign_in_at = Time.zone.now
        @user.save

        yield resource if block_given?
        respond_with resource, location: after_sign_in_path_for(@user)
      else
        @user.update_failed_attempts
        LoginHistory.create ({
            account: params[:user][:email],
            user_type: 0,
            user_id: @user.present? ? @user.id : -1,
            status: 0,
            name: @user.present? ? @user.name : '',
            ip_address: request.remote_ip
        })

        flash[:alert] = 'メールアドレスまたはパスワードが違います'
        @user = User.new
        @user.email = params[:user][:email]
        set_cache_headers
        render template: 'users/sessions/new'
      end
    else
      if @user
        @user.update_failed_attempts
        LoginHistory.create ({
            account: params[:user][:email],
            user_type: 0,
            user_id: @user.present? ? @user.id : -1,
            status: 0,
            name: @user.present? ? @user.name : '',
            ip_address: request.remote_ip
        })
      end

      flash[:alert] = 'メールアドレスまたはパスワードが違います'
      @user = User.new
      @user.email = params[:user][:email]
      set_cache_headers
      render template: 'users/sessions/new'
    end
  end

  # DELETE /resource/sign_out
  def destroy
    super
  end

  # キャッシュ設定
  def set_cache_headers
    response.headers['Cache-Control'] = 'no-cache, no-store'
    response.headers['Pragma'] = 'no-cache'
  end
  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end
end
