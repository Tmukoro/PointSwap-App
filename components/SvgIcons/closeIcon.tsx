import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const CloseIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      fillRule="evenodd"
      d="M.226.226a.772.772 0 0 0 0 1.092l6.005 6.004-6.005 6.005a.772.772 0 0 0 1.092 1.091l6.004-6.004 6.005 6.004a.772.772 0 1 0 1.091-1.091L8.415 7.322l6.004-6.004A.772.772 0 1 0 13.327.226L7.322 6.23 1.318.226a.772.772 0 0 0-1.092 0Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default CloseIcon
