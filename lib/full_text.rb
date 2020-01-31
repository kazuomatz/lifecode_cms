class FullText
  @dic_path = '/usr/local/lib/mecab/dic/mecab-ipadic-neologd'

  def self.wakachi(target_text)
    dic_path = @dic_path
    nm = Natto::MeCab.new("-d #{dic_path}")
    ret = []
    nm.parse(target_text) do |n|
      features = n.feature.split(',')
      if features[0] == '名詞' && features[1] != '数詞'
        ret << n.surface.to_s if n.surface.length > 1
        features[6..12].each do |f|
          if f != '*'
            ret << f if ret.index(f).nil?
          end
        end
      end
    end
    ret
  end

  def self.create_index(target_text)
    wakachi(target_text).join(' ')
  end
end
