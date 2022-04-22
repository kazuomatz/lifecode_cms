class ColorUtil

  class << self
    def darken(hex_color, amount = 0.4)
      if hex_color.nil?
        return nil
      end
      hex_color = hex_color.gsub('#', '')
      rgb = hex_color.scan(/../).map { |color| color.hex }
      rgb[0] = (rgb[0].to_i * amount).round
      rgb[1] = (rgb[1].to_i * amount).round
      rgb[2] = (rgb[2].to_i * amount).round
      "#%02x%02x%02x" % rgb
    end

    def lighten(hex_color, amount = 0.6)
      if hex_color.nil?
        return nil
      end
      hex_color = hex_color.gsub('#', '')
      rgb = hex_color.scan(/../).map { |color| color.hex }
      rgb[0] = [(rgb[0].to_i + 255 * amount).round, 255].min
      rgb[1] = [(rgb[1].to_i + 255 * amount).round, 255].min
      rgb[2] = [(rgb[2].to_i + 255 * amount).round, 255].min
      "#%02x%02x%02x" % rgb
    end
  end

end
