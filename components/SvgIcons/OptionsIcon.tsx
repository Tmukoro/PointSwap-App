import * as React from "react"
import Svg, { Circle, SvgProps } from "react-native-svg"
const OptionsIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}
  >
    <Circle cx={18} cy={10} r={2} fill="#fff" />
    <Circle cx={18} cy={18} r={2} fill="#fff" />
    <Circle cx={18} cy={26} r={2} fill="#fff" />
  </Svg>
)
export default OptionsIcon
