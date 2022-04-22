class User < ApplicationRecord
  # Include default devise modules. Others available are:
  devise :database_authenticatable, :lockable, :rememberable, :recoverable, :confirmable, :trackable
  acts_as_paranoid

  has_many :groups_users
  has_many :groups, through: :groups_users
  has_one_attached :avatar

  def operator_role?
    role == 2
  end

  def administrator_role?
    role == 1
  end

  def normal_role?
    role == 3
  end

  def greater_than_equal_to_normal_role?
    true
  end

  def greater_than_equal_to_operator_role?
    role == 1 || role == 2
  end

  def self.search(params = {})
    users = User.all
    users = users.where('name like ?', "%#{params[:name]}%") if params[:name].present?
    users = users.where('name_kana like ?', "%#{params[:name_kana]}%") if params[:name_kana].present?
    users = users.where('email like ?', "%#{params[:email]}%") if params[:email].present?
    users
  end

  def role_name
    if administrator_role?
      Settings.admin.user.role["1"]
    elsif operator_role?
      Settings.admin.user.role["2"]
    else
      Settings.admin.user.role["3"]
    end
  end

  def lock_expired?
    !permanent_lock && locked_at && locked_at < UNLOCK_IN.ago
  end

  if Rails.env == 'production'
    UNLOCK_IN = 60.minutes # 1時間ロック継続
    MAXIMUN_ATTEMPTS = 10 # 10回連続ミスでロック
  else
    UNLOCK_IN = 30.seconds # 1分ロック継続
    MAXIMUN_ATTEMPTS = 3 # 3回連続ミスでロック
  end

  def password_required?
    !persisted? || !password.blank? || !password_confirmation.blank?
  end

  def lock_access!(opts = {})
    self.locked_at = Time.now.utc
    save(validate: false)
  end

  # Unlock a user by cleaning locked_at and failed_attempts.
  def unlock_access!
    self.locked_at = nil
    self.failed_attempts = 0
    save(validate: false)
  end

  def unlock_access
    self.locked_at = nil
    self.failed_attempts = 0
  end


  # Verifies whether a user is locked or not.
  def access_locked?
    !!locked_at && !lock_expired?
  end

  def attempts_exceeded?
    if self.access_locked?
      self.failed_attempts >= MAXIMUN_ATTEMPTS
    else
      false
    end
  end

  def update_failed_attempts
    self.failed_attempts += 1
    save(validate: false)
    if self.failed_attempts >= MAXIMUN_ATTEMPTS
      self.lock_access!
    end
  end

end
