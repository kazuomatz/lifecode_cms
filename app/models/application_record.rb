class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  class << self
    def initial_form_attributes
      ret = {}
      ret[:label] = self.name
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

        column[:validate] = validate
        if column[:type] == :datetime || column[:type] == :timestamp
          column[:show_time] = false
        end
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

    def form_attributes
      self.load_config[:columns]
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

    def validate_data(column_name)
      self.load_config[:columns].each do |column|
        if column[:name].to_s == column_name.to_s
          validate = column[:validate]
          data = {}
          if validate[:required] == true
            data[:parsley_required] = true
            if validate[:required_message].present?
              data[:parsley_required_message] = validate[:required_message]
            end
          end
          if validate[:max_length].to_i > 0
            data[:parsley_max_length] = validate[:max_length].to_i
            if validate[:max_length_message].present?
              data[:max_length_message] = validate[:max_length_message]
            end
          end

          if validate[:max_length].to_i > 0
            data[:parsley_maxlength] = validate[:max_length].to_i
            if validate[:max_length_message].present?
              data[:parsley_maxlength_message] = validate[:max_length_message]
            end
          end

          if validate[:min_length].to_i > 0
            data[:parsley_minlength] = validate[:min_length].to_i
            if validate[:min_length_message].present?
              data[:parsley_minlength_message] = validate[:min_length_message]
            end
          end
          return data
        end
        return {}
      end

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
