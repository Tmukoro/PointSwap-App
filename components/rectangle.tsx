import * as React from "react";
import Svg, { Rect, SvgProps } from "react-native-svg";

interface IconProps extends SvgProps {
  width: number
}
const RectangleIcon:React.FC<IconProps> = ({width = 36, ...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={37}
    height={2}
    fill="none"
    {...props}
  >
    <Rect width={width} height={1} x={0.5} y={0.5} fill="#757575" rx={0.5} />
  </Svg>
)
export default RectangleIcon;