class Point
	def self.from_x_y(x, y)
		x.present? && y.present? ? "POINT(#{x} #{y})" : nil
	end

  def self.to_s(geom)
		if geom
			"POINT(#{geom.x} #{geom.y})"
		else
			"POINT(-1 -1)"
		end
	end
end