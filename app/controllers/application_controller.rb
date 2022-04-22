class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  #before_action :basic
  @inquiry_num = 0
  prepend_view_path Rails.root.join('lib', 'generators', 'lc_scaffold', 'templates')

  protected

  def set_variant
    ua = request.user_agent
    case ua
    when /ip(hone|od)/i
      request.variant = :mobile
    when /ipad/i
      request.variant = :ipad
    when /android.+mobile/i
      request.variant = :mobile
      if (/Linux; U;/i =~ ua) && (/Chrome/i =~ ua).nil?
        @isAndroidBrowser = true
      elsif (/samsungbrowser/i =~ ua)
        @isAndroidBrowser = true
      end
    when /Mac OS X/i
      request.variant = :macos
    else
      request.variant = :pc
    end
  end

  def after_sign_in_path_for(resource)
    '/admin/top/index'
  end

  def basic
    if (Rails.env == 'production' && params[:action] != 'noop')
      authenticate_or_request_with_http_basic do |user, pass|
        user == Settings.basic.user && pass == Settings.basic.password
      end
    else
      true
    end
  end

end
