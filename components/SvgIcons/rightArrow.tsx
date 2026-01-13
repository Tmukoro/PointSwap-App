import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const RightArrow = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill="#757575"
      stroke="#757575"
      d="M.924.571a.254.254 0 0 0-.353 0 .254.254 0 0 0 0 .353l6.52 6.52a1.731 1.731 0 0 1 0 2.447l-6.52 6.52a.254.254 0 0 0-.004.347c.066.058.133.08.18.08a.242.242 0 0 0 .177-.074l6.52-6.52a2.24 2.24 0 0 0 0-3.153L.924.57Z"
    />
  </Svg>
)
export default RightArrow
