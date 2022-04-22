module Admin
  class BaseController < ApplicationController
    before_action :authenticate_user!, :set_cache_headers, :check_execute_permission
    layout 'application'
    before_action :clear_flush, only: %i[new edit]
    before_action :configure_permitted_parameters, if: :devise_controller?
    before_action :set_variant
    before_action :inquiry_num

    protected

    @inquiry_num = 0

    # キャッシュ設定
    def set_cache_headers
      response.headers['Cache-Control'] = 'no-cache, no-store'
      response.headers['Pragma'] = 'no-cache'
    end

    def check_execute_permission
      unless request.xhr?
        raise Forbidden unless current_user.role == Settings.admin.user.role_value.adminiatrator || check_permission
      end
    end

    # 権限チェック
    def check_permission
      keys = [controller_name, action_name]
      permissions = Settings.permission.to_h

      (0..(keys.length - 1)).each do |index|
        key = keys[index].to_sym
        return false unless permissions.key?(key)

        if permissions[key].is_a?(String)
          return !permissions[key].slice(1..(permissions[key].length)).split(',').include?(current_user.role.to_s) if permissions[key][0] == '!'

          return permissions[key].split(',').include?(current_user.role.to_s)
        end
        permissions = permissions[key].to_h
      end
      false
    end

    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_in, keys: %i[name email password password_confirmation])
      devise_parameter_sanitizer.permit(:sign_up, keys: %i[name email])
      devise_parameter_sanitizer.permit(:account_update, keys: %i[name email password password_confirmation image])
    end

    def inquiry_num
      @inquiry_num = Admin::Inquiry.where(is_supported: false).length unless request.xhr?
    end

    # error_class
    class Forbidden < StandardError;
    end

    # rescue_from
    # if Rails.env.production?
    rescue_from Exception, with: :rescue_500 if Rails.env == 'production'
    rescue_from ActionController::RoutingError, with: :rescue_404
    rescue_from ActiveRecord::RecordNotFound, with: :rescue_404
    # end
    rescue_from Forbidden, with: :rescue_403

    private

    def rescue_403(error = nil)
      logger.info "Rendering 403 with exception: #{error.message}" if error
      @error = error
      respond_to do |format|
        format.html { render 'error/forbidden', status: :forbidden, layout: 'application', content_type: 'text/html' }
        format.json { render json: {error: '403 error'}, status: :forbidden }
      end
    end

    def rescue_404(error = nil)
      logger.info "Rendering 404 with exception: #{error.message}" if error
      @error = error

      respond_to do |format|
        format.html { render 'error/not_found', status: :not_found, layout: 'application', content_type: 'text/html' }
        format.json { render json: {error: '404 error'}, status: :not_found }
      end
    end

    def rescue_500(error = nil)
      logger.info "Rendering 500 with exception: #{error.message}" if error
      @error = error

      respond_to do |format|
        format.html { render file: 'error/internal_server_error', status: :internal_server_error, layout: 'application', content_type: 'text/html' }
        format.json { render json: {error: '500 error'}, status: :internal_server_error }
      end
    end

    def merge_search_params
      search_params = {}
      params.each do |key, value|
        if key != 'action' && key != 'controller' && key != 'format'
          search_params["ref_#{key}"] = value if value.present?
        end
      end
      search_params
    end

    def clear_flush
      flash[:message] = nil
      flash[:error] = nil
      flash[:alert] = nil
    end

    def set_referer
      session[params[:controller]] = {}
      if request.referer.present?
        path = request.referer.split('?')[0]
        new_params = params.permit!.to_hash.map do |key, value|
          "#{key.to_s.gsub('ref_', '')}=#{value}" if key.to_s.start_with?('ref_')
        end.compact.join('&')
        session[params[:controller]]['return_path'] = path
        session[params[:controller]]['return_path'] += '?' + new_params if new_params.present?
      end
      logger.debug("Session Return : #{params[:controller]} : #{session[params[:controller]]['return_path']}")
    end
  end
end