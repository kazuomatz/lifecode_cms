module Admin
  class ArticlesController < BaseController
    def index
      if request.xhr?
        objects = Admin::Article.all
        if params[:is_publish] == 'all'
        elsif params[:is_publish].present?
          objects = objects.where(is_publish: params[:is_publish])
        end

        if params[:category].present?
          objects = objects.tagged_with(params[:category])
        end
        objects = objects.order('updated_at desc').page(params[:page] || 1).per(20)
        pagination = view_context.paginate(objects, remote: true, window: 1)
        content = render_to_string(partial: 'list.html', locals: {objects: objects})
        render json: {pagination: pagination, content: content, page: params[:page] || 1, status: 'OK'}
      end
    end

    def new
      session[:article_session_id] = Time.zone.now.to_i.to_s + SecureRandom.hex()
      @article = Admin::Article.new
      @article.is_publish = false
    end

    def create
      @article = Admin::Article.new(update_params)
      @article.save!
      Upload.where(article_id: session[:article_session_id]).each do |up|
        up.article_id = @article.id
        up.save
      end
      session[:article_session_id] = nil
      redirect_to admin_articles_path
    end

    def edit
      @article = Admin::Article.find params[:id]
      #@article.content = @article.content.gsub('http://20.188.7.160/s3_images/', 'https://xxxx.com/s3_images/')
    end

    def update
      @article = Admin::Article.find params[:id]
      @article.update(update_params)
      redirect_to admin_articles_path
    end

    def destroy
      @article = Admin::Article.find params[:id]
      @article.destroy
      render json: {status: 200}
    end

    def show
      @article = Admin::Article.find params[:id]
      #@article.content = @article.content.gsub('http://20.188.7.160/s3_images/', 'https://xxxx.com/s3_images/')
    end

    private

    def update_params
      params.require(:admin_article).permit(:title, :catch, :content, :main_image, :tag_list, :is_publish)
    end

  end

end