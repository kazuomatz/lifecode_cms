class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  class << self
    def initial_form_attributes
      ret = {}
      ret[:label] = self.name
      ret[:icon] = 'fa-info-circle'
      columns = []
      column_names = self.columns_hash.keys.dup  - (%w(id created_at updated_at deleted_at))
      column_names.each do| column_name |
        column = {}
        column[:name] = column_name
        column[:label] = column_name
        column[:icon] = "fas fa-info-circle"
        column[:type] = self.columns_hash[column_name].type
        column[:column] = 4

        validate = {
            max_length: -1,
            max_length_message: '',
            min_length: -1,
            min_length_message: '',
            pattern: '',
            pattern_message: ''
        }

        if column_name == 'name' || column_name == 'title'
          validate[:required] = true
        else
          validate[:required] = false
        end

        validate[:required_message] = ''

        if column[:type] == :datetime || column[:type] == :timestamp
          column[:show_time] = false
          column[:column] = 3
          validate = {
              required: '',
              required_message: '',
              datetime_greater: '',
              datetime_greater_message: ''
          }
        end

        if column[:type] == :text
          column[:column] = 6
          column[:rows] = 5
          column[:icon] = ''
        end

        column[:validate] = validate
        columns << column
      end

      attachments = self.reflect_on_all_attachments
                    .filter { |association| association.instance_of? ActiveStorage::Reflection::HasOneAttachedReflection }
                    .map(&:name)

      attachments.each do |attachment|
        column = {}
        column[:name] = attachment.to_s
        column[:label] = attachment.to_s
        column[:type] = :attachment
        column[:content_type] = 'image/jpeg,image/png'
        column[:column] = 4
        column[:validate] = {
            required: '',
            required_message: ''
        }
         columns << column
      end


      ret[:columns] = columns
      ret[:search_columns] = []
      ret[:list_columns] = [:id]
      if column_names.index('name')
        ret[:search_columns] << :name
        ret[:list_columns] << :name
      elsif column_names.index('title')
        ret[:search_columns] << :title
        ret[:list_columns] << :title
      end
      if column_names.index('prefecture_id')
        ret[:search_columns] << :prefecture_id
      end
      if column_names.index('city_id')
        ret[:search_columns] << :city_id
      end
      ret
    end

    def label
      self.load_config[:label]
    end

    def icon
      self.load_config[:icon]
    end

    def form_attributes
      self.load_config[:columns]
    end

    def permit_attributes
      attr = self.form_attributes.map { |a| ':' + a[:name] }
      time_attr = self.form_attributes.select { |column|
        column[:type] == :datetime || column[:type] == :timestamp
        }.map { |date_column |
          ":#{date_column[:name]}_time"
      }
      (attr + time_attr).join(', ')
    end

    def required?(column_name)
      validate = self.validate_data column_name
      validate[:parsley_required] == true ? true : false
    end

    def list_columns
      self.load_config[:list_columns]
    end

    def search_columns
      self.load_config[:search_columns]
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
              data[:pattern_message] = validate[:max_length_message]
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
      return {}
    end

    def load_config
      file = File.join(Rails.root,'config','form_attributes',"#{self.name.underscore}.yml")
      if File.exist? file
        YAML.load_file( file )
      else
        self.initial_form_attributes
      end
    end
  end
end
