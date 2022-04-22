class Point
  def self.from_x_y(x, y)
    if x.present? && y.present?
      wkt_parser = RGeo::WKRep::WKTParser.new(nil, support_ewkt: true)
      wkt_parser.parse "SRID=4326;POINT(#{x} #{y})"
    else
      nil
    end
  end

  def self.to_s(geom)
    if geom
      "SRID=4326;POINT(#{geom.x} #{geom.y})"
    else
      "SRID=4326;POINT(-1 -1)"
    end
  end
end