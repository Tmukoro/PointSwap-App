import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const PolygonIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={8}
    fill="none"
    {...props}
  >
    <Path
      fill="#757575"
      d="M4.838 6.646a1 1 0 0 1-1.732 0L.136 1.5A1 1 0 0 1 1.002 0h5.941a1 1 0 0 1 .866 1.5L4.84 6.646Z"
    />
  </Svg>
)
export default PolygonIcon