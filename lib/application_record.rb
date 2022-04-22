class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  class << self

    def initial_column(column_name)
      column = {}
      column[:name] = column_name
      column[:label] = self.default_label(column[:name])
      column[:icon] = self.default_icon(column[:name])
      column[:type] = self.columns_hash[column_name].type
      column[:column] = 4

      validate = {
          required: false,
          required_message: '',
          max_length: -1,
          max_length_message: '',
          min_length: -1,
          min_length_message: '',
          pattern: '',
          pattern_message: '',
          length: '',
          length_message: ''
      }

      if column_name == 'name' || column_name == 'title'
        validate[:required] = true
      else
        validate[:required] = false
      end

      if column_name.index("zip_code")
        validate[:length] = '[7,7]'
        validate[:length_message] = '郵便番号は7桁で入力して下さい。'
        validate[:pattern] = '/^[0-9]+$/'
        validate[:pattern_message] = '郵便番号は半角数字のみ有効です。'
        z = column_name.split('zip_code')
        column[:prefecture_code] = "#{z[0].nil? ? '' : z[0]}prefecture_code"
        column[:city_code] = "#{z[0].nil? ? '' : z[0]}city_code"
        column[:address1] = "#{z[0].nil? ? '' : z[0]}address1"
        column[:placeholder] = '7桁（ハイフンなし）'
        column[:column] = 3
      elsif column_name.index('prefecture_code')
        column[:default_prefecture_code] = 22
        column[:default_city_code] = 221015
        p = column_name.split('prefecture_code')
        column[:city_column] = "#{p[0].nil? ? '' : p[0]}city_code"
        validate = nil
      elsif column_name.index('city_code')
        c = column_name.split('city_code')
        column[:prefecture_column] = "#{c[0].nil? ? '' : c[0]}prefecture_code"
        validate = nil
      elsif column_name.index('address1')
        column[:placeholder] = '町名番地'
      elsif column_name.index('address2')
        column[:placeholder] = '建物等'
      elsif column_name.index('url')
        column[:type] = :url
        column[:placeholder] = ''
      elsif column_name.index('mail')
        column[:type] = :email
        column[:placeholder] = ''
      elsif column_name.index('tel') || column_name.index('phone')
        validate[:pattern] = '/^[-0-9]+$/'
        validate[:pattern_message] = '電話番号は半角数字とハイフンのみ有効です。'
        column[:placeholder] = ''
      end

      if column[:type] == :spatial || column[:type] == :geometry
        column[:type] == :spatial
        column[:column] = 8
        column[:show_map] = false
        column[:prefecture_column] = ""
        column[:city_column] = ""
        column[:address1_column] = ""
        column[:default_latitude] = 34.973277
        column[:default_longitude] = 138.388772
        validate = nil
      elsif column[:type] == :datetime || column[:type] == :timestamp
        column[:show_time] = false
        column[:date_ui] = :calendar
        column[:min_year] = ''
        column[:max_year] = ''
        column[:default_year] = ''
        column[:column] = 3
        validate = {
            required: false,
            required_message: '',
            datetime_greater: '',
            datetime_greater_message: ''
        }
      elsif column[:type] == :text
        column[:column] = 6
        column[:rows] = 5
        column[:icon] = 'far fa-file-alt'
        column[:placeholder] = ''
      elsif column[:type] == :integer
        if validate
          validate[:pattern] = '[+-]?\d+'
          validate[:pattern_message] = '正しい整数値を入力して下さい。'
        end
      elsif column[:type] == :float || column[:type] == :decimal
        if validate
          validate[:pattern] = '[+-]?\d+\.?\d*'
          validate[:pattern_message] = '正しい実数値を入力して下さい。'
        end
      elsif column[:type] == :boolean
        column[:column] = 12
        column[:options] = [{label: '有効', value: true}, {label: '無効', value: false}]
        column[:default_option] = false
        validate = nil
      else
        column[:placeholder] = '' if column[:placeholder].blank?
      end
      column[:validate] = validate unless validate.nil?
      column
    end

    def initial_attachment(attachment)
      column = {}
      column[:name] = attachment.to_s
      column[:label] = self.default_label attachment.to_s
      column[:type] = :attachment
      if column[:name].index("image").present? || column[:name].index("photo") || column[:name].index("avatar") || column[:name].index("icon") || column[:name].index("picture")
        column[:content_type] = 'image/jpeg,image/png'
      else
        column[:content_type] = 'application/pdf'
      end
      column[:column] = 4
      column[:validate] = {
          required: '',
          required_message: ''
      }
      return column
    end

    def initial_form_attributes
      ret = {}
      ret[:label] = self.name
      ret[:icon] = self.default_icon(self.name)
      columns = []
      form_columns = []
      column_names = self.columns_hash.keys.dup - (%w(id created_at updated_at deleted_at))
      column_names.each do |column_name|
        form_columns << column_name.to_sym
        columns << initial_column(column_name)
      end

      attachments = self.reflect_on_all_attachments
                        .filter { |association| association.instance_of? ActiveStorage::Reflection::HasOneAttachedReflection }
                        .map(&:name)

      attachments.each do |attachment|
        form_columns << attachment.to_sym
        columns << initial_attachment(attachment)
      end

      ret[:columns] = columns
      ret[:form_columns] = form_columns
      ret[:search_columns] = []
      ret[:list_columns] = [:id]
      if column_names.index('name')
        ret[:search_columns] << :name
        ret[:list_columns] << :name
      elsif column_names.index('title')
        ret[:search_columns] << :title
        ret[:list_columns] << :title
      end
      if column_names.index('prefecture_code')
        ret[:search_columns] << :prefecture_code
      end
      if column_names.index('city_code')
        ret[:search_columns] << :city_code
      end
      ret[:edit_mode] = :view_form
      ret
    end

    def merge_form_attributes
      config = self.load_config
      columns = config[:columns]
      before_column_names = columns.map { |c| c[:name] }
      exist_column_names = []

      column_names = self.columns_hash.keys.dup - (%w(id created_at updated_at deleted_at))
      added_column_names = []
      column_names.each do |column_name|
        exist_column_names << column_name
        exists = false
        columns.each do |column|
          if column[:name].to_s == column_name.to_s
            exists = true
          end
        end
        unless exists
          columns << initial_column(column_name)
          added_column_names << column_name.to_sym
        end
      end

      attachments = self.reflect_on_all_attachments
                        .filter { |association| association.instance_of? ActiveStorage::Reflection::HasOneAttachedReflection }
                        .map(&:name)
      attachments.each do |attachment|
        exist_column_names << attachment.to_s
        exists = false
        columns.each do |column|
          if column[:name].to_s == attachment.to_s
            exists = true
          end
        end
        unless exists
          columns << initial_attachment(attachment)
          added_column_names << attachment.to_sym
        end
      end
      config[:form_columns] += added_column_names

      (before_column_names - exist_column_names).each do |name|
        config[:columns] = config[:columns].select { |column| column[:name].to_s != name.to_s }
        config[:search_columns] = config[:search_columns].select { |column_name| column_name.to_s != name.to_s }
        config[:form_columns] = config[:form_columns].select { |column_name| column_name.to_s != name.to_s }
        config[:list_columns] = config[:list_columns].select { |column_name| column_name.to_s != name.to_s }
      end
      config
    end

    def label
      self.load_config[:label]
    end

    def icon
      self.load_config[:icon]
    end

    def form_attributes
      config = self.load_config
      columns = config[:columns]
      ret = []
      config[:form_columns].each do |column_name|
        columns.each do |column|
          if column[:name].to_s == column_name.to_s
            ret << column
            next
          end
        end
      end
      ret
    end

    def prefecture_attributes
      self.form_attributes.select { |column|
        column[:default_prefecture_code].present?
      }
    end

    def permit_attributes
      attr = self.form_attributes.map { |a| ':' + a[:name] }
      time_attr = self.form_attributes.select { |column|
        column[:type] == :datetime || column[:type] == :timestamp
      }.map { |date_column|
        ":#{date_column[:name]}_time"
      }
      (attr + time_attr).join(', ')
    end

    def required?(column_name)
      validate = self.validate_data column_name
      validate[:required] == true ? true : false
    end

    def list_columns
      self.load_config[:list_columns]
    end

    def search_columns
      self.load_config[:search_columns]
    end

    def edit_mode
      self.load_config[:edit_mode]
    end

    def gmap_load_required?
      config = load_config
      if config[:edit_mode] != :modal
        return false
      end
      column_names = config[:columns].select { |c| c[:type] == :spatial && c[:show_map] }.map { |c| c[:name].to_sym }
      (config[:form_columns] && column_names).length > 0
    end

    def form_column(column_name)
      self.load_config[:columns].each do |column|
        if column[:name].to_s == column_name.to_s
          return column
        end
      end
      nil
    end

    def parsley_data(column_name)
      data = self.validate_data column_name
      p_data = {}
      data.keys.each do |key|
        if key == :datetime_greater
          s = data[key].split('<')
          if s.length == 2
            model = "#admin_#{self.name.underscore}"
            p_data[:start_date] = "#{model}_#{s[0].strip}"
            p_data[:end_date] = "#{model}_#{s[1].strip}"
            p_data[:start_time] = "#{model}_#{s[0].strip}_time"
            p_data[:end_time] = "#{model}_#{s[1].strip}_time"
            p_data[:parsley_datetime_greater] = "#{model}_#{s[0].strip}"
            p_data[:parsley_trigger] = 'change'
          end
        else
          p_data["parsley_#{key}"] = data[key]
        end
      end
      p_data
    end

    def validate_data(column_name)
      self.load_config[:columns].each do |column|
        if column[:name].to_s == column_name.to_s
          validate = column[:validate] || {}
          data = {}
          if validate[:required] == true
            data[:required] = true
            if validate[:required_message].present?
              data[:required_message] = validate[:required_message]
            end
          end
          if validate[:pattern].present?
            data[:pattern] = validate[:pattern]
            if validate[:pattern_message].present?
              data[:pattern_message] = validate[:pattern_message]
            end
          end

          if validate[:max_length].to_i > 0
            data[:maxlength] = validate[:max_length].to_i
            if validate[:max_length_message].present?
              data[:maxlength_message] = validate[:max_length_message]
            end
          end

          if validate[:min_length].to_i > 0
            data[:minlength] = validate[:min_length].to_i
            if validate[:min_length_message].present?
              data[:minlength_message] = validate[:min_length_message]
            end
          end

          if validate[:length].present?
            data[:length] = validate[:length]
            if validate[:length_message].present?
              data[:length_message] = validate[:length_message]
            end
          end

          if validate[:range].present?
            data[:range] = validate[:range]
            if validate[:range_message].present?
              data[:range_message] = validate[:range_message]
            end
          end

          if validate[:min].present?
            data[:min] = validate[:min]
            if validate[:min_message].present?
              data[:min_message] = validate[:min_message]
            end
          end

          if validate[:max].present?
            data[:max] = validate[:max]
            if validate[:max_message].present?
              data[:max_message] = validate[:max_message]
            end
          end

          if validate[:datetime_greater].present?
            data[:datetime_greater] = validate[:datetime_greater]
            if validate[:datetime_greater_message].present?
              data[:datetime_greater_message] = validate[:datetime_greater_message]
            else
              data[:datetime_greater_message] = "開始日時と終了日時が正しくありません。"
            end
          end

          return data
        end
      end
      {}
    end

    def load_config
      file = File.join(Rails.root, 'config', 'form_attributes', "#{self.name.underscore.gsub('admin/', '')}.yml")
      if File.exist? file
        YAML.load_file(file)
      else
        self.initial_form_attributes
      end
    end

    def add_permission
      file = File.join(Rails.root, 'config', 'settings', "permission.yml")
      permission_data = YAML.load_file(file)
      if permission_data['permission'][self.name.pluralize.underscore].nil?
        permission_data['permission'][self.name.pluralize.underscore] = '1,2,3'
        YAML.dump(permission_data, File.open(file, 'w'))
      end
    end

    def default_label(column_name)

      columns = self.columns.select { |column| column.name == column_name }
      if columns.length == 1
        return columns[0].comment if columns[0].comment.present?
      end

      if column_name.index('name')
        name = "#{column_name.gsub('name', '名称')}"
      elsif column_name.index('mail')
        name = "#{column_name.gsub('mail', 'メール')}"
      elsif column_name.index('content') || column_name.index('description')
        name = "#{column_name.gsub('content', '概要').gsub('description', '概要')}"
      elsif column_name.index('tel') || column_name.index('phone')
        name = "#{column_name.gsub('tel', '電話番号').gsub('phone', '電話番号')}"
      elsif column_name.index('fax')
        name = "#{column_name.gsub('fax', 'FAX')}"
      elsif column_name.index('url')
        name = "#{column_name.gsub('url', 'URL')}"
      elsif column_name.index('zip_code')
        name = "#{column_name.gsub('zip_code', '郵便番号')}"
      elsif column_name.index('prefecture_code')
        name = "#{column_name.gsub('prefecture_code', '都道府県')}"
      elsif column_name.index('city_code')
        name = "#{column_name.gsub('city_code', '市区町村')}"
      elsif column_name.index('address1')
        name = "#{column_name.gsub('address1', '町名番地')}"
      elsif column_name.index('address2')
        name = '建物等'
      elsif column_name.index('image')
        name = "#{column_name.gsub('image', '画像')}"
      elsif column_name.index('photo')
        name = "#{column_name.gsub('photo', '写真')}"
      end
      name.present? ? name : column_name
    end

    def default_icon(column_name)
      icon = 'fas fa-info-circle'
      if column_name.index('mail')
        icon = 'far fa-envelope'
      elsif column_name.index('content') || column_name.index('description')
        icon = 'fa-file-alt'
      elsif column_name.index('tel') || column_name.index('phone')
        icon = 'fas fa-mobile-alt'
      elsif column_name.index('fax')
        icon = 'fas fa-fax'
      elsif column_name.index('twitter')
        icon = 'fab fa-twitter'
      elsif column_name.index('facebook')
        icon = 'fab fa-facebook'
      elsif column_name.index('facebook')
        icon = 'fab fa-facebook-f'
      elsif column_name.index('github')
        icon = 'fab fa-github'
      elsif column_name.index('instagram')
        icon = 'fab fa-instagram-square'
      elsif column_name.index('url')
        icon = 'fas fa-link'
      elsif column_name.index('book')
        icon = 'fas fa-book'
      elsif column_name.index('location') || column_name.index('spot')
        icon = 'fas fa-map-marker-alt'
      elsif column_name.index('article')
        icon = 'fas fa-pen'
      elsif column_name.index('address1')
        icon = 'fas fa-road'
      elsif column_name.index('address2')
        icon = 'fas fa-building'
      elsif column_name.index('memo') || column_name.index('note')
        icon = 'far fa-edit'
      end
      icon
    end
  end

  def representation_path(image)
    Rails.application.routes.url_helpers.rails_representation_path(image, only_path: true)
  end
end

