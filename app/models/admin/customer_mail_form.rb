module Admin
  class CustomerMailForm
    include ActiveModel::Model

    attr_accessor :customer_mail_targets,
                  :customer_mail_target_statuses,


        def initialize(params: {})
          @user = CustomerMail.new(params[:customer_mail])
          params[:customer_mail_targets].each do |customer_mail_target|
            @department = CustomerMailTarget.new(customer_mail_target)
          end
          params[:customer_mail_target_statuses].each do |customer_mail_target_status|
            @department = CustomerMailTargetStatus.new(customer_mail_target_status)
          end

        end

    def save
      @user.save
      @department.save
      @address.save
    end


  end
end
