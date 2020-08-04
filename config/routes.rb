Rails.application.routes.draw do

  namespace :admin do
    resources :companies
  end
  namespace :admin do
    resources :login_histories
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
    end
  end

  get 'admin', to: 'admin/top#index'
  get 'zip_code/search'

  resources :uploads, only: [:create, :destroy]

  namespace :admin do
    get 'top/index'
    get 'top', to: 'top#index'
    resources :users
    resources :groups
    resources :articles
    resources :inquiries
    put 'users/lock/:id', to: 'users#lock'
    delete 'users/lock/:id', to: 'users#lock'
    patch 'users/confirm/:id', to: 'users#confirm_user', as: 'users_confirm'
    post 'users/resend_confirmation', to: 'users#resend_confirmation'
    resources :login_histories, only: :index
  end

  namespace :public do
  end

  namespace :master do
    resources :cities, only: [:show, :index]
  end

  root 'top#index'
  get 'top/index'


  devise_for :users, only: [:session, :password, :confirmation], controllers: {
      sessions: 'users/sessions',
      passwords: 'users/passwords',
      unlocks: 'users/unlocks',
      confirmations: 'users/confirmations'
  }
  patch '/admin/users/confirm/:id', to: 'admin/users#confirm_user', as: 'users_confirm'

end

