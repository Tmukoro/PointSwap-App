import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const UploadIcon = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    fill="none"
    {...props}
  >
    <Path
      fill="#6734F2"
      d="M42 0H18C6 0 0 6 0 18v24c0 12 6 18 18 18h24c12 0 18-6 18-18V18C60 6 54 0 42 0Zm-1.5 32.25h-8.25v8.25c0 1.23-1.02 2.25-2.25 2.25s-2.25-1.02-2.25-2.25v-8.25H19.5c-1.23 0-2.25-1.02-2.25-2.25s1.02-2.25 2.25-2.25h8.25V19.5c0-1.23 1.02-2.25 2.25-2.25s2.25 1.02 2.25 2.25v8.25h8.25c1.23 0 2.25 1.02 2.25 2.25s-1.02 2.25-2.25 2.25Z"
    />
  </Svg>
)
export default UploadIcon