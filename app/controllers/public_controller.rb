# This is Public Controller

class PublicController < ApplicationController
  # error_class
  before_action :set_variant

  class Forbidden < StandardError;
  end

  # rescue_from
  if Rails.env.production?
    rescue_from Exception, with: :rescue_500
    rescue_from ActionController::RoutingError, with: :rescue_404
    rescue_from ActiveRecord::RecordNotFound, with: :rescue_404
  end
  rescue_from Forbidden, with: :rescue_403

  private

  def rescue_403(error = nil)
    logger.info "Rendering 403 with exception: #{error.message}" if error
    @error = error
    respond_to do |format|
      format.html { render 'error/forbidden', status: :forbidden, layout: 'application_public', content_type: 'text/html' }
      format.json { render json: {error: '403 error'}, status: :forbidden }
    end
  end

  def rescue_404(error = nil)
    logger.info "Rendering 404 with exception: #{error.message}" if error
    @error = error
    respond_to do |format|
      format.html { render 'error/not_found', status: :not_found, layout: 'application_public', content_type: 'text/html' }
      format.json { render json: {error: '404 error'}, status: :not_found }
    end
  end

  def rescue_500(error = nil)
    @error = error
    respond_to do |format|
      format.html { render file: 'error/internal_server_error', status: :internal_server_error, layout: 'application_public', content_type: 'text/html' }
      format.json { render json: {error: '500 error'}, status: :internal_server_error }
    end
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

  protected

  def set_site
    if params[:alias].blank?
      @site = Site.default
      @company = Company.default
    else
      @site = Site.where(alias: params[:alias]).first
      raise ActiveRecord::RecordNotFound if @site.nil? || (current_user.nil? && @site.publish == false)
      @company = @site.company
    end
    if @company.redirect_url.present?
      redirect_to @company.redirect_url
      return
    end
    set_color
  end

  def set_color
    @border_color_primary = @site.primary_color
    @background_primary = @site.primary_color
    @color_primary = @site.primary_color
    @background_primary_light = @site.primary_light_color
    @background_accent = @site.accent_color
  end

end
