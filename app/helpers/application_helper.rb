module ApplicationHelper
  def feed_time(time, show_week = false)
    now = Time.now
    days = (now - time).divmod(24 * 60 * 60)
    hours = days[1].divmod(60 * 60)
    minutes = hours[1].divmod(60)
    sec = minutes[1].to_i

    if hours[0].zero? && days[0].zero?
      if minutes[0].zero?
        I18n.t('datetime.distance_in_words.less_than_x_seconds', count: sec)
      else
        I18n.t('datetime.distance_in_words.less_than_x_minutes', count: minutes[0])
      end
    elsif show_week
      format = I18n.t('date.formats.default')
      weeks = I18n.t 'date.abbr_day_names'
      holiday = time.to_date.national_holiday?
      raw "#{time.strftime(format)} (<span class='week week_#{time.wday} #{holiday ? 'week_holiday' : ''}'>#{weeks[time.wday]}</span>) #{time.strftime('%H:%M')}"
    else
      time.strftime(I18n.t('time.formats.short'))
    end
  end

  def week_string(date)
    return raw '<span class="text-week"></span>' if date.nil?
    weeks = I18n.t 'date.abbr_day_names'
    holiday = date.to_date.national_holiday?
    raw "<span class='text-week week week_#{date.wday} #{holiday ? 'week_holiday' : ''}'>(#{weeks[date.wday]})</span>"
  end

  def date_with_week(date)
    format = I18n.t('date.formats.default')
    weeks = I18n.t 'date.abbr_day_names'
    holiday = date.to_date.national_holiday?
    raw "#{date.strftime(format)} (<span class='week week_#{date.wday} #{holiday ? 'week_holiday' : ''}'>#{weeks[date.wday]}</span>)"
  end

  def calendar_icon(date)
    class_name = ''
    begin
      if date.present?
        holiday = date.to_date.national_holiday?
        class_name = "week week_#{date.wday} #{holiday ? 'week_holiday' : ''}"
      end
    rescue
      class_name = ''
    end
    raw "<i class=\"far fa-calendar-alt #{class_name}\"></i>"
  end

  def sanitize_content(html, shorten = false)
    return '' if html.nil?

    sanitize (html.gsub(/(\r\n|\r|\n)/, "<br/>")).replate_url_to_link(shorten)
  end

  def sanitize_content_with_a_tag(html)
    return '' if html.nil?

    sanitize(html.gsub(/(\r\n|\r|\n)/, '<br/>'))
  end

  def distance_str(distance)
    if distance.to_f >= 1.0
      "#{distance.to_s.to_d.floor(2).to_s} km"
    else
      "#{(distance.to_f * 1000.0).to_s.to_d.floor(2).to_s} m"
    end
  end

  def user_role_icon(user)
    if user.administrator_role?
      raw '<i class="fas fa-user-md"></i>'
    elsif user.operator_role?
      raw '<i class="fas fa-user-cog"></i>'
    else
      raw '<i class="fas fa-user"></i>'
    end

  end

  # 改行コード変換
  def nl2br(str)
    str.present? ? sanitize(str).gsub("\r\n", "\n").gsub("\r", "\n").gsub("\n", '<br>').html_safe : ''
  end

  # datetime文字列変換
  def format_datetime(value, format)
    value.present? ? value.strftime(format) : ''
  end

  def get_address_text(object)
    if object.class.name == 'Facility' || object.class.name == 'Company'
      "#{object.prefecture_name} #{object.city_name} #{object.address1} #{object.address2}"
    else
      ''
    end
  end

  def zip_code(zip_code)
    if zip_code.length == 7
      "#{zip_code[0..2]}-#{zip_code[3..6]}"
    else
      ''
    end
  end

  def media_icon(media)
    if media.media_type == 'web'
      raw '<i class="fas fa-home"></i>'
    elsif media.media_type == 'paper'
      raw '<i class="fas fa-book"></i>'
    else
      raw '<i class="fas fa-ticket-alt"></i>'
    end
  end

  def print_flash_alert(object, alert)
    html = '<ul class="flash-alert">'
    if alert.respond_to?('each')
      alert.each do |key, values|
        if values.respond_to?('each')
          values.each do |value|
            if object.respond_to?('form_column') && object.form_column(key).present?
              html += '<li>' + object.form_column(key)[:label] + ' : ' + value.to_s + '</li>'
            else
              html += '<li>' + key.to_s + ' : ' + value.to_s + '</li>'
            end
          end
        else
          html += '<li>' + key.to_s + ' : ' + values.to_s + '</li>'
        end
      end
    else
      html += '<li>' + key.to_s + '</li>'
    end
    html += '</ul>'
    raw html
  end

  def representation_image_path(image)
    Rails.application.routes.url_helpers.rails_representation_path(image, only_path: true)
  end

end
