class String

  def utf8_normalize
    self.encode("UTF-16BE", "UTF-8", :invalid => :replace, :undef => :replace, :replace => '?').encode("UTF-8")
  end


  def replate_url_to_link shorten = false
    URI.extract(self, %w{http https}).uniq.each do |uri|
      unless uri.match(/(\.jpg|\.jpeg|\.png)/)
        if shorten
          self.gsub!(uri, %Q{<a href="#{uri}">[リンク]</a>})
        else
          self.gsub!(uri, %Q{<a href="#{uri}">#{uri}</a>})
        end
      end
    end
    return self
  end

  def sjisable
    str = self
    #変換テーブル上の文字を下の文字に置換する
    from_chr = "\u{301C 2212 00A2 00A3 00AC 2013 2014 2016 203E 00A0 00F8 203A}"
    to_chr = "\u{FF5E FF0D FFE0 FFE1 FFE2 FF0D 2015 2225 FFE3 0020 03A6 3009}"
    str.tr!(from_chr, to_chr)
    #変換テーブルから漏れた不正文字は?に変換し、さらにUTF8に戻すことで今後例外を出さないようにする
    str = str.encode("Windows-31J", "UTF-8", :invalid => :replace, :undef => :replace).encode("UTF-8", "Windows-31J")
  end

end